"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSignature } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Document {
  _id: string;
  email: string;
  document: string;
  signed: boolean;
  signedBy: string[];
  createdAt: string;
}

const Page = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/fetchdocuments');
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const unsignedDocuments = data.filter((doc: Document) => 
           doc.signedBy.includes(session?.user?.email)
        );
        console.log(unsignedDocuments);
        setDocuments(unsignedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [session]);

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
          <h1 className="text-3xl font-bold">Documents to Sign</h1>
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
                  <Badge variant={"default"}>
                    Success
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Link href={`/usersign/${doc._id}`}><FileSignature className="h-4 w-4" /></Link>
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