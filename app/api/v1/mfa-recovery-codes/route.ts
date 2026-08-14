import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import {
  countRemainingRecoveryCodes,
  generateRecoveryCodePlaintexts,
  replaceRecoveryCodes,
} from "@/lib/auth/recovery-codes";
import { rateLimit } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { mfaReauthSchema } from "@/lib/validation/auth-schemas";
import { requireApiSession } from "@/lib/api/auth";
import { toPublicRecoveryCode } from "@/lib/api/dtos";
import type { ApiResult } from "@/lib/api/types";

export async function GET() {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const [codes, remaining] = await Promise.all([
    prisma.mfaRecoveryCode.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    countRemainingRecoveryCodes(session.userId),
  ]);

  return NextResponse.json<ApiResult>({
    data: {
      remaining,
      codes: codes.map(toPublicRecoveryCode),
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const body = await request.json().catch(() => null);
  const parsed = mfaReauthSchema.safeParse({ currentPassword: body?.currentPassword });
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      { error: "Masukkan password Anda untuk melanjutkan." },
      { status: 400 }
    );
  }

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

  return NextResponse.json<ApiResult>({
    success: "Kode pemulihan baru berhasil dibuat. Kode lama tidak berlaku lagi.",
    recoveryCodes,
    data: { remaining: recoveryCodes.length },
  });
}
