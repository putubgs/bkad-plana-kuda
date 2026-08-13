import "server-only";
import type { NextRequest } from "next/server";

/**
 * Server Actions get automatic same-origin enforcement from Next.js; plain
 * Route Handlers do not. Call this at the top of every mutating (state-
 * changing) /api/v1 route as a basic CSRF guard, since these endpoints rely
 * on cookie-based sessions.
 */
export function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  // Same-origin requests from fetch() always send an Origin header. Missing
  // Origin (e.g. curl, some same-origin browser navigations) is rejected -
  // these endpoints are only ever called via same-origin fetch from our own UI.
  if (!origin) {
    return false;
  }

  const allowedOrigin = process.env.APP_URL ?? request.nextUrl.origin;

  try {
    return new URL(origin).origin === new URL(allowedOrigin).origin;
  } catch {
    return false;
  }
}
