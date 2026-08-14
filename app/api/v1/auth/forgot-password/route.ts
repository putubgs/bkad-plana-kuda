import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createPendingForgotPasswordChallenge } from "@/lib/auth/mfa-pending";
import { issuePasswordResetEmail } from "@/lib/auth/issue-password-reset-email";
import { rateLimit } from "@/lib/rate-limit";
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

  const limitResult = await rateLimit({
    key: `forgot-password:${email.toLowerCase()}`,
    limit: 3,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
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
    return NextResponse.json<ApiResult>({ mfaRequired: true });
  }

  await issuePasswordResetEmail(user);
  return NextResponse.json<ApiResult>(FORGOT_PASSWORD_GENERIC_SUCCESS);
}
