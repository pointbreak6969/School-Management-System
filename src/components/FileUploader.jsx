// components/PDFViewer/FileUploader.jsx
import React, { useRef, useState } from 'react';

export default function FileUploader({ onFileUpload }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(file.name);
      onFileUpload(file);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="flex flex-col gap-2">
        <button
          onClick={handleButtonClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Select PDF
        </button>
        {fileName && (
          <div className="mt-1 text-sm text-gray-600 truncate px-2">
            File: {fileName}
          </div>
        )}
      </div>
    </div>
  );
}