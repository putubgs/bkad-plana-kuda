import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  clearPendingForgotPasswordChallenge,
  getPendingForgotPasswordChallenge,
} from "@/lib/auth/mfa-pending";
import { decryptSecret } from "@/lib/auth/encryption";
import { verifyOtp } from "@/lib/auth/mfa";
import { consumeRecoveryCode } from "@/lib/auth/recovery-codes";
import { issuePasswordResetEmail } from "@/lib/auth/issue-password-reset-email";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit-log";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { otpVerifySchema } from "@/lib/validation/auth-schemas";
import type { ApiResult } from "@/lib/api/types";

const FORGOT_PASSWORD_GENERIC_SUCCESS: ApiResult = {
  success: "Jika email terdaftar, tautan reset password telah dikirim ke email Anda.",
};

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse({ otp: body?.otp });
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      { error: "Masukkan kode OTP atau kode pemulihan yang valid." },
      { status: 400 }
    );
  }

  const challenge = await getPendingForgotPasswordChallenge();
  if (!challenge) {
    return NextResponse.json<ApiResult>(
      { error: "Sesi verifikasi telah kedaluwarsa. Silakan ulangi dari awal." },
      { status: 400 }
    );
  }

  const { ipAddress, userAgent } = await getRequestMeta();
  const limiterKey = `forgot-password-mfa-verify:${challenge.userId}`;
  const limitResult = await rateLimit({ key: limiterKey, limit: 5, windowSeconds: 10 * 60 });
  if (!limitResult.success) {
    await writeAuditLog({
      userId: challenge.userId,
      eventType: "rate_limited",
      metadata: { action: "forgot_password_mfa_verify" },
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>(
      {
        error: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(limitResult.retryAfterSeconds / 60)} menit.`,
      },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { userId: challenge.userId } });
  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    await clearPendingForgotPasswordChallenge(challenge.token);
    return NextResponse.json<ApiResult>(
      { error: "Verifikasi tidak tersedia untuk akun ini." },
      { status: 400 }
    );
  }

  const candidate = parsed.data.otp.replace(/\s/g, "");
  let verified = false;
  let usedRecoveryCode = false;

  if (/^\d{6}$/.test(candidate)) {
    verified = await verifyOtp(candidate, decryptSecret(user.mfaSecret));
  }

  if (!verified) {
    verified = await consumeRecoveryCode(user.userId, candidate);
    usedRecoveryCode = verified;
  }

  if (!verified) {
    await writeAuditLog({
      userId: user.userId,
      eventType: "forgot_password_mfa_verify_failed",
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>(
      { error: "Kode OTP atau kode pemulihan tidak valid." },
      { status: 401 }
    );
  }

  await resetRateLimit(limiterKey);
  await clearPendingForgotPasswordChallenge(challenge.token);

  if (usedRecoveryCode) {
    await writeAuditLog({
      userId: user.userId,
      eventType: "mfa_recovery_code_used",
      ipAddress,
      userAgent,
    });
  }
  await writeAuditLog({
    userId: user.userId,
    eventType: "forgot_password_mfa_verify_success",
    ipAddress,
    userAgent,
  });

  await issuePasswordResetEmail(user, { ipAddress, userAgent });
  return NextResponse.json<ApiResult>(FORGOT_PASSWORD_GENERIC_SUCCESS);
}
