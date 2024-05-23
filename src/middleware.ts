// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/soft-copy",
  "/hard-copy",
  "/contact",
  "/about",
  "/faq",
  "/privacy-policy",
  "/terms-and-conditions",
  "/sign-in",
  "/sign-up",
  "/api/webhook(.*)",
  //every api route is public for now
  "/api(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
