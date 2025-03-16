"use server"
import React from 'react'
import { getServerSession } from "next-auth/next";
import { authOptions } from './api/auth/[...nextauth]/options';

const Home = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div>
        <p>You are not logged in!</p>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {session.user?.username}</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}

export default Home