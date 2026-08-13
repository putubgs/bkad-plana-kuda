import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { hashToken } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit-log";
import { sendPasswordResetEmail } from "@/lib/mailer";

const RESET_PASSWORD_TTL_MS = 30 * 60 * 1000;

/** Generates the reset token, persists it, and emails the link. Called once MFA (if any) has been satisfied. */
export async function issuePasswordResetEmail(
  user: { userId: string; email: string },
  meta: { ipAddress: string | null; userAgent: string | null }
) {
  const rawToken = randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + RESET_PASSWORD_TTL_MS);

  await prisma.user.update({
    where: { userId: user.userId },
    data: { passwordResetToken: hashToken(rawToken), passwordResetExpiry: expiry },
  });

  const resetUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);
  await writeAuditLog({
    userId: user.userId,
    eventType: "forgot_password_requested",
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}
