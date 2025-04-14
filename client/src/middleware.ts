import { getCurrentUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

const roleBaseRoutes: Record<string, RegExp[]> = {
  CUSTOMER: [/^\/account/, /^\/cart/, /^\/wishlist/, /^\/checkout/],
};

const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const user = await getCurrentUser();
  // If user is logged in and tries to access auth pages, redirect to home
  if (user && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not logged in
  if (!user) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next(); // Allow access to login/register
    } else {
      // Redirect to login with redirect back
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
  }

  // If user is logged in and route is role-restricted
  const allowedRoutes = roleBaseRoutes[user.role];
  if (allowedRoutes && allowedRoutes.some((route) => route.test(pathname))) {
    return NextResponse.next(); // User has access to the route
  }

  // Deny access by redirecting to home
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/account/:path*",
    "/signup",
    "/login",
    "/cart/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
  ],
};
