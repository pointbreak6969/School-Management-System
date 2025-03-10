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
import { Mail, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Assignee {
  id: number;
  email: string;
}

const Assign: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const router = useRouter();
  const usersPerPage = 3; 
  const pageCount = Math.ceil(assignees.length / usersPerPage);

  const addUser = () => {
    if (!email) {
      toast.error("Please fill in the email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newUser: Assignee = {
      id: new Date().getTime(),
      email,
    };
    setAssignees([...assignees, newUser]);
    setEmail("");
    setCurrentPage(0);
  };

  const handleContinue = () => {
    if (!showSummary) {
      if (assignees.length === 0) {
        toast.error("Please add at least one user before continuing");
        return;
      }
      setShowSummary(true);
    } else {
      localStorage.setItem("assignees", JSON.stringify(assignees));
      router.push("/preparation");
    }
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
          <Users className="mr-2 text-blue-500" /> {showSummary ? "Review Added Users" : "Who needs to sign?"}
        </h2>

        {!showSummary && (
          <div className="flex gap-6">
            <Card className="w-1/2">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Mail className="mr-2 text-blue-500" /> Add User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
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
                    Add User
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
                            <TableHead>Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentPageUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
        )}

        {showSummary && (
          <div className="flex flex-col">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="mr-2 text-blue-500" /> Review Your Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignees.length > 0 ? (
                  <Table>
                    <TableCaption>A list of users added.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignees.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500">No users added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Button
          onClick={handleContinue}
          className="w-1/4 flex items-center justify-center bg-orange-400 text-black hover:bg-orange-300 ml-96"
        >
          {showSummary ? "Continue" : "Review Users"}
        </Button>
      </div>
    </div>
  );
};

export default Assign;
