import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApiSession } from "@/lib/auth/dal";
import { encryptSecret } from "@/lib/auth/encryption";
import { verifyOtp } from "@/lib/auth/mfa";
import { clearPendingMfaSecret, getPendingMfaSecret } from "@/lib/auth/mfa-pending";
import { generateRecoveryCodePlaintexts, replaceRecoveryCodes } from "@/lib/auth/recovery-codes";
import { rateLimit } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { mfaSetupVerifySchema } from "@/lib/validation/auth-schemas";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const session = await getApiSession();
  if (!session) {
    return NextResponse.json<ApiResult>({ error: "Sesi tidak valid. Silakan login kembali." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = mfaSetupVerifySchema.safeParse({
    otp: typeof body?.otp === "string" ? body.otp.replace(/\s/g, "") : body?.otp,
  });
  if (!parsed.success) {
    return NextResponse.json<ApiResult>({ error: "Kode OTP harus 6 digit." }, { status: 400 });
  }

  const limitResult = await rateLimit({
    key: `mfa-setup-verify:${session.userId}`,
    limit: 8,
    windowSeconds: 10 * 60,
  });
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const pendingSecret = await getPendingMfaSecret(session.userId);
  if (!pendingSecret) {
    return NextResponse.json<ApiResult>(
      { error: "Sesi pengaturan MFA telah kedaluwarsa. Silakan mulai ulang." },
      { status: 400 }
    );
  }

  const valid = await verifyOtp(parsed.data.otp, pendingSecret);
  if (!valid) {
    return NextResponse.json<ApiResult>(
      { error: "Kode OTP tidak valid. Pastikan waktu di perangkat Anda sudah benar." },
      { status: 401 }
    );
  }

  const recoveryCodes = generateRecoveryCodePlaintexts();

  await prisma.user.update({
    where: { userId: session.userId },
    data: {
      mfaEnabled: true,
      mfaSecret: encryptSecret(pendingSecret),
      mfaEnabledAt: new Date(),
    },
  });
  await replaceRecoveryCodes(session.userId, recoveryCodes);
  await clearPendingMfaSecret(session.userId);
  revalidatePath("/pengaturan");

  return NextResponse.json<ApiResult>({
    success: "MFA berhasil diaktifkan. Simpan kode pemulihan berikut di tempat yang aman.",
    recoveryCodes,
  });
}
