"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSignature } from "lucide-react";
import Link from "next/link";
import Sidebar from "../../components/adminComponents/Sidebar"
const Page = () => {
  // Dummy data 
  const documents = [
    {
      _id: "12345678abcdef",
      email: "user1@example.com",
      document: "Contract A",
      signed: true,
      signedBy: ["user1@example.com"],
      createdAt: "2025-03-01T10:00:00Z",
    },
    {
      _id: "87654321fedcba",
      email: "user2@example.com",
      document: "Contract B",
      signed: false,
      signedBy: [],
      createdAt: "2025-03-05T14:30:00Z",
    },
    {
      _id: "11223344aabbcc",
      email: "user3@example.com",
      document: "Contract C",
      signed: true,
      signedBy: ["user3@example.com"],
      createdAt: "2025-03-10T09:15:00Z",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Signed Documents </h1>
     
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
                  <Badge variant={doc.signed ? "success" : "destructive"}>
                    {doc.signed ? "Signed" : "Pending"}
                  </Badge>
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
      </div>
    </div>
  );
};

export default Page;