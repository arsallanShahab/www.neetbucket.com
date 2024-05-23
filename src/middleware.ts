import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    // "/",
    // "/soft-copy",
    // "/hard-copy",
    // "/contact",
    // "/about",
    // "/faq",
    // "/privacy-policy",
    // "/terms-and-conditions",
    // "/sign-in",
    // "/sign-up",
    // "/api/webhook(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
