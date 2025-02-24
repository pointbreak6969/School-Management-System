'use server';
// 'use client'
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import ProfileClient from "./ProfileClient";

 async function Profile() {
  const session = await getServerSession(authOptions);

  return <ProfileClient session={session} />;
}

export default Profile;
