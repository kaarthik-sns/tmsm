import { NextResponse } from "next/server";

// Middleware function
export function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Retrieve a cookie or header to verify if the user is logged in
    const isLoggedIn = req.cookies.get('adminToken'); // Replace 'adminToken' with your actual authentication token key

    // Avoid infinite redirects by excluding `/admin/auth/signin` from the check
    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin' && !isLoggedIn) {
        url.pathname = '/admin/auth/signin';
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
