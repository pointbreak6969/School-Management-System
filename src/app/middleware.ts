import {  NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
  
    console.log("Token:", token);
    console.log("URL Pathname:", url.pathname);
  
    if (token && (url.pathname.startsWith('/signup') || url.pathname.startsWith('/signin'))) {
      console.log("Redirecting to /Profile");
      return NextResponse.redirect(new URL("/Profile", request.url));
    }
  
    if (!token && url.pathname.startsWith('/Profile')) {
      console.log("Redirecting to /signin");
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  
    return NextResponse.next();
  }

export const config={
    matcher:["/signin","/signup","/profile"]
}