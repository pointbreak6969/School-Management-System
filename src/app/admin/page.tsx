"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, FileSignature, Trash2, Copy } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Link from "next/link";

const Page = () => {
  const documents = [
    {
      id: "DOC-001",
      name: "Service Agreement",
      identification: "12345678",
      status: "Pending",
    },
    {
      id: "DOC-002",
      name: "Employment Contract",
      identification: "87654321",
      status: "Pending",
    },
    {
      id: "DOC-003",
      name: "NDA Agreement",
      identification: "11223344",
      status: "Pending",
    },
  ];

  const handleCopy = (id: string) => {
    console.log(`Copy document with ID: ${id}`);
  };

  const handleView = (id: string) => {
    console.log(`View document with ID: ${id}`);
  };


  const handleDelete = (id: string) => {
    console.log(`Delete document with ID: ${id}`);
  };

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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Identification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-green-100">
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.identification}</TableCell>
                <TableCell>
                  <Badge variant={doc.status === "Pending" ? "destructive" : "outline"}>{doc.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(doc.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleView(doc.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" >
                      <Link href={'/usersign'}><FileSignature className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4" />
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
