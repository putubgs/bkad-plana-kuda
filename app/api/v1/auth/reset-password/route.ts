import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { destroyAllSessionsForUser, hashToken } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { resetPasswordSchema } from "@/lib/validation/auth-schemas";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse({
    token: body?.token,
    password: body?.password,
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

  const { token, password } = parsed.data;
  const { ipAddress } = await getRequestMeta();

  const limitResult = await rateLimit({
    key: `reset-password:${ipAddress ?? "unknown"}`,
    limit: 10,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: hashToken(token), isDeleted: false },
  });

  if (!user || !user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan reset password tidak valid atau sudah kedaluwarsa." },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: await hashPassword(password),
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  await destroyAllSessionsForUser(user.userId);

  return NextResponse.json<ApiResult>({ redirectTo: "/login?reset=success" });
}
