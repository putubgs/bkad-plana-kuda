import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/app/generated/prisma/client";

export type AuditEventType =
  | "login_success"
  | "login_failed"
  | "login_mfa_required"
  | "mfa_verify_success"
  | "mfa_verify_failed"
  | "mfa_recovery_code_used"
  | "logout"
  | "password_change_success"
  | "password_change_failed"
  | "forgot_password_requested"
  | "forgot_password_mfa_required"
  | "forgot_password_mfa_verify_success"
  | "forgot_password_mfa_verify_failed"
  | "password_reset_success"
  | "password_reset_failed"
  | "mfa_enabled"
  | "mfa_disabled"
  | "mfa_recovery_codes_regenerated"
  | "rate_limited";

interface AuditLogInput {
  userId?: string | null;
  eventType: AuditEventType;
  /** Never put passwords, TOTP secrets, OTP values, or recovery-code plaintext here. */
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(input: AuditLogInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        eventType: input.eventType,
        metadata: (input.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
