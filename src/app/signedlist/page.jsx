"use server";

import Sidebar from "../../components/adminComponents/Sidebar";
import SignedList from "@/components/adminComponents/SignedList";

async function fetchSignedDocuments() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signedDocuments`);

    if (!response.ok) {
      console.log("error");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching signed documents:", error);
    return { error: error.message };
  }
}

const Page = async () => {
  const documents = await fetchSignedDocuments();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <SignedList
        documents={documents.error ? [] : documents}
        error={documents.error}
      />
    </div>
  );
};

export default Page;