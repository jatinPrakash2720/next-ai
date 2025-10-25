import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Skip middleware for API routes, static files, and NextAuth routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/u/"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes (sign-in, sign-up, verify)
  const authRoutes = ["/sign-in", "/sign-up", "/verify/"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // User profile routes (public but need special handling)
  const isUserProfileRoute = pathname.match(/^\/u\/[^\/]+$/);

  // Handle authentication redirects
  if (!token) {
    // Redirect unauthenticated users from protected routes to sign-in
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Allow access to public routes and auth routes
    if (isPublicRoute || isAuthRoute || isUserProfileRoute) {
      return NextResponse.next();
    }
  }

  // Handle authenticated users
  if (token) {
    // Redirect authenticated users away from auth pages to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow access to all other routes for authenticated users
    return NextResponse.next();
  }

  // Default: allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
