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
import { Users } from "lucide-react";

const Assign = ({ onComplete }) => {
  const [assignees, setAssignees] = useState([
    { id: 1, email: "user1@example.com" },
    { id: 2, email: "user2@example.com" },
    { id: 3, email: "user3@example.com" },
  ]);
  const [file, setFile] = useState(null); 
  const [newEmail, setNewEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  const handleAddUser = () => {
    if (newEmail.trim() === "") {
      alert("Email cannot be empty.");
      return;
    }

    if (assignees.some((user) => user.email === newEmail)) {
      alert("This email is already added.");
      return;
    }

    const newUser = {
      id: assignees.length + 1,
      email: newEmail,
    };

    setAssignees([...assignees, newUser]);
    setNewEmail("");
  };

  const handleRemoveUser = (id) => {
    setAssignees(assignees.filter((user) => user.id !== id));
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = assignees.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(assignees.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const Complete = () => {
    if (assignees.length === 0) {
      alert("Please add at least one user.");
      return;
    }

    // if (!file) {
    //   alert("Please upload a document.");
    //   return;
    // }


    if (onComplete) {
      onComplete(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 lg:-mt-16">
      <div className="w-full max-w-6xl bg-white shadow-xl border-1 border-gray-200 rounded-lg p-6 space-y-6 md:p-8 lg:p-10">
        <h2 className="text-3xl font-semibold text-gray-800 tracking-tight flex items-center mb-8">
          <Users className="mr-2 text-blue-500" /> Assign Users
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add User Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Add a New User</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  onClick={handleAddUser}
                  className="bg-teal-600 text-white hover:bg-teal-700"
                >
                  Add User
                </Button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-center">Upload the PDF document.</p>
                <div className="flex flex-col items-center space-y-4">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="application/pdf"
                    className="border border-gray-300 rounded-lg p-2 w-40 lg:w-fit"
                  />
                  <p className="text-gray-600">
                    {file ? `Uploaded: ${file.name}` : "No document uploaded yet."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Users Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 text-gray-900" /> Review Added Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignees.length > 0 ? (
                <>
                  <Table className="w-full">
                    <TableCaption>A list of users added.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
                    <Button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="bg-teal-500 text-gray-800 hover:bg-teal-400"
                    >
                      Previous
                    </Button>
                    <p className="text-gray-600">
                      Page {currentPage} of {totalPages}
                    </p>
                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="bg-teal-500 text-gray-800 hover:bg-teal-400"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No users added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={Complete}
          className="w-full md:w-1/4 flex items-center justify-center bg-teal-600 text-white hover:bg-teal-800 ml-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Assign;