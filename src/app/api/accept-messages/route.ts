import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            "failed to update the user's isAcceptingMessage status during database update",
        },
        { status: 501 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "update the user's isAcceptingMessage status",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "failed to update the user's isAcceptingMessage status :",
      error
    );
    return Response.json(
      {
        success: false,
        message: "failed to update the user's isAcceptingMessage status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found during database call",
        },
        { status: 501 }
      );
    }
  
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
        message: `User is ${
          !foundUser.isAcceptingMessage && "not"
        } accepting Messages`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
        "failed to get the user's isAcceptingMessage status :",
        error
      );
      return Response.json(
        {
          success: false,
          message: "failed to get the user's isAcceptingMessage status",
        },
        { status: 500 }
      );
  }
}
