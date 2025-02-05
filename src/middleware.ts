import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    let res = NextResponse.next();


    // Check if the user is logged in by getting the JWT token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }); // Use your secret key if necessary


    // **Allow static assets in /uploads/**
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/images/')) {
        return res;
    }

    // Allow Next.js static files
    if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
        return res;
    }
	
    // Allow /api paths to be accessed by everyone
    if (pathname.startsWith('/admin') ||pathname.startsWith('/api')) {
        return res;
    }
     // **Admin pages** - If the user is not logged in or is not an admin, redirect to login
     if (!token || (pathname.startsWith('/admin') && !token.is_admin)) {
        return NextResponse.redirect(new URL('/admin/auth/signin', req.url));
    }

    // If the user is not logged in and trying to access restricted paths like /admin or /api, redirect to login
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/view-profile'))) {
        return NextResponse.redirect(new URL('/login', req.url)); // Adjust the redirect URL if necessary
    }

    // Add CORS headers
    res.headers.append('Access-Control-Allow-Credentials', "true");
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET, DELETE, PATCH, POST, PUT');
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Allow OPTIONS preflight requests for CORS
    if (req.method === 'OPTIONS') {
        return res;
    }

    // Rewrite other paths
    if (!pathname.startsWith('/frontend') && pathname !== '' && pathname !== '/favicon.ico') {
        const newUrl = req.nextUrl.clone();
        newUrl.pathname = `/frontend${pathname}`;
        return NextResponse.rewrite(newUrl);
    }

    return res;
}

// Apply middleware to all routes
export const config = {
    matcher: '/:path*',
};
