import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';
// import {withAuth} from 'next-auth/middleware';

// export default withAuth({
//   pages: {
//     signIn: '/signin',  }
// })
// export const config = {
//   matcher: ['/preparation', '/admin', '/profie', '/signedlist',  '/view'],
// };

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/signin') ||
      url.pathname.startsWith('/signup') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (!token && url.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}