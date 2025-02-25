import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import PdfModel from "../../../../../model/Pdf";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await connectDb();
  const id = context.params.id; // ✅ Direct access to avoid error

  try {
    const document = await PdfModel.findById(id);
    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: document },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await connectDb();
  const id = context.params.id; // ✅ Direct access to avoid error

  try {
    const requestData = await request.json();
    const { email, newDocument } = requestData;
    
    // Check if required fields are present
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const document = await PdfModel.findById(id);

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    if (document.signedBy.includes(email)) {
      return NextResponse.json(
        { success: false, message: "User already signed the document" },
        { status: 400 }
      );
    }

    document.signedBy.push(email);

    if (document.signedBy.length === document.emails.length) {
      document.signed = true;
    }
    
    // Only update document content if newDocument is provided
    if (newDocument !== undefined) {
      document.document = newDocument;
    }
    
    // Use updateOne with runValidators:false to bypass the required field validation
    // if we're not updating that field
    await PdfModel.updateOne(
      { _id: id },
      { 
        signedBy: document.signedBy,
        signed: document.signed,
        ...(newDocument !== undefined ? { document: newDocument } : {})
      },
      { runValidators: false }
    );

    const updatedDoc = await PdfModel.findById(id);

    return NextResponse.json(
      { success: true, message: "Document Signed", data: updatedDoc },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await connectDb();
  const id = context.params.id; // ✅ Direct access to avoid error

  try {
    const document = await PdfModel.findByIdAndDelete(id);

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting document" },
      { status: 500 }
    );
  }
}
