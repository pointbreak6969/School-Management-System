// components/PDFViewer/SelectionList.jsx
import React from 'react';

export default function SelectionList({ selections, onClear }) {
  return (
    <div className="mt-4">
      <h3 className="font-bold">Saved Selections ({selections.length}):</h3>
      <div className="mt-2 max-h-48 overflow-y-auto">
        {selections.map((sel, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-50 border rounded">
            <p>Page: {sel.page}, Position: X: {sel.x.toFixed(0)}, Y: {sel.y.toFixed(0)}</p>
            <p>Size: Width: {sel.width.toFixed(0)}px, Height: {sel.height.toFixed(0)}px</p>
          </div>
        ))}
      </div>
      <button
        onClick={onClear}
        className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
      >
        Clear All Selections
      </button>
    </div>
  );
}