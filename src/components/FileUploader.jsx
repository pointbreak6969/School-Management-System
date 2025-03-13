// components/PDFViewer/FileUploader.jsx
import React from 'react';

export default function FileUploader({ onFileUpload }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="border p-2 rounded"
      />
    </div>
  );
}