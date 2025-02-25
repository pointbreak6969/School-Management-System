// DocumentLoading.tsx
import React from 'react';

const DocumentLoading: React.FC = () => {
  return (
    <div className="p-4 min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading document...</p>
      </div>
    </div>
  );
};

export default DocumentLoading;