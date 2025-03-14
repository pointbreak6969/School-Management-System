// components/PDFViewer/PageControls.jsx
import React from 'react';

export default function PageControls({ currentPage, numPages, changePage, scale, changeScale }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center">
        <button 
          onClick={() => changePage(-1)} 
          disabled={currentPage <= 1}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-l-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
          title="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="px-4 py-1.5 bg-white border-t border-b text-sm">
          Page {currentPage} of {numPages}
        </span>
        
        <button 
          onClick={() => changePage(1)} 
          disabled={currentPage >= numPages}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
          title="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center bg-white rounded-md border">
        <button 
          onClick={() => changeScale(scale - 0.2)}
          className="px-3 py-1.5 hover:bg-gray-100 rounded-l-md border-r transition-colors"
          title="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="px-3 py-1.5 text-sm font-medium">{Math.round(scale * 100)}%</span>
        <button 
          onClick={() => changeScale(scale + 0.2)}
          className="px-3 py-1.5 hover:bg-gray-100 rounded-r-md border-l transition-colors"
          title="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}