import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { name, discount, expiry, code, type } = await req.json();
  if (!name || !discount || !code) {
    return NextResponse.json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    const { db } = await connectToDatabase();
    const existingCoupon = await db.collection("coupons").findOne({
      code,
    });
    if (existingCoupon) {
      return NextResponse.json({
        success: false,
        message: "Coupon with this code already exists",
      });
    }
    const expiryDate = new Date(expiry);
    if (expiry && expiryDate < new Date()) {
      return NextResponse.json({
        success: false,
        message: "Expiry date should be greater than today",
      });
    }
    const coupon = await db.collection("coupons").insertOne({
      name,
      discount,
      type,
      expiry: expiry ? expiryDate : null,
      code,
      usedBy: [],
      usedCount: 0,
      createdAt: new Date(),
    });
    return NextResponse.json({
      success: true,
      message: "Coupon added successfully",
      data: coupon,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
