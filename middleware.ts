import { auth } from "./auth";
import { NextResponse } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login"];

export default auth((req) => {
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (!req.auth && !isPublicRoute) {
    // Redirect to login if not authenticated
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && req.nextUrl.pathname === "/login") {
    // Redirect to dashboard if already logged in and trying to access login
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
