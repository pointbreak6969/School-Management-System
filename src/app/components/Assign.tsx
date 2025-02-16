"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
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

interface Assignee {
  id: number;
  name: string;
  email: string;
}

const Assign: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [assignees, setAssignees] = useState<Assignee[]>([]);

  const addUser = () => {
    if (!displayName || !email) return;

    const newUser: Assignee = { id: new Date().getTime(), name: displayName, email };
    setAssignees([...assignees, newUser]);
    setEmail("");
    setDisplayName("");
  };

  const handleContinue = () => {
    if (assignees.length === 0) {
  
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 -mt-32">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Who needs to sign?
        </h2>

        {/* Input Fields */}
        <div className="grid gap-4">
          <Input
            type="text"
            placeholder="Recipient's name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Recipient's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={addUser} className="w-full">
            Add User
          </Button>
        </div>

        {/* Assignee List */}
        {assignees.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Added Users
            </h3>
            <Table>
              <TableCaption>A list of users added.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignees.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Button onClick={handleContinue} variant="secondary" className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Assign;