"use client";
import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SignatureCanvas from "react-signature-canvas";
import { Download, Send, FileCheck } from 'lucide-react';

interface Assignee {
  id: string;
  name: string;
  email: string;
}

interface SigningStatus extends Assignee {
  signedAt: string | null;
}

interface FormData {
  title: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

interface PrepareDocumentProps {
  assignees?: Assignee[];
}

const PrepareDocument: React.FC<PrepareDocumentProps> = ({ assignees = [] }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    to: '',
    subject: '',
    body: '',
    date: new Date().toLocaleDateString()
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [signingStatus, setSigningStatus] = useState<SigningStatus[]>([]);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Initialize signing status when component mounts or assignees change
  React.useEffect(() => {
    if (assignees?.length) {
      setSigningStatus(
        assignees.map(assignee => ({
          ...assignee,
          status: 'pending',
          signedAt: null
        }))
      );
    }
  }, [assignees]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (sigCanvas.current) {
        setSignature(sigCanvas.current.toDataURL());
      }
    }
  };

  const handleViewDocument = () => {
    setShowPreview(true);
  };

  const sendForSigning = async () => {
    // Simulate sending document for signing
    setSigningStatus(prev =>
      prev.map(user => ({
        ...user,
        status: 'sent'
      }))
    );
  };

  const generatePDF = async () => {
    if (previewRef.current) {
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
              <ReactSignatureCanvas
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
          </div>
        </CardContent>
      </Card>

      {/* Preview and Signing Section */}
      {showPreview && (
        <div className="w-2/3 space-y-6">
          {/* Document Preview */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
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

          {/* Signing Workflow Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="text-teal-600" />
                Document Signing Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Signed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signingStatus.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.signedAt || '2025-02-08'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-end gap-4">
                <Button
                  onClick={generatePDF}
                  className="bg-gray-600 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Download size={18} />
                  Save as PDF
                </Button>
                <Button
                  onClick={sendForSigning}
                  className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send for Signing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PrepareDocument;