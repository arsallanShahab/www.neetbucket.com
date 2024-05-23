import { connectToDatabase } from "@/lib/mongodb";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature") as string;
    validateWebhookSignature(
      JSON.stringify(text),
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    const payment = JSON.parse(text);
    // if (payment.event !== "payment.captured") {
    //   return new Response("Success! webhook working", {
    //     status: 200,
    //   });
    // }
    const entity = payment.payload.payment.entity;
    const orderType = entity.notes.order_type;

    if (orderType === "softcopy") {
      const { db } = await connectToDatabase();
      const ordersCollection = db.collection("orders");
      const update = await ordersCollection.updateOne(
        { order_id: entity.order_id },
        {
          $set: {
            payment_status: "paid",
            payment_id: entity.id,
          },
        },
      );
      return new Response("Success! webhook working", {
        status: 200,
      });
    }

    if (orderType === "hardcopy") {
      const { db } = await connectToDatabase();
      const ordersCollection = db.collection("orders");
      const update = await ordersCollection.updateOne(
        { order_id: entity.order_id },
        {
          $set: {
            payment_status: "paid",
            payment_id: entity.id,
          },
        },
      );
      return new Response("Success! webhook working", {
        status: 200,
      });
    }

    return new Response("Success! webhook working", {
      status: 200,
    });
  } catch (error) {
    const err = error as Error & { message: string };
    return new Response(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}
