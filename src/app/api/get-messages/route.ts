import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 402 }
    );
  }
  console.log("session :", session);
  const userId = new mongoose.Types.ObjectId(session.user._id);
  console.log("userId :", userId);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match user by _id
      { $unwind: "$messages" }, // Unwind messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort by message date (newest first)
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" }, // Push all messages back into array
        },
      },
    ]);

    console.log("user :", user);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No Messages Found",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages, // Messages are already sorted by the pipeline
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while getting messages of user :", error);
    return Response.json(
      {
        success: false,
        message: "Error while getting messages of user",
      },
      { status: 500 }
    );
  }
}
