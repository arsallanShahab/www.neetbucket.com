import { connectToDatabase } from "@/lib/mongodb";
import { generateReceipt } from "@/lib/utils";
import { WithoutId } from "mongodb";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { IMongoDBChapter } from "../../webhook/contentful/add-to-mongodb/route";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export interface SoftCopyOrder {
  currency: string;
  order_id: string;
  items: IMongoDBChapter[]; // Optional array of strings (can be null)
  receipt?: string; // Optional string (can be null)
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  billing_details: {
    address: string;
    city: string;
    state: string;
  };
  total_quantity: number;
  isDiscounted: boolean;
  discount_amount?: number;
  total_amount: number;
  order_type: "softcopy" | "hardcopy";
  payment_status: string;
  created_at: Date | string;
}

export async function POST(req: Request) {
  const body: {
    items: { sys: { id: string } }[];
    total_amount: number;
    isDiscounted: boolean;
    discount_amount: number;
    total_items: number;
    user_id: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  } = await req.json();
  console.log(body);
  try {
    const boughtChaptersIds = body.items.map((item) => {
      return item.sys.id;
    });
    const { db } = await connectToDatabase();
    const chapters = (await db
      .collection("chapters")
      .find()
      .toArray()) as unknown as WithoutId<IMongoDBChapter>[];
    const boughtChapters = chapters.filter((chapter) => {
      return boughtChaptersIds.includes(chapter.contentfulId);
    });
    // console.log(boughtChapters, "boughtChapters");
    const receiptId = generateReceipt();
    const createOrder = await instance.orders.create({
      amount: body.total_amount * 100,
      currency: "INR",
      receipt: receiptId,
    });
    const orderObject: SoftCopyOrder = {
      currency: "INR",
      order_id: createOrder.id,
      user_id: body.user_id,
      user_email: body.email,
      user_name: body.name,
      user_phone: body.phone,
      order_type: "softcopy",
      payment_status: "pending",
      billing_details: {
        address: body.address,
        city: body.city,
        state: body.state,
      },
      items: boughtChapters,
      isDiscounted: body.isDiscounted,
      discount_amount: body.discount_amount,
      total_quantity: body.total_items,
      total_amount: body.total_amount,
      created_at: new Date(),
      // created_at: new Date(),
    };
    const orderCollection = db.collection("orders");
    const insertOrder = await orderCollection.insertOne(orderObject);
    // console.log(insertOrder, "insertOrder");
    if (!insertOrder) {
      return NextResponse.json({
        success: false,
        message: "Failed to save order in database",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order_id: createOrder.id,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to create order",
    });
  }
}
