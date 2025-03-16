import { NextResponse } from "next/server";
import connectDb from "@/lib/dbConnect";
import Document from "@/models/document.model";

export async function GET(req, { params }) {
    try {
        
        const documentId = params.id;
        await connectDb();
      console.log("Fetching document with ID:", documentId); // For debugging
      
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
      
      console.log("Document found:", document);
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