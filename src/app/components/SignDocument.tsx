"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck } from 'lucide-react';

interface DocumentData {
  title: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

const SignDocument = () => {
  const searchParams = useSearchParams();
  const [document, setDocument] = useState<DocumentData>({
    title: "Service Agreement",
    to: "Client Name",
    subject: "Agreement for Provided Services",
    body: `This agreement outlines the terms and conditions for the provided services. 
Please read carefully before signing.`,
    date: new Date().toLocaleDateString(),
  });
  
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // You can replace this URL with the actual authorized signature image URL
  const authorizedSignatureUrl = "/path-to-authorized-signature.png"; // Replace this with the actual path of the authorized signature image

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setSignature(null);
    }
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setSignature(sigCanvas.current.toDataURL());
    }
  };

  const handleSign = async () => {
    console.log("Document signed with signature:", signature);
    setSuccess(true);
  };

  return (
   <>
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Signature Section */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Add Your Signature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 rounded-lg p-3 bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: 'signature-canvas w-full h-40 border rounded-md bg-gray-50'
                }}
              />
            </div>
            
            <div className="flex gap-4">
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

            {signature && (
              <div className="mt-6">
                <Button 
                  onClick={handleSign}
                  className="w-full bg-teal-600 hover:bg-teal-700 py-6 text-lg"
                >
                  Sign Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="text-teal-600" />
              Document for Signing
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div ref={previewRef} className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h1 className="font-bold text-center text-teal-800 text-2xl">{document.title}</h1>
              </div>
              
              <div className="space-y-6">
                <div className="text-right">
                  <p className="text-gray-600">{document.date}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-800">
                    To,<br/><span className="font-semibold">{document.to}</span>
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-800">Subject: {document.subject}</p>
                </div>
                
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {document.body}
                </div>
              </div>

              <div className="mt-16">
                <div className="flex justify-evenly -mt-5">
                  <div className="w-64 text-center">
                    <div>
                      <img src={authorizedSignatureUrl} alt="Authorized Signature" className="h-16 mx-auto" />
                      <p className="text-sm mt-2 font-medium text-gray-600 border-t-2 border-gray-300 pt-3">
                        Authorized Signature
                      </p>
                    </div>
                  </div>

                   <div className="w-64 text-center">
                    {signature ? (
                      <img src={signature} alt="Client Signature" className="h-16 mx-auto" />
                    ) : (
                      <div className="h-16 border-b-2 border-gray-300" />
                    )}
                    <p className="text-sm mt-2 font-medium text-gray-600">
                      Client Signature
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
   </>
  );
};

export default SignDocument;
