import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request , secret: process.env.SECRET});
  const url = request.nextUrl;
  console.log(token);
  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // if (!token && url.pathname.startsWith('/admin')) {
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }

  return NextResponse.next();
}