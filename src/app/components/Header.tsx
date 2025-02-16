import React from 'react';
import { Moon, Sun } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-gray-100 py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">PDFTron Sign App</h1>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
          <Sun className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Header;
