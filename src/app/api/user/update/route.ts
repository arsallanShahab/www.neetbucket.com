import { auth, createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function PUT(request: Request, response: Response) {
  const { userId } = auth();
  const body = await request.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    //update name of the user
    const user = await clerk.users.updateUser(userId, {
      firstName: body.firstName,
      lastName: body.lastName,
    });
    //update user metadata
    const updateUser = await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        phone: body.phone,
        bio: body.bio,
        address: body.address,
      },
    });

    if (!updateUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ user: updateUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
