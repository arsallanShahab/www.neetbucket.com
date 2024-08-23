import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    console.log(code, "code");
    if (!code) {
      return Response.json(
        {
          success: false,
          message: "Please provide a coupon",
        },
        {
          status: 400,
        },
      );
    }
    const { db } = await connectToDatabase();
    const coupons = await db.collection("coupons").findOne({
      code: code,
    });
    if (!coupons) {
      return Response.json({
        success: false,
        message: "Coupon not found",
      });
    }
    return Response.json({
      success: true,
      message: "Coupon found",
      data: coupons,
    });
  } catch (error) {
    console.log(error, "error");
    return Response.json({
      success: false,
      error: error,
      message: "Something went wrong",
    });
  }
}
