import "server-only";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import {
  FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME,
  MFA_PENDING_COOKIE_NAME,
} from "@/lib/auth/constants";

export { MFA_PENDING_COOKIE_NAME, FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME };

const LOGIN_CHALLENGE_TTL_SECONDS = 60 * 5; // 5 minutes to enter OTP after password check
const SETUP_SECRET_TTL_SECONDS = 60 * 10; // 10 minutes to scan + confirm enrollment
const FORGOT_PASSWORD_CHALLENGE_TTL_SECONDS = 60 * 5; // 5 minutes to enter OTP before the reset email is sent

interface PendingLoginChallenge {
  userId: string;
  rememberMe: boolean;
}

interface PendingForgotPasswordChallenge {
  userId: string;
}

/** Created right after password verification when the account has MFA enabled. */
export async function createPendingMfaChallenge(userId: string, rememberMe: boolean) {
  const token = randomBytes(24).toString("hex");

  await redis.set(
    `mfa_pending:${token}`,
    JSON.stringify({ userId, rememberMe } satisfies PendingLoginChallenge),
    "EX",
    LOGIN_CHALLENGE_TTL_SECONDS
  );

  const cookieStore = await cookies();
  cookieStore.set(MFA_PENDING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LOGIN_CHALLENGE_TTL_SECONDS,
  });

  return token;
}

export async function getPendingMfaChallenge() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MFA_PENDING_COOKIE_NAME)?.value;
  if (!token) return null;

  const raw = await redis.get(`mfa_pending:${token}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingLoginChallenge;
    return { token, ...parsed };
  } catch {
    return null;
  }
}

export async function clearPendingMfaChallenge(token: string) {
  await redis.del(`mfa_pending:${token}`);
  const cookieStore = await cookies();
  cookieStore.delete(MFA_PENDING_COOKIE_NAME);
}

/** Created after a forgot-password request is matched to an account that has MFA enabled, before any email is sent. */
export async function createPendingForgotPasswordChallenge(userId: string) {
  const token = randomBytes(24).toString("hex");

  await redis.set(
    `forgot_password_mfa_pending:${token}`,
    JSON.stringify({ userId } satisfies PendingForgotPasswordChallenge),
    "EX",
    FORGOT_PASSWORD_CHALLENGE_TTL_SECONDS
  );

  const cookieStore = await cookies();
  cookieStore.set(FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: FORGOT_PASSWORD_CHALLENGE_TTL_SECONDS,
  });

  return token;
}

export async function getPendingForgotPasswordChallenge() {
  const cookieStore = await cookies();
  const token = cookieStore.get(FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME)?.value;
  if (!token) return null;

  const raw = await redis.get(`forgot_password_mfa_pending:${token}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingForgotPasswordChallenge;
    return { token, ...parsed };
  } catch {
    return null;
  }
}

export async function clearPendingForgotPasswordChallenge(token: string) {
  await redis.del(`forgot_password_mfa_pending:${token}`);
  const cookieStore = await cookies();
  cookieStore.delete(FORGOT_PASSWORD_MFA_PENDING_COOKIE_NAME);
}

/**
 * Secret is only persisted (encrypted) to the User row once setup is confirmed
 * with a valid OTP. Uses SET NX so a duplicate start (React Strict Mode) does
 * not rotate the secret the user already scanned.
 */
export async function storePendingMfaSecret(userId: string, secret: string) {
  const key = `mfa_setup:${userId}`;
  const created = await redis.set(key, secret, "EX", SETUP_SECRET_TTL_SECONDS, "NX");
  if (created === null) {
    const existing = await redis.get(key);
    if (existing) return existing;
    await redis.set(key, secret, "EX", SETUP_SECRET_TTL_SECONDS);
  }
  return secret;
}

export async function getPendingMfaSecret(userId: string) {
  return redis.get(`mfa_setup:${userId}`);
}

export async function clearPendingMfaSecret(userId: string) {
  await redis.del(`mfa_setup:${userId}`);
}
