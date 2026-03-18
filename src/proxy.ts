import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Proxy function
export async function proxy(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    
    const isProduction = process.env.NODE_ENV === "production";
    const isHttps = req.headers.get("x-forwarded-proto") === "https" || req.url.startsWith("https://");
    const secureCookie = isProduction || isHttps;

    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie
    });

    // Rewrite `/` to serve content from `/frontend` but keep `/` in the browser's address bar
    if (pathname === '' || pathname === '/') {
        return NextResponse.rewrite(new URL('/', req.url));
    }

    // Allow static assets in /uploads/ and /images/
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/images/')) {
        return NextResponse.next();
    }

    // Allow access to forgot-password page
    if (pathname === '/admin/forgot-password') {
        return NextResponse.next();
    }

    if (pathname === '/admin/change-password') {
        return NextResponse.next();
    }

    // Redirect unauthenticated admin users to signin page
    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin' && !token) {
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated admin users from signin to dashboard
    if (pathname === '/admin/auth/signin' && token && token.is_admin) {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated admin users from signin to dashboard
    if (pathname === '/admin' && token && token.is_admin) {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    // Restrict non-admin users from accessing admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin' && token && !token.is_admin) {
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users from signin to homepage
    if (pathname === '/login' && token && !token.is_admin) {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // if (pathname === '/dashboard' && token && token.is_admin) {
    //     url.pathname = '/';
    //     return NextResponse.redirect(url);
    // }

    // Redirect unauthenticated users trying to access restricted paths
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/view-profile') || pathname.startsWith('/member'))) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect unauthenticated users trying to access restricted paths
    if (token && token.is_admin && (pathname.startsWith('/dashboard') || pathname.startsWith('/view-profile') || pathname.startsWith('/member'))) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname == '/admin' && !token) {
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    // Create a NextResponse instance to modify headers
    const res = NextResponse.next();

    // Add CORS headers
    res.headers.append('Access-Control-Allow-Credentials', "true");
    res.headers.append('Access-Control-Allow-Origin', '*'); // Change '*' to a specific domain if needed
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // return res;
}

// Apply middleware to relevant paths
export const config = {
    matcher: ['/', '/api/:path*', '/:path*'], // Apply to root, API routes, and admin routes
};
