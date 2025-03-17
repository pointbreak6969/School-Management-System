import connectDb from "../../../lib/dbConnect";
import { join } from "path";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import Document from "../../../models/document.model";
import fs from "fs";
import { uploadOnCloudinary } from "../../../lib/uploadOnCloudinary";
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

    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);
    const filePath = join(process.cwd(), "public/uploads", file.name);

    try {
      await writeFile(filePath, fileBuffer);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload file",
        },
        {
          status: 500,
        }
      );
    }

    const result = await Document.create({
      title,
      documentRef: filePath,
      sender,
      receivers: receivers,
      signatureField,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
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
        message: "An unexpected error occurred",
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
    const signature = data.get("signature");
    const signedBy = data.get("signedBy");
    const signedTime = new Date();
    const newDocument = data.get("newDocument");
    
    // Find the existing document
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
    
    // Handle document file update
    fs.unlinkSync(document.documentRef);
    const bytes = await newDocument.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);
    const filePath = join(process.cwd(), "public/uploads", newDocument.name);
    try {
      await writeFile(filePath, fileBuffer);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload file",
        },
        {
          status: 500,
        }
      );
    }
    
    // Upload the new signature to Cloudinary
    const signatureImage = await uploadOnCloudinary(signature);
    
    // Prepare update data that appends new information instead of replacing
    const updateData = {
      // Update document path
      signedDocument: filePath,
      // Push the new signer's email to the array
      $push: {
        signedBy: signedBy,
        signedTime: signedTime,
        signatures: signatureImage.url,
      },
      // Update status
      status: "signed",
    };
    
    // Update the document
    const result = await Document.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to sign document",
        },
        {
          status: 500,
        }
      );
    }
    
    // Check if all receivers have signed, update status to completed if yes
    const allSigned = result.receivers.every(receiver => 
      result.signedBy.includes(receiver)
    );
    
    if (allSigned) {
      await Document.findByIdAndUpdate(
        id,
        { status: "completed" },
        { new: true }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        message: "Document signed successfully",
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in PATCH route:", error);
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