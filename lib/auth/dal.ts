import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSessionToken, hashToken, destroySession } from "@/lib/auth/session";

/**
 * Secure session check: reads the raw token from the cookie, then validates it
 * against the Session table (existence + expiry + user still active). Memoized
 * per-request via React `cache` so multiple calls don't repeat the DB query.
 * Redirects to /login when the session is missing or invalid.
 */
export const verifySession = cache(async () => {
  const rawToken = await getSessionToken();
  if (!rawToken) {
    redirect("/login");
  }

  const tokenHash = hashToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || session.user.isDeleted || !session.user.isActive) {
    await destroySession();
    redirect("/login");
  }

  prisma.session
    .update({ where: { id: session.id }, data: { lastSeenAt: new Date() } })
    .catch(() => {});

  return session;
});

/** DTO-shaped current user - never exposes password hash, mfaSecret, or reset tokens. */
export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const { user } = session;

  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role,
    departmentName: user.departmentName,
    biography: user.biography,
    mfaEnabled: user.mfaEnabled,
  };
});

/**
 * Same validation as verifySession(), but for Route Handlers: returns null
 * instead of redirecting. `redirect()` inside a Route Handler produces an
 * HTTP redirect response, which a `fetch()` caller would follow silently
 * rather than treat as "send the browser to /login" - the caller decides
 * that instead, based on a 401 response.
 */
export async function getApiSession() {
  const rawToken = await getSessionToken();
  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || session.user.isDeleted || !session.user.isActive) {
    if (session) {
      await destroySession();
    }
    return null;
  }

  prisma.session
    .update({ where: { id: session.id }, data: { lastSeenAt: new Date() } })
    .catch(() => {});

  return session;
}
