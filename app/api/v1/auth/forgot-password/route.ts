import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createPendingForgotPasswordChallenge } from "@/lib/auth/mfa-pending";
import { issuePasswordResetEmail } from "@/lib/auth/issue-password-reset-email";
import { rateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit-log";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { forgotPasswordSchema } from "@/lib/validation/auth-schemas";
import type { ApiResult } from "@/lib/api/types";

const FORGOT_PASSWORD_GENERIC_SUCCESS: ApiResult = {
  success: "Jika email terdaftar, tautan reset password telah dikirim ke email Anda.",
};

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse({ email: body?.email });

  if (!parsed.success) {
    return NextResponse.json<ApiResult>({ error: "Masukkan alamat email yang valid." }, { status: 400 });
  }

  const { email } = parsed.data;
  const { ipAddress, userAgent } = await getRequestMeta();

  const limitResult = await rateLimit({
    key: `forgot-password:${email.toLowerCase()}`,
    limit: 3,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
    await writeAuditLog({
      eventType: "rate_limited",
      metadata: { action: "forgot_password", email },
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>(FORGOT_PASSWORD_GENERIC_SUCCESS);
  }

  const user = await prisma.user.findFirst({
    where: { email, isDeleted: false, isActive: true },
  });

  if (!user) {
    // Always return the same message, whether or not the email exists, to avoid user enumeration.
    return NextResponse.json<ApiResult>(FORGOT_PASSWORD_GENERIC_SUCCESS);
  }

  if (user.mfaEnabled) {
    await createPendingForgotPasswordChallenge(user.userId);
    await writeAuditLog({
      userId: user.userId,
      eventType: "forgot_password_mfa_required",
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>({ mfaRequired: true });
  }

  await issuePasswordResetEmail(user, { ipAddress, userAgent });
  return NextResponse.json<ApiResult>(FORGOT_PASSWORD_GENERIC_SUCCESS);
}
