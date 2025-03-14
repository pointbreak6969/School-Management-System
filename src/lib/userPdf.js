import { useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";

// Import the worker for pdfjs-dist v4
import "pdfjs-dist/build/pdf.worker.mjs";

export function usePDF() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(false);
  const [originalPdf, setOriginalPdf] = useState(null);

  const loadPDF = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") return;

    setSelectedFile(file);
    setOriginalPdf(file); // Store the original file
    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          setPdfDocument(pdf);
          setNumPages(pdf.numPages);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error loading PDF:", error);
          alert("Failed to load PDF");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File reading error:", error);
      setIsLoading(false);
    }
  }, []);

  const changePage = useCallback((delta) => {
    setCurrentPage((prev) => Math.min(Math.max(prev + delta, 1), numPages));
  }, [numPages]);

  const changeScale = useCallback((newScale) => {
    setScale(Math.max(0.5, Math.min(newScale, 3))); // Restrict zoom between 0.5x to 3x
  }, []);

  return {
    selectedFile,
    pdfDocument,
    numPages,
    currentPage,
    scale,
    isLoading,
    loadPDF,
    changePage,
    changeScale,
    originalPdf, // Return the original PDF file
  };
}
