import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/agent/:path*", "/profile/:path*", "/legal/:path*", "/finance/:path*", "/study/:path*", "/point/:path*"],
};
