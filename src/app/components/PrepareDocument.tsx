"use client";
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignatureCanvas from "react-signature-canvas";
import { Download } from 'lucide-react';

const PrepareDocument = () => {
  const [formData, setFormData] = useState({
    title: '',
    to: '',
    subject: '',
    body: '',
    date: new Date().toLocaleDateString()
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignature(null);
  };

  const saveSignature = () => {
    if (!sigCanvas.current?.isEmpty()) {
      setSignature(sigCanvas.current!.toDataURL());
    }
  };

  const handleViewDocument = () => {
    setShowPreview(true);
  };

  const generatePDF = async () => {
    if (previewRef.current) {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: 1,
        filename: `${formData.title || 'agreement'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(previewRef.current).save();
    }
  };

  return (
    <div className="flex gap-6 p-6 min-h-screen bg-teal-50">
      {/* Form Section */}
      <Card className="w-1/3 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Previous form content remains the same */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter agreement title"
              className="border-2 hover:border-teal-400 focus:border-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">To</label>
            <Input
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              placeholder="Recipient name/organization"
              className="border-2 hover:border-teal-400 focus:border-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Subject</label>
            <Input
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Agreement subject"
              className="border-2 hover:border-teal-400 focus:border-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Body</label>
            <Textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Enter agreement content"
              className="min-h-[200px] border-2 hover:border-teal-400 focus:border-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Date</label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border-2 hover:border-teal-400 focus:border-teal-500 transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Signature</label>
            <div className="border-2 rounded-lg p-3 bg-white hover:border-teal-400 transition-colors duration-200">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: 'signature-canvas w-full h-32 border rounded-md bg-gray-50'
                }}
              />
            </div>
            <div className="flex gap-3 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearSignature}
                className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                onClick={saveSignature}
                className="bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
              >
                Save Signature
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700 transition-colors duration-200 text-lg py-6" 
              onClick={handleViewDocument}
              disabled={!formData.title || !formData.to || !formData.subject || !formData.body}
            >
              View Document
            </Button>

            {showPreview && (
              <Button 
                className="w-full bg-teal-700 hover:bg-teal-800 transition-colors duration-200 text-lg py-6 flex items-center justify-center gap-2" 
                onClick={generatePDF}
              >
                <Download size={24} />
                Save as PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card className="w-2/3 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-8">
            <div ref={previewRef} className="max-w-3xl mx-auto">
              <div className="">
                <h1 className="font-bold text-center text-teal-800">{formData.title}</h1>
              </div>
              
              <div className="space-y-6">
                <div className="text-right">
                  <p className="text-gray-600">{formData.date}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-800">To,<br/><span className="font-semibold">{formData.to}</span></p>
                </div>
                
                <div className="p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">Subject: {formData.subject}</p>
                </div>
                
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {formData.body}
                </div>
              </div>

              <div className="mt-16">
                {signature && (
                  <div className="flex justify-evenly -mt-5">
                    <div className="w-64 text-center">
                      <div>
                        <img src={signature} alt="Signature" className="h-16 mx-auto" />
                        <p className="text-sm mt-2 font-medium text-gray-600 border-t-2 border-gray-300 mb-3">Authorized Signature</p>
                      </div>
                    </div>
                    <div className="w-64 text-center">
                      <div>
                        <div className="h-16" />
                        <p className="text-sm mt-2 font-medium text-gray-600 border-t-2 border-gray-300 mb-3">Client Signature</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrepareDocument;