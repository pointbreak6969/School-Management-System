'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import ProfileClient from "./ProfileClient";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  return <ProfileClient session={session} />;
}
