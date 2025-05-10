"use server";
import { notFound } from "next/navigation";
import DocumentSigner from "../../../components/DocumentSigner";
import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function Page({ params }) {
  const { id } = await params;
  try {
   
    const response = await fetch(`${process.env.NEXT_URL}/api/document/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        notFound(); // Better handling for 404 cases
      }
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }


    const documentData = await response.json();
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
     const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: documentData.data.documentRef,
        });
        const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Document ID: {id}</h1>
        <DocumentSigner documentFile={url} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching document:", error);


    // Return error state
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Document ID: {id}</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading document
          </h2>
          <p className="text-gray-700 mt-2">
            {error.message ||
              "Unable to retrieve the requested document. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
}

export default Page;

