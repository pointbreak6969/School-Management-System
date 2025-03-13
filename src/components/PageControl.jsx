// components/PDFViewer/PageControls.jsx
import React from 'react';

export default function PageControls({ currentPage, numPages, changePage, scale, changeScale }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <button 
          onClick={() => changePage(-1)} 
          disabled={currentPage <= 1}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mr-2"
        >
          Previous
        </button>
        <button 
          onClick={() => changePage(1)} 
          disabled={currentPage >= numPages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
        <span className="ml-4">
          Page {currentPage} of {numPages}
        </span>
      </div>
      <div>
        <button 
          onClick={() => changeScale(scale - 0.2)}
          className="bg-gray-200 px-3 py-1 rounded mr-2"
        >
          -
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button 
          onClick={() => changeScale(scale + 0.2)}
          className="bg-gray-200 px-3 py-1 rounded ml-2"
        >
          +
        </button>
      </div>
    </div>
  );
}