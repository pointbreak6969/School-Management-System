import connectDb from '../../../lib/dbConnect';
import Document from "../../../models/User.model";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDb();

  try {
    const token = await getToken({ req, secret: process.env.NEXT_SECRET });
    if (!token || !token.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in.",
        },
        {
          status: 401,
        }
      );
    }

    const userEmail = token.email;

    const query = { signedBy: userEmail };

    const documents = await Document.find(query);

    return NextResponse.json(
      {
        success: true,
        message: "Signed documents fetched successfully",
        data: documents,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching signed documents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}