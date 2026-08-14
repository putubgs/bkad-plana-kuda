import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getApiSession } from "@/lib/auth/dal";
import { verifyPassword } from "@/lib/auth/password";
import { deleteAllRecoveryCodes } from "@/lib/auth/recovery-codes";
import { rateLimit } from "@/lib/rate-limit";
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

  const limitResult = await rateLimit({
    key: `mfa-disable:${session.userId}`,
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
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.password))) {
    return NextResponse.json<ApiResult>({ error: "Password tidak sesuai." }, { status: 400 });
  }

  await prisma.user.update({
    where: { userId: session.userId },
    data: { mfaEnabled: false, mfaSecret: null, mfaEnabledAt: null },
  });
  await deleteAllRecoveryCodes(session.userId);
  revalidatePath("/pengaturan");

  return NextResponse.json<ApiResult>({ success: "MFA telah dinonaktifkan untuk akun ini." });
}
