import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
    // 1. check if the routes is protected
    const protectedRoutes = ['/dashboard', '/prepare', '/sign', '/sign/*', '/view', '/view/*'];
    const authRoutes = ['/signin', '/signup'];
    const currentPath = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(currentPath);
    const isAuthRoute = authRoutes.includes(currentPath);

    // Get token for either case
    const token = await getToken({ req, secret: process.env.NEXT_SECRET });
    
    // 2. Handle protected routes - redirect to signin if not authenticated
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/signin", req.nextUrl))
        }
    }

    // 3. Handle auth routes - redirect to dashboard if already authenticated
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }

    // 4. render route
    return NextResponse.next();
}

// routes middleware should *not* run on 
export const config = {
    matcher: ['/((?!api|_next/static|_next/image).*)'],
}