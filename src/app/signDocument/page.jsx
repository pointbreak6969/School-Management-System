// app/page.js
'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function Home() {
  const [status, setStatus] = useState({ message: '', type: '' });
  const [imageConfigs, setImageConfigs] = useState([createBlankConfig()]);
  const pdfFileRef = useRef(null);

  function createBlankConfig() {
    return {
      id: Date.now(),
      pageNum: 1,
      x: 100,
      y: 500,
      width: 200,
      height: 200,
      imageFile: null
    };
  }

  const addImageConfig = () => {
    setImageConfigs([...imageConfigs, createBlankConfig()]);
  };

  const removeImageConfig = (id) => {
    setImageConfigs(imageConfigs.filter(config => config.id !== id));
  };

  const updateImageConfig = (id, field, value) => {
    setImageConfigs(imageConfigs.map(config => 
      config.id === id ? { ...config, [field]: value } : config
    ));
  };

  const handleFileChange = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      updateImageConfig(id, 'imageFile', file);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processPDF = async () => {
    try {
      setStatus({ message: 'Processing...', type: '' });
      
      // Get the PDF file
      const pdfFile = pdfFileRef.current.files[0];
      if (!pdfFile) {
        throw new Error('Please select a PDF file');
      }
      
      // Read PDF file as ArrayBuffer
      const pdfBytes = await readFileAsArrayBuffer(pdfFile);
      
      // Load existing PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Get the total number of pages
      const pageCount = pdfDoc.getPageCount();
      
      // Check if at least one image is configured
      if (imageConfigs.length === 0) {
        throw new Error('Please add at least one image');
      }
      
      // Process each image configuration
      for (const config of imageConfigs) {
        // Check if image is selected
        if (!config.imageFile) {
          throw new Error(`Please select an image for all configurations`);
        }
        
        const imageBytes = await readFileAsArrayBuffer(config.imageFile);
        
        // Validate page number
        let pageNum = parseInt(config.pageNum);
        if (isNaN(pageNum) || pageNum < 1) {
          pageNum = 1;
        }
        if (pageNum > pageCount) {
          throw new Error(`Page ${pageNum} does not exist. The PDF has ${pageCount} pages.`);
        }
        
        // Adjust to 0-based index
        pageNum = pageNum - 1;
        
        // Embed image based on file type
        let image;
        if (config.imageFile.type === 'image/jpeg') {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          image = await pdfDoc.embedPng(imageBytes);
        }
        
        // Get the page
        const page = pdfDoc.getPage(pageNum);
        
        // Draw image
        page.drawImage(image, {
          x: Number(config.x),
          y: Number(config.y),
          width: Number(config.width),
          height: Number(config.height)
        });
      }
      
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      
      // Download the PDF
      downloadPdf(modifiedPdfBytes, pdfFile.name.replace('.pdf', '-modified.pdf'));
      
      setStatus({ message: 'PDF modified and downloaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error processing PDF:', error);
      setStatus({ message: `Error: ${error.message}`, type: 'error' });
    }
  };

  const downloadPdf = (bytes, filename) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Add Images to Existing PDF</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Step 1: Upload Files</h2>
        <div className="mb-4">
          <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
            Existing PDF File:
          </label>
          <input 
            type="file" 
            id="pdfFile" 
            ref={pdfFileRef}
            accept="application/pdf"
            className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Step 2: Add Images</h2>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 mb-6 flex items-center"
          onClick={addImageConfig}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Image
        </button>
        
        <div className="space-y-6">
          {imageConfigs.map((config, index) => (
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200" key={config.id}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Image #{index + 1}</h3>
                <button 
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition duration-200"
                  onClick={() => removeImageConfig(config.id)}
                >
                  Remove
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image File (JPG/PNG):
                </label>
                <input 
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(config.id, e)}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Number:
                </label>
                <input 
                  type="number"
                  min="1"
                  value={config.pageNum}
                  onChange={(e) => updateImageConfig(config.id, 'pageNum', e.target.value)}
                  className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                  py-2 px-3 text-gray-700 border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    X Position:
                  </label>
                  <input 
                    type="number"
                    value={config.x}
                    onChange={(e) => updateImageConfig(config.id, 'x', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                    py-2 px-3 text-gray-700 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Y Position:
                  </label>
                  <input 
                    type="number"
                    value={config.y}
                    onChange={(e) => updateImageConfig(config.id, 'y', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                    py-2 px-3 text-gray-700 border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width:
                  </label>
                  <input 
                    type="number"
                    value={config.width}
                    onChange={(e) => updateImageConfig(config.id, 'width', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                    py-2 px-3 text-gray-700 border"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height:
                  </label>
                  <input 
                    type="number"
                    value={config.height}
                    onChange={(e) => updateImageConfig(config.id, 'height', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 
                    py-2 px-3 text-gray-700 border"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-center">
        <button 
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-md text-lg font-medium transition duration-200"
          onClick={processPDF}
        >
          Process PDF
        </button>
      </div>
      
      {status.message && (
        <div className={`p-4 rounded-md ${
          status.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}