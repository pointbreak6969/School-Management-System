import { NextResponse } from "next/server";
import connectDb from "../../../../lib/dbConnect";
import Document from "../../../../models/document.model";

export async function GET(req, { params }) {
    try {
        
        const documentId = await params.id;
        await connectDb();      
      const document = await Document.findById(documentId);      
      if (!document) {
        console.log("Document not found");
        return NextResponse.json(
          {
            success: false,
            message: "Document not found",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(
        {
          success: true,
          data: document,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error("Error fetching document:", error);
      return NextResponse.json(
        {
          success: false,
          message: "An unexpected error occurred",
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
}