import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware function
export async function middleware(req) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Rewrite `/` to serve content from `/frontend` but keep `/` in the browser's address bar
    if (pathname === '/') {
        console.log('in-1')
        return NextResponse.rewrite(new URL('/frontend', req.url));
    }

    // Allow access to forgot-password page
    if (pathname === '/admin/forgot-password') {
        console.log('in-2')
        return NextResponse.next();
    }

    // Redirect unauthenticated admin users to signin page
    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin' && !token) {
        console.log('in-3')
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated admin users from signin to dashboard
    if (pathname === '/admin/auth/signin' && token && token.is_admin) {
        console.log('in-4')
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
    }

    // Restrict non-admin users from accessing admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/auth/signin' && token && !token.is_admin) {
        console.log('in-5')
        url.pathname = '/admin/auth/signin';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users from signin to homepage
    if (pathname === '/frontend/login' && token && !token.is_admin) {
        console.log('in-6')
        url.pathname = '/frontend';
        return NextResponse.redirect(url);
    }

    if (pathname === '/frontend/dashboard' && !token) {
        console.log('in-7')
        url.pathname = '/frontend';
        return NextResponse.redirect(url);
    }

    if (pathname === '/frontend/dashboard' && token && token.is_admin) {
        console.log('in-8')
        url.pathname = '/frontend';
        return NextResponse.redirect(url);
    }

    if (pathname === '/frontend/view-profile' && !token) {
        console.log('in-9')
        url.pathname = '/frontend';
        return NextResponse.redirect(url);
    }

    if (pathname === '/frontend/view-profile' && token && token.is_admin) {
        console.log('in-10')
        url.pathname = '/frontend';
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
    matcher: ['/', '/api/:path*', '/admin/:path*', '/frontend/:path*'], // Apply to root, API routes, and admin routes
};
