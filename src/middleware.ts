import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    let res = NextResponse.next();

    // Allow access to public paths
    if (pathname.startsWith('/public')) {
        return res;
    }

    // // Redirect unauthenticated users trying to access /admin
    // if (!token && pathname.startsWith('/admin')) {
    //     return NextResponse.redirect(new URL('/admin/auth/signin', req.url));
    // }

    // Allow static assets in /uploads/ and /images/
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/images/')) {
        return res;
    }

    // Allow Next.js static files
    if (pathname.startsWith('/_next/') || pathname === '/favicon.ico') {
        return res;
    }

    // Allow /api paths to be accessed by everyone
    if (pathname.startsWith('/api') || pathname.startsWith('/admin')) {
        return res;
    }

    // Redirect unauthenticated users trying to access restricted paths
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/view-profile') || pathname.startsWith('/member') )) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Add CORS headers
    res.headers.append('Access-Control-Allow-Credentials', 'true');
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

    // Rewrite other paths to /frontend
    if (!pathname.startsWith('/frontend') && pathname !== '' && pathname !== '/favicon.ico') {
        const newUrl = req.nextUrl.clone();
        newUrl.pathname = `/frontend${pathname}`;
        return NextResponse.rewrite(newUrl);
    }

    return res;
}

// Apply middleware to all routes
export const config = {
    matcher: ['/admin/:path*', '/:path*'],
};
