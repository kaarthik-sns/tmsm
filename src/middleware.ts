import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware function
export async function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Avoid infinite redirects by excluding `/admin/auth/signin` and other authenticated paths like `/admin/profile`

    if (pathname === '/admin/forgot-password') {
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin'  && !token) {
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    if (pathname === '/admin/auth/signin' && token) {
        url.pathname = '/admin/';
        return NextResponse.redirect(url);
    }

    console.log('pathname:',pathname);
    // console.log('token:',token);

    if (pathname === '/auth/signin' && token) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // Create a NextResponse instance to modify headers
    const res = NextResponse.next();

    // Add CORS headers
    res.headers.append('Access-Control-Allow-Credentials', "true");
    res.headers.append('Access-Control-Allow-Origin', '*'); // Replace '*' with your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    return res;
}

// Apply middleware to relevant paths
export const config = {
    matcher: ['/api/:path*', '/admin/:path*'], // Apply to API routes and admin routes
};