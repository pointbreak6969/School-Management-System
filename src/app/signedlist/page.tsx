"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";

interface Document {
  _id: string;
  email: string;
  document: string;
  signed: boolean;
  createdAt: string;
}

const Page = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/fetchdocuments');
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const signedDocuments = data.filter((doc: Document) => doc.signed);
        setDocuments(signedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleView = (id: string) => {
    window.open(`/view/${id}`, '_blank');
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}/download`);
      if (!response.ok) throw new Error('Failed to download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Signed Documents</h1>
          <Button><Link href={'/assign'}>New Contracts</Link></Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-teal-100">
              <TableHead>Document ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc._id} className="hover:bg-green-100">
                <TableCell>{doc._id.substring(0, 8)}...</TableCell>
                <TableCell>{doc.email}</TableCell>
                <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={doc.signed ? "default" : "destructive"}>
                    {doc.signed ? "Signed" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(doc._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc._id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;