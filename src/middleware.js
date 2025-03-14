import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXT_SECRET});
  const url = request.nextUrl;

  if (token && url.pathname.startsWith("/signin")) {
    console.log("Token exists, redirecting to /admin");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!token && url.pathname.startsWith("/admin")) {
    console.log("No token found, redirecting to /signin");
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  console.log("Allowing request to proceed");
  return NextResponse.next();
}
