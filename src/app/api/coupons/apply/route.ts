import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    console.log(code, "code");
    if (!code) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon code",
      });
    }
    const { db } = await connectToDatabase();
    const coupons = await db.collection("coupons").findOne({
      code: code,
    });
    if (!coupons) {
      return NextResponse.json({
        success: false,
        message: "Invalid coupon code",
      });
    }
    return NextResponse.json({
      success: true,
      data: coupons,
      message: "Coupon applied successfully",
    });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
}
