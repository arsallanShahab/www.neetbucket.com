import { connectToDatabase } from "@/lib/mongodb";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const { db } = await connectToDatabase();
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  //   console.log("Webhook data:", evt.data);
  const eventType = evt.type;

  //   console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  //   console.log("Webhook body:", body);

  // Store the webhook in the database
  const {
    email_addresses,
    first_name,
    last_name,
    phone_numbers,
    image_url,
    created_at, //1709308065420
  } = evt.data as any;
  const user = {
    clerk_id: id,
    name: `${first_name} ${last_name}`,
    email: email_addresses[0]?.email_address,
    avatar: image_url,
    createdAt: new Date(created_at),
  };
  const addOrUpdateUser = await db
    .collection("users")
    .updateOne({ email: user.email }, { $set: user }, { upsert: true });

  console.log("User added or updated:", addOrUpdateUser);

  if (!addOrUpdateUser) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  return new Response("", { status: 200 });
}
