import connectDb from "../../../lib/dbConnect";
import { join } from "path";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import Document from "../../../models/document.model";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { uploadOnCloudinary } from "../../../lib/uploadOnCloudinary";

// Helper function for handling file uploads
async function handleFileUpload(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  // Save file temporarily to local server
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);
  const filePath = join(process.cwd(), "public/uploads", file.name);

  try {
    await writeFile(filePath, fileBuffer);
  } catch (err) {
    throw new Error("Failed to upload file locally");
  }

  // Upload file to Cloudinary
  let cloudinaryUrl;
  try {
    const cloudinaryResult = await uploadOnCloudinary(filePath);
    if (!cloudinaryResult || !cloudinaryResult.url) {
      throw new Error("Failed to upload to Cloudinary");
    }
    cloudinaryUrl = cloudinaryResult.url;

    // Delete local file after successful Cloudinary upload
    try {
      await unlink(filePath);
    } catch (unlinkErr) {
      console.error(
        "Error deleting local file after successful upload:",
        unlinkErr
      );
      // Continue execution as this is not a critical error
    }

    return cloudinaryUrl;
  } catch (err) {
    // Delete local file if Cloudinary upload fails
    try {
      await unlink(filePath);
    } catch (unlinkErr) {
      console.error(
        "Error deleting local file after failed Cloudinary upload:",
        unlinkErr
      );
    }
    throw new Error("Failed to upload file to Cloudinary");
  }
}

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
    const cloudinaryUrl = await handleFileUpload(file);

    // Save document with Cloudinary URL
    const result = await Document.create({
      title,
      documentRef: cloudinaryUrl,
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
    const { id } = req.params;
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
      signatureUrl = await handleFileUpload(signatureFile);
    }
    let signedDocumentUrl = null;
    if (signedDocument) {
      signedDocumentUrl = await handleFileUpload(signedDocument);
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
