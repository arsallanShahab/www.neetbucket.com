import { connectToDatabase } from "@/lib/mongodb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  // Get the userId from auth() -- if null, the user is not logged in
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { db } = await connectToDatabase();
  const softcopy_orders = await db
    .collection("orders")
    .find({
      user_email: user?.emailAddresses[0].emailAddress || "",
      payment_status: "paid",
      $or: [{ order_type: "soft-copy" }, { order_type: "softcopy" }],
    })
    .sort({ created_at: -1 })
    .toArray();

  const hardcopy_orders = await db
    .collection("orders")
    .find({
      user_email: user?.emailAddresses[0].emailAddress || "",
      payment_status: "paid",
      $or: [{ order_type: "hard-copy" }, { order_type: "hardcopy" }],
    })
    .toArray();

  const orders = {
    softcopy_orders: softcopy_orders,
    hardcopy_orders: hardcopy_orders,
  };

  // Perform your Route Handler's logic with the returned user object

  return NextResponse.json(
    {
      success: true,
      orders: orders,
    },
    { status: 200 },
  );
}
