import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploads/(.*)",
]);

const isSuperAdminRoute = createRouteMatcher(["/super-admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isWaitingRoute = createRouteMatcher(["/waiting(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Role-based protection is enforced in each page/layout
  // via getCurrentUser() + role checks — no DB call here for performance.
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
