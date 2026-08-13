import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getApiSession } from "@/lib/auth/dal";
import { verifyPassword } from "@/lib/auth/password";
import { generateRecoveryCodePlaintexts, replaceRecoveryCodes } from "@/lib/auth/recovery-codes";
import { rateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit-log";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { mfaReauthSchema } from "@/lib/validation/auth-schemas";
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
  const parsed = mfaReauthSchema.safeParse({ currentPassword: body?.currentPassword });
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      { error: "Masukkan password Anda untuk melanjutkan." },
      { status: 400 }
    );
  }

  const { ipAddress, userAgent } = await getRequestMeta();
  const limitResult = await rateLimit({
    key: `mfa-recovery-regen:${session.userId}`,
    limit: 5,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const user = await prisma.user.findUnique({ where: { userId: session.userId } });
  if (!user || !user.mfaEnabled) {
    return NextResponse.json<ApiResult>({ error: "MFA belum diaktifkan untuk akun ini." }, { status: 400 });
  }
  if (!(await verifyPassword(parsed.data.currentPassword, user.password))) {
    return NextResponse.json<ApiResult>({ error: "Password tidak sesuai." }, { status: 400 });
  }

  const recoveryCodes = generateRecoveryCodePlaintexts();
  await replaceRecoveryCodes(session.userId, recoveryCodes);
  await writeAuditLog({
    userId: session.userId,
    eventType: "mfa_recovery_codes_regenerated",
    ipAddress,
    userAgent,
  });

  return NextResponse.json<ApiResult>({
    success: "Kode pemulihan baru berhasil dibuat. Kode lama tidak berlaku lagi.",
    recoveryCodes,
  });
}
