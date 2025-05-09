"use server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";

export async function uploadOnAws(file, type) {
  try {
    if (
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_REGION
    ) {
      throw new Error("AWS credentials are not set");
    }
    if (!file) {
      throw new Error("No file provided");
    }
    if (file.type !== "application/pdf") {
      throw new Error("File type not supported");
    }
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const fileName = file.name;
    if (!fileName) {
      throw new Error("File name is not provided");
    }
    const timestamp = Date.now();
    let key;
    if (type === "signature") {
      key = `signatures/${timestamp}-${fileName}`;
    } else if (type === "document") {
      key = `pdfs/${timestamp}-${fileName}`;
    }
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    if (type === "signature") {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: bytes,
        ContentType: "image/png",
      });
      await s3.send(command);
    } else if (type === "document") {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: bytes,
        ContentType: "application/pdf",
      });
      await s3.send(command);
    }
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
    revalidatePath("/dashboard");
    return { success: true, key, url };
  } catch (error) {
    console.error("Error uploading file to AWS S3:", error);
    return { success: false, error: error.message };
  }
}
