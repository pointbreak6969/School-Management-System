"use client";
import React, { useState } from "react";
import Assign from "../../components/adminComponents/Assign"
import ViewPdf from "../../components/adminComponents/PdfView"

const Page = () => {
  const [activeTab, setActiveTab] = useState("assign");
  const [canAccessPdf, setCanAccessPdf] = useState(false);

  const handleAccessPdf = () => {
    setCanAccessPdf(true);
    setActiveTab("pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-red-200 to-teal-200">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 text-base sm:text-lg font-semibold ${
              activeTab === "assign"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-red-400"
            }`}
          >
            Assign Users
          </button>
          <button
            onClick={() => {
              if (canAccessPdf) {
                setActiveTab("pdf");
              } else {
                alert("Please add users and upload a document before proceeding.");
              }
            }}
            className={`px-4 py-2 text-base sm:text-lg font-semibold ${
              activeTab === "pdf"
                ? "border-b-2 border-teal-500 text-teal-600"
                : "text-gray-600 hover:text-red-400"
            }`}
          >
            PDF View
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "assign" && (
          <div>
            <Assign onComplete={handleAccessPdf} />
          </div>
        )}
        {activeTab === "pdf" && (
          <ViewPdf />
        )}
      </div>
    </div>
  );
};

export default Page;