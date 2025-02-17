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

const SignedList = () => {
  // Mock data for signed documents
  const signedDocs = [
    {
      id: 1,
      emails: ["sender1@example.com", "signer1@example.com"],
      signedTime: new Date("2025-01-20T12:00:00Z"),
    },
    {
      id: 2,
      emails: ["sender2@example.com", "signer2@example.com"],
      signedTime: new Date("2025-02-05T16:45:00Z"),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Signed Documents
        </h2>

        {signedDocs.length > 0 ? (
          <Table>
            <TableCaption>A list of documents you've signed.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">From</TableHead>
                <TableHead>When</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {signedDocs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    {doc.emails.map((email, index) => (
                      <div key={index}>{email}</div>
                    ))}
                  </TableCell>
                  <TableCell>{doc.signedTime.toDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-600 mt-4">
            You do not have any documents to review.
          </div>
        )}
      </div>
    </div>
  );
};

export default SignedList;
