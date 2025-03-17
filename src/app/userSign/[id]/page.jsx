"use server";
import { notFound } from "next/navigation";
import DocumentSigner from "../../../components/DocumentSigner";
import { FileText, AlertCircle, User } from "lucide-react";

async function Page({ params }) {
  const { id } = params;
  try {
   // Use native fetch instead of axios in server components
    const response = await fetch(`${process.env.NEXT_URL}/api/document/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        notFound(); // Better handling for 404 cases
      }
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }

    const documentData = await response.json();

    return (
      <div className="p-1 max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <FileText className="h-8 w-8 text-blue-500 mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">
              Document Title: {documentData.data.title}
            </h1>
          </div>
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-gray-500 mr-2" />
            <h5 className="text-lg font-medium text-gray-700">
              Sent by: {documentData.data.sender}
            </h5>
          </div>
          <div className="mt-6">
             {/* <DocumentViewer documentData={documentData.data} /> */}
            <DocumentSigner />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching document:", error);

    // Return error state
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-red-600">
            Error loading document
          </h2>
          <p className="text-gray-700 mt-2">
            {error.message || "Unable to retrieve the requested document. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
}

export default Page;