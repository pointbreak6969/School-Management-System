// components/PDFViewer/index.jsx
"use client";
import { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import PDFRenderer from './PdfRenderer';
import PageControls from './PageControl';
import SelectionTools from './SectionTool';
import SelectionList from './SectionList';
import { usePDF } from '../lib/userPdf';

export default function PDFViewer() {
  const { 
    pdfDocument, 
    isLoading, 
    loadPDF, 
    numPages, 
    currentPage, 
    changePage,
    scale, 
    changeScale 
  } = usePDF();

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
      setSavedSelections([...savedSelections, { ...selection, page: currentPage }]);
      setSelection(null);
      setIsSelectionMode(false);
    }
  };

  const clearSelections = () => {
    setSavedSelections([]);
    setSelection(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Viewer with Rectangle Selection</h1>
      
      <FileUploader onFileUpload={loadPDF} />

      {isLoading && (
        <div className="my-4 text-center">
          <p>Loading PDF...</p>
        </div>
      )}

      {pdfDocument && !isLoading && (
        <div className="mt-4">
          <PageControls 
            currentPage={currentPage}
            numPages={numPages}
            changePage={changePage}
            scale={scale}
            changeScale={changeScale}
          />
          
          <div className="flex gap-2 mb-4">
            {!isSelectionMode && (
              <button 
                onClick={startSelectionMode}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Draw Rectangle
              </button>
            )}
            
            {isSelectionMode && !selection && (
              <button 
                onClick={cancelSelectionMode}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel Selection
              </button>
            )}
            
            {selection && (
              <button 
                onClick={saveSelection}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save Selection
              </button>
            )}
          </div>
          
          <PDFRenderer 
            pdfDocument={pdfDocument}
            currentPage={currentPage}
            scale={scale}
            isSelectionMode={isSelectionMode}
            selection={selection}
            setSelection={setSelection}
            savedSelections={savedSelections}
          />
          
          {selection && (
            <SelectionTools 
              selection={selection} 
              onSave={saveSelection}
              onCancel={cancelSelectionMode}
            />
          )}
          
          {savedSelections.length > 0 && (
            <SelectionList 
              selections={savedSelections} 
              onClear={clearSelections}
            />
          )}
        </div>
      )}
    </div>
  );
}