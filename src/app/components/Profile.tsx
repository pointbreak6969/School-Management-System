"use client";
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  // Mock user data
  const user = {
    displayName: "John Doe",
    photoURL: "https://as1.ftcdn.net/jpg/02/43/12/34/1000_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
    email: "john.doe@example.com",
  };
  const { displayName, photoURL, email } = user;

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* App Title */}
        <a href="/" className="text-2xl font-semibold text-gray-800">
          PDFTron Sign App
        </a>

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={photoURL} alt={displayName} />
            <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-700">{displayName}</div>
            <div className="text-xs text-gray-500">{email}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">My Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Profile</DropdownMenuItem>
              <DropdownMenuItem disabled>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Profile;
