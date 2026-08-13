import "server-only";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export { SESSION_COOKIE_NAME };

const DEFAULT_SESSION_MS = 1000 * 60 * 60 * 12; // 12 hours
const REMEMBER_ME_SESSION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

interface CreateSessionOptions {
  rememberMe?: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
}

export async function createSession(userId: string, options: CreateSessionOptions = {}) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + (options.rememberMe ? REMEMBER_ME_SESSION_MS : DEFAULT_SESSION_MS)
  );

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      userAgent: options.userAgent ?? null,
      ipAddress: options.ipAddress ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { expiresAt };
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(rawToken) } });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Used after password reset / disabling MFA to force re-login everywhere. */
export async function destroyAllSessionsForUser(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}
