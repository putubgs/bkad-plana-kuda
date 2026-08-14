import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getApiSession } from "@/lib/auth/dal";
import { rateLimit } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { changePasswordSchema } from "@/lib/validation/auth-schemas";
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
  const parsed = changePasswordSchema.safeParse({
    currentPassword: body?.currentPassword,
    newPassword: body?.newPassword,
    confirmPassword: body?.confirmPassword,
  });

  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const limitResult = await rateLimit({
    key: `change-password:${session.userId}`,
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
  if (!user) {
    return NextResponse.json<ApiResult>({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  if (!(await verifyPassword(parsed.data.currentPassword, user.password))) {
    return NextResponse.json<ApiResult>({ error: "Password lama tidak sesuai." }, { status: 400 });
  }

  await prisma.user.update({
    where: { userId: user.userId },
    data: { password: await hashPassword(parsed.data.newPassword) },
  });

  return NextResponse.json<ApiResult>({ success: "Password berhasil diubah." });
}
