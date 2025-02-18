"use client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Trash2, Copy } from "lucide-react";
import Sidebar from "../components/Sidebar";

const Page = () => {
  const documents = [
    {
      id: "DOC-004",
      name: "Vendor Agreement",
      identification: "99887766",
      status: "Signed",
      signedDate: "2024-02-15",
    },
    {
      id: "DOC-005",
      name: "Client Contract",
      identification: "55443322",
      status: "Signed",
      signedDate: "2024-02-14",
    },
  ];

  const handleCopy = (id: string) => {
    console.log(`Copy document with ID: ${id}`);
  };

  const handleView = (id: string) => {
    console.log(`View document with ID: ${id}`);
  };

  const handleDownload = (id: string) => {
    console.log(`Download document with ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete document with ID: ${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Signed Documents</h1>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-teal-100">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Identification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Signed Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-green-200">
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.identification}</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-teal-100 text-teal-700">
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>{doc.signedDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(doc.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleView(doc.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id)}>
                      <Download className="h-4 w-4" />
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