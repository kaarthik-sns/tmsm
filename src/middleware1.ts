import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/', // Redirect to this page if not authenticated
  },
});

export const config = {
  matcher: ['/admin/:path*'], // Protect the `/admin` routes
};
