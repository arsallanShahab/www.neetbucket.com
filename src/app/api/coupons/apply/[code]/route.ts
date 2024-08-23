import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } },
) {
  try {
    const code = params.code;
    if (!code) {
      return NextResponse.json({
        success: false,
        message: "Please provide a coupon code",
      });
    }

    const { db } = await connectToDatabase();
    const coupons = await db.collection("coupons").findOne({
      code: code,
    });
    if (!coupons) {
      return NextResponse.json({
        success: false,
        message: "Coupon not found",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Coupon found",
      data: coupons,
    });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      success: false,
      error: error,
      message: "Something went wrong",
    });
  }
}
