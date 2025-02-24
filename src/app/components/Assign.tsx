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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Mail, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Assignee {
  id: number;
  name: string;
  email: string;
}

const Assign: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const router=useRouter()
  const usersPerPage = 3; 
  const pageCount = Math.ceil(assignees.length / usersPerPage);

  const addUser = () => {
    if (!displayName || !email) return;

    const newUser: Assignee = {
      id: new Date().getTime(),
      name: displayName,
      email,
    };
    setAssignees([...assignees, newUser]);
    setEmail("");
    setDisplayName("");
    setCurrentPage(0); 
  };

  const handleContinue = () => {
    router.push('/preparation')
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  const offset = currentPage * usersPerPage;
  const currentPageUsers = assignees.slice(offset, offset + usersPerPage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-800 px-4 -mt-5">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight flex items-center mb-8">
          <Users className="mr-2 text-blue-500" /> Who needs to sign?
        </h2>

        <div className="flex gap-6">
          {/* Add User Card */}
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <UserPlus className="mr-2 text-blue-500" /> Add User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <UserPlus className="ml-3 text-gray-500 mr-2" />
                  <Input
                    type="text"
                    placeholder="Recipient's name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-grow border-none focus:ring-0"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <Mail className="ml-3 text-gray-500 mr-2" />
                  <Input
                    type="email"
                    placeholder="Recipient's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow border-none focus:ring-0"
                  />
                </div>
                <Button
                  onClick={addUser}
                  className="w-full flex items-center justify-center"
                >
                  <UserPlus className="mr-2" /> Add User
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-1/2">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 text-blue-500" /> Added Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] flex flex-col justify-between">
                {assignees.length > 0 ? (
                  <>
                    <Table>
                      <TableCaption>A list of users added.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPageUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pageCount > 1 && (
                      <div className="flex justify-center mt-4 space-x-2">
                        {[...Array(pageCount)].map((_, index) => (
                          <Button
                            key={index}
                            variant={
                              index === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  
                  <p className="text-gray-500">No users added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleContinue}
          className="w-1/4 flex items-center justify-center bg-orange-400 text-black hover:bg-orange-300 ml-96"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Assign;
