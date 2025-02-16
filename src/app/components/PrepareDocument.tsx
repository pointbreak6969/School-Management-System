"use client";
import React, { useState, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Assignee {
  email: string;
  name: string;
}

interface SignatureField {
  id: number;
  x: number;
  y: number;
}

const PrepareDocument: React.FC = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);

  const assignees: Assignee[] = [
    { email: "user1@example.com", name: "User One" },
    { email: "user2@example.com", name: "User Two" },
  ];

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSendForSigning = () => {
    alert("Document sent for signing!");
  };

  const addSignatureField = () => {
    setSignatureFields([...signatureFields, { id: new Date().getTime(), x: 50, y: 50 }]);
  };

  const handleFieldDrag = (e: DragEvent<HTMLDivElement>, id: number) => {
    const updatedFields = signatureFields.map(field => {
      if (field.id === id) {
        return { ...field, x: e.clientX, y: e.clientY };
      }
      return field;
    });
    setSignatureFields(updatedFields);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Prepare Document</CardTitle>
              <CardDescription className="text-gray-600">Configure document settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document" className="text-gray-800">Upload Document</Label>
                <Input id="document" type="file" onChange={handleDocumentChange} className="bg-gray-50 text-gray-800 placeholder-gray-400" />
                <p className="text-sm text-gray-600">Upload a PDF to prepare.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee" className="text-gray-800">Select Recipient</Label>
                <Select onValueChange={setSelectedAssignee}>
                  <SelectTrigger className="w-full bg-gray-50 text-gray-800 placeholder-gray-400">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee.email} value={assignee.email}>
                        {assignee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-800">Add Fields</Label>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="text-gray-800 border-gray-200" onClick={addSignatureField}>Add Signature</Button>
                  <Button variant="outline" className="text-gray-800 border-gray-200" disabled>Add Text Field</Button>
                  <Button variant="outline" className="text-gray-800 border-gray-200" disabled>Add Date Field</Button>
                </div>
              </div>

              <Button onClick={handleSendForSigning} className="w-full  text-white">
                Send for Signing
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">Document Preview</CardTitle>
              <CardDescription className="text-gray-600">
                A preview of the document will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[600px] relative flex items-center justify-center">
              {document ? (
                <div className="w-full h-full relative">
                  <iframe
                    src={URL.createObjectURL(document)}
                    title="Document Preview"
                    className="w-full h-full"
                  />
                  {signatureFields.map(field => (
                    <div
                      key={field.id}
                      className="absolute bg-blue-500 text-white p-2 rounded cursor-move"
                      style={{ top: field.y, left: field.x }}
                      draggable
                      onDrag={(e) => handleFieldDrag(e, field.id)}
                    >
                      Signature
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Document preview is not available in this static version.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrepareDocument;