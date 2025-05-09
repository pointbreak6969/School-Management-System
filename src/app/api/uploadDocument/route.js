import connectDb from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import Document from "../../../models/document.model";
import { uploadOnAws } from "../../../lib/uploadOnAWS";


export async function POST(req) {
  await connectDb();
  try {
    const data = await req.formData();
    const file = data.get("file");
    const title = data.get("title");
    const sender = data.get("sender");
    const receiversData = JSON.parse(data.get("receivers"));
    const receivers = receiversData.map((receiver) => receiver.value);
    const signatureField = JSON.parse(data.get("signatureField"));

    if (!file || !title || !sender || !receivers || !signatureField) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // Use the helper function to handle file upload
   const awsKey = await uploadOnAws(file, "document");
    // Save document with Cloudinary URL
    const result = await Document.create({
      title,
      documentRef: awsKey.key,
      sender,
      receivers: receivers,
      signatureField,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully to Cloudinary",
        data: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
export async function PATCH(req) {
  await connectDb();
  try {
    const { searchParams } = new URL(req.url); // Get id from query parameters
    const id = searchParams.get("id");
    const data = await req.formData();
    const signedBy = data.get("signedBy");
    const signedTime = Date.now();
    const signedDocument = data.get("signedDocument");
    const signatureFile = data.get("signatures");
    if (!id || !signedBy || signedDocument || signatureFile) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }
    let signatureUrl = null;
    if (signatureFile) {
      signatureUrl = await uploadOnAws(signatureFile, "signature");
    }
    let signedDocumentUrl = null;
    if (signedDocument) {
      signedDocumentUrl = await uploadOnAws(signedDocument, "document");
    }
    const document = await Document.findById(id);
    if (!document) {
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

    // Check if user is authorized to sign (is in receivers list)
    if (!document.receivers.includes(signedBy)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to sign this document",
        },
        {
          status: 403,
        }
      );
    }

    // Check if user has already signed
    if (document.signedBy && document.signedBy.includes(signedBy)) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already signed this document",
        },
        {
          status: 400,
        }
      );
    }
    const updateData = {
      $push: {
        signedBy: signedBy,
        signedTime: {
          user: signedBy,
          time: signedTime,
        },
      },
      // Add signature URL if available
      ...(signatureUrl && { signatures: signatureUrl }),
      // Add signed document path if available
      ...(signedDocument && { signedDocument: signedDocumentUrl }),
    };
    // Update the document with new signing information
    const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if all receivers have signed and update status if needed
    const allSigned = updatedDocument.isFullySigned();
    if (allSigned) {
      updatedDocument.status = "completed";
      await updatedDocument.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document signed successfully",
        data: {
          id: updatedDocument._id,
          status: updatedDocument.status,
          signedBy: updatedDocument.signedBy,
          remainingSigners: updatedDocument.receivers.filter(
            (receiver) => !updatedDocument.signedBy.includes(receiver)
          ),
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating document:", error);
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
