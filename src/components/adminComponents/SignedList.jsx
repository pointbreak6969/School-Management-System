"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSignature } from "lucide-react";
import Link from "next/link";

const SignedList = () => {
    const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("/api/signedDocuments");
        const data = await response.json();

        if (response.ok) {
          setDocuments(data.data); 
        } else {
          setError(data.message || "Failed to fetch documents");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);
  return (
    <div className="flex-grow p-6 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Signed Documents</h1>
    </div>

    {loading ? (
      <p>Loading documents...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : documents.length === 0 ? (
      <p>No signed documents found.</p>
    ) : (
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
              <TableCell>{doc.sender}</TableCell>
              <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="success">Signed</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Link href={`/usersign/${doc._id}`}>
                      <FileSignature className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
  )
}

export default SignedList