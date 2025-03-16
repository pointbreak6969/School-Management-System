import connectDb from "@/lib/dbConnect";
import Document from "@/models/document.model";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDb();
  console.log("Database connected successfully");

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
    const query = {
      receivers: { $in: [userEmail] }, 
      signedBy: { $ne: userEmail },  
    };

    console.log("Query:", query);

    const documents = await Document.find(query);

    if (documents.length === 0) {
      console.log("No matching documents found");
      return NextResponse.json(
        {
          success: true,
          message: "No unsigned documents found",
          data: [],
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Unsigned documents fetched successfully",
        data: documents,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching unsigned documents:", error);
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