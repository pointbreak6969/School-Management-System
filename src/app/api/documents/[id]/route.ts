import connectDb from "@/lib/connectDb";
import PdfModel from "../../../../../model/Pdf";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDb();
  try {
    const document = await PdfModel.findById(params.id);
    if (!document) {
      return Response.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDb();
  try {
    const { email, xfdfSigned } = await request.json();
    const document = await PdfModel.findById(params.id);
    if (!document) {
      return Response.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }
    if (document.signedBy.includes(email)) {
      return Response.json(
        {
          success: false,
          message: "User already signed the document",
        },
        { status: 400 }
      );
    }
    document.xfdf.push(xfdfSigned);
    document.signedBy.push(email);
    if (document.signedBy.length === document.emails.length) {
      document.signed = true;
    }
    await document.save();
    return Response.json(
      {
        success: true,
        message: "Document Signed",
        data: document,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error updating document",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDb();

  try {
    const document = await PdfModel.findByIdAndDelete(params.id);

    if (!document) {
      return Response.json(
        {
          success: false,
          message: "Document not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Document deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
 
    return Response.json(
      {
        success: false,
        message: "Error deleting document",
      },
      { status: 500 }
    );
  }
}
