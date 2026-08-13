import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// Fully public routes: no session cookie check either way.
const PUBLIC_PREFIXES = ["/rating"];

// Auth pages that a logged-in user shouldn't need to revisit.
const GUEST_ONLY_ROUTES = ["/login"];

/**
 * Optimistic check only (cookie presence, no DB round trip) - see Next.js
 * "Optimistic checks with Proxy" guidance. The real session validation
 * (expiry, revocation, user status) happens in lib/auth/dal.ts via
 * verifySession(), called from the dashboard layout and every Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const isAuthRoute =
    pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password");
  if (isAuthRoute) {
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
