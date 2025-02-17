"use server";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SignList = () => {
  // Mock data for documents
  const docs = [
    {
      id: 1,
      email: "example1@example.com",
      requestedTime: new Date("2025-01-15T10:00:00Z"),
    },
    {
      id: 2,
      email: "example2@example.com",
      requestedTime: new Date("2025-02-01T14:30:00Z"),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Documents to Sign
        </h2>

        {docs.length > 0 ? (
          <Table>
            <TableCaption>A list of documents awaiting your signature.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">From</TableHead>
                <TableHead>When</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.email}</TableCell>
                  <TableCell>{doc.requestedTime.toDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default">Sign</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-600 mt-4">
            You do not have any documents to sign.
          </div>
        )}
      </div>
    </div>
  );
};

export default SignList;
