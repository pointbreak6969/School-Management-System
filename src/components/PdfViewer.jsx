// components/PDFViewer/index.jsx
"use client";
import { useState, useEffect } from "react";
import FileUploader from "./FileUploader";
import PDFRenderer from "./PdfRenderer";
import PageControls from "./PageControl";
import SelectionTools from "./SectionTool";
import SelectionList from "./SectionList";
import { usePDF } from "../lib/userPdf";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PDFViewer() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    pdfDocument,
    isLoading,
    loadPDF,
    numPages,
    currentPage,
    changePage,
    scale,
    changeScale,
    originalPdf,
  } = usePDF();

  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      title: ``,
      sender: ``,
      receivers: [{ value: "" }], // Initial state with one receiver field
    },
  });
  const {
    fields: receiverFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "receivers",
  });
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", originalPdf);
      formData.append("title", data.title);
      formData.append("sender", data.sender || userEmail);
      formData.append("receivers", JSON.stringify(data.receivers));
      console.log(data.receivers);
      const formattedSelections = savedSelections.map((selection) => ({
        x: selection.x,
        y: selection.y,
        width: selection.width,
        height: selection.height,
        pageNo: selection.page, // Renaming 'page' to 'pageNo' to match schema
      }));

      formData.append("signatureField", JSON.stringify(formattedSelections));
      const response = await axios.post("/api/uploadDocument", formData);
      if (response.data.success) {
        toast.success("Successfully submitted the agreement");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to submit the agreement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selection, setSelection] = useState(null);
  const [savedSelections, setSavedSelections] = useState([]);

  const startSelectionMode = () => {
    setIsSelectionMode(true);
    setSelection(null);
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelection(null);
  };

  const saveSelection = () => {
    if (selection) {
      setSavedSelections([
        ...savedSelections,
        { ...selection, page: currentPage },
      ]);
      setSelection(null);
      setIsSelectionMode(false);
    }
  };

  const clearSelections = () => {
    setSavedSelections([]);
    setSelection(null);
  };

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (session && session.user && session.user.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
        PDF Viewer with Rectangle Selection
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Controls and tools */}
        <div className="lg:w-1/4 bg-white p-5 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Document
            </h2>
            <FileUploader onFileUpload={loadPDF} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Form Details
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Title
              </label>
              <input
                type="text"
                {...register("title")}
                className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Document Title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Sender:
              </label>
              <input
                type="text"
                value={userEmail}
                {...register("sender")}
                className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {receiverFields.map((item, index) => (
              <div
                key={item.id}
                className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-blue-700">
                    Receiver {index + 1}:
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <Controller
                  control={control}
                  name={`receivers[${index}].value`}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      className="w-full p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter receiver's email"
                    />
                  )}
                />
              </div>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Receiver
              </button>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Send Agreement
              </button>
            </div>
          </form>
          {pdfDocument && !isLoading && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Rectangle Tools
                </h2>
                <div className="flex flex-col gap-2">
                  {!isSelectionMode && (
                    <button
                      onClick={startSelectionMode}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center w-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16m-7 6h7"
                        />
                      </svg>
                      Insert Signature Field
                    </button>
                  )}

                  {isSelectionMode && !selection && (
                    <button
                      onClick={cancelSelectionMode}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors w-full"
                    >
                      Cancel Selection
                    </button>
                  )}

                  {selection && (
                    <button
                      onClick={saveSelection}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full"
                    >
                      Save Selection
                    </button>
                  )}
                </div>
              </div>

              {/* Selection tools and list embedded in the left column */}
              {selection && (
                <div className="mb-6">
                  <SelectionTools
                    selection={selection}
                    onSave={saveSelection}
                    onCancel={cancelSelectionMode}
                  />
                </div>
              )}

              {savedSelections.length > 0 && (
                <div className="mb-6">
                  <SelectionList
                    selections={savedSelections}
                    onClear={clearSelections}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Right column - PDF viewer */}
        <div className="lg:w-3/4 bg-white p-5 rounded-lg shadow-md">
          {isLoading && (
            <div className="my-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PDF...</p>
            </div>
          )}

          {pdfDocument && !isLoading && (
            <div>
              <div className="mb-4">
                <PageControls
                  currentPage={currentPage}
                  numPages={numPages}
                  changePage={changePage}
                  scale={scale}
                  changeScale={changeScale}
                />
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden">
                <PDFRenderer
                  pdfDocument={pdfDocument}
                  currentPage={currentPage}
                  scale={scale}
                  isSelectionMode={isSelectionMode}
                  selection={selection}
                  setSelection={setSelection}
                  savedSelections={savedSelections}
                />
              </div>
            </div>
          )}

          {!pdfDocument && !isLoading && (
            <div className="text-center py-16 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">Upload a PDF file to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
