import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // Only allow if token exists and role is ADMIN for /admin routes
            if (req.nextUrl.pathname.startsWith("/admin")) {
                return token?.role === "ADMIN";
            }
            return !!token;
        },
    },
});

export const config = { matcher: ["/admin/:path*"] };
