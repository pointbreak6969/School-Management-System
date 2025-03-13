// components/PDFViewer/SelectionTools.jsx
import React from 'react';

export default function SelectionTools({ selection, onSave, onCancel }) {
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded">
      <h3 className="font-bold">Selection:</h3>
      <p>Position: X: {selection.x.toFixed(0)}, Y: {selection.y.toFixed(0)}</p>
      <p>Size: Width: {selection.width.toFixed(0)}px, Height: {selection.height.toFixed(0)}px</p>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={onSave}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Save Selection
        </button>
        <button 
          onClick={onCancel}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}