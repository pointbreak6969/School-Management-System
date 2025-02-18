"use server";

import React from 'react';
import Profile from '../components/Profile';
import SignList from '../admin/page';
import SignedList from '../signedlist/page';

const page= () => {
  return (
    <div className="container mx-auto p-4">
      <Profile />
      <div className="my-6">
        <h2 className="text-xl font-semibold">Sign Documents</h2>
        <div className="mt-4">
          <SignList />
        </div>
      </div>
      <div className="my-6">
        <h2 className="text-xl font-semibold">Prepare Document</h2>
        <button className="mt-2">
          Prepare Document for Signing
        </button>
      </div>
      <div className="my-6">
        <h2 className="text-xl font-semibold">Review Signed Documents</h2>
        <div className="mt-4">
          <SignedList />
        </div>
      </div>
    </div>
  );
};

export default page;