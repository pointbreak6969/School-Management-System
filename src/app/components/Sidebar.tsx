import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, FileText } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-muted/30">
      <nav className="flex flex-col gap-2 p-4">
        <Link href="/admin">
          <Button variant="ghost" className="w-full justify-start gap-2 text-green-800 font-bold text-lg">
            <Home className="h-10 w-10" />
            Home
          </Button>
        </Link>
        <Link href="/signedlist">
          <Button variant="ghost" className="w-full justify-start gap-2  text-green-800 font-bold text-lg">
            <FileText className="h-4 w-4" />
            Signed Documents
          </Button>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;