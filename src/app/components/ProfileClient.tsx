"use client";

import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileClient({ session }: { session: any }) {
  if (!session) {
    return <p className="text-red-500 text-xl">You are not logged in</p>;
  }

  const { user } = session;

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
            <AvatarImage
              src={user?.image || "https://avatar.iran.liara.run/public/32"}
              alt={user?.name || "User"}
            />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-700">
              {user?.name || "Unknown User"}
            </div>
            <div className="text-xs text-gray-500">{user?.email}</div>
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
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
