"use client";
import React, { useRef, useState, ChangeEvent } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";

const SignatureComponent = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
    }
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.toDataURL();
      setSignature(signatureData);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg w-1/4">
      <h2 className="text-xl font-bold mb-4">Add Your Signature</h2>
      <div className="border-2 rounded-lg p-3 bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'signature-canvas w-full h-40 border rounded-md bg-gray-50'
          }}
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <Button 
          variant="outline" 
          onClick={clearSignature}
          className="hover:bg-red-50 hover:text-red-600"
        >
          Clear
        </Button>
        <Button 
          onClick={saveSignature}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Save Signature
        </Button>
      </div>

      <div className="mt-4">
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
        />
        <div className='flex -mt-2 mb-4'>
            <div className='bg-gray-200 flex flex-grow h-0.5 mt-3 mr-2'></div>
            <p className='text-center text-gray-700'>or</p>
            <div className='bg-gray-200 flex flex-grow h-0.5 mt-3 ml-2'></div>
        </div>
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-teal-600 hover:bg-teal-700 w-full"
        >
          Upload Signature
        </Button>
      </div>

      {signature && (
        <div className="mt-6">
          <img src={signature} alt="Saved Signature" className="h-16 mx-auto" />
        </div>
      )}
    </div>
  );
};

export default SignatureComponent;