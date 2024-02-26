import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

interface RequestBody {
  email: string;
  password: string;
}
export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { email, password } = body;
    console.log("body", body);

    if (!email || !password)
      return Response.json("Email and password are required");

    const { db } = await connectToDatabase();
    const users = db.collection("users").findOne({ email });
  } catch (error) {
    console.error("Error in login route", error);
    return Response.json("Internal server error", { status: 500 });
  }
}
