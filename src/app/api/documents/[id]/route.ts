import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import PdfModel from "../../../../../model/Pdf";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  await connectDb();
  const { id } = context.params; // ✅ Correct destructuring

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
  const { id } = context.params;

  try {
    const { email, xfdfSigned } = await request.json();
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

    document.xfdf.push(xfdfSigned);
    document.signedBy.push(email);

    if (document.signedBy.length === document.emails.length) {
      document.signed = true;
    }

    await document.save();

    return NextResponse.json(
      { success: true, message: "Document Signed", data: document },
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
  const { id } = context.params;

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
