import { connectToDatabase } from "@/lib/mongodb";
import { generateReceipt } from "@/lib/utils";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export interface HardCopyOrder {
  currency: string;
  order_id: string;
  items: {
    id: string;
    title: string;
    thumbnail: {
      url: string;
      fileName: string;
      size: number;
    };
    quantity: number;
    price: number;
  }[];
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
  shipping_details: {
    address: string;
    city: string;
    state: string;
  };
  delivery: {
    date: Date | string | null;
    status: "pending" | "packed" | "dispatched" | "delivered" | "cancelled";
    courier: string | null;
    tracking_id: string | null;
  };
  total_quantity: number;
  total_amount: number;
  order_type: "softcopy" | "hardcopy";
  payment_status: string;
  created_at: Date | string;
}

export async function POST(req: Request) {
  const body: {
    items: {
      id: string;
      title: string;
      thumbnail: {
        url: string;
        fileName: string;
        size: number;
      };
      quantity: number;
      price: number;
    }[];
    total_amount: number;
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
    const receiptId = generateReceipt();
    const order = await instance.orders.create({
      amount: body.total_amount * 100,
      currency: "INR",
      receipt: receiptId,
    });
    const orderObject: HardCopyOrder = {
      currency: "INR",
      order_id: order.id,
      user_id: body.user_id,
      user_email: body.email,
      user_name: body.name,
      user_phone: body.phone,
      items: body.items,
      receipt: receiptId,
      billing_details: {
        address: body.address,
        city: body.city,
        state: body.state,
      },
      shipping_details: {
        address: body.address,
        city: body.city,
        state: body.state,
      },
      delivery: {
        date: null,
        status: "pending",
        courier: null,
        tracking_id: null,
      },
      order_type: "hardcopy",
      payment_status: "pending",
      total_quantity: body.total_items,
      total_amount: body.total_amount,
      created_at: new Date(),
    };
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection("orders");
    const insertOrder = await ordersCollection.insertOne(orderObject);
    if (!insertOrder) {
      return NextResponse.json({
        success: false,
        message: "Failed to place order",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order_id: order.id,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      body: {
        message: "Internal server error",
      },
    });
  }
}
