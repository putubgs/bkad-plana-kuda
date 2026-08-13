import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { createPendingMfaChallenge } from "@/lib/auth/mfa-pending";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/audit-log";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { loginSchema } from "@/lib/validation/auth-schemas";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse({
    username: body?.username,
    password: body?.password,
    rememberMe: body?.rememberMe === true,
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

  const { username, password, rememberMe } = parsed.data;
  const { ipAddress, userAgent } = await getRequestMeta();

  const limiterKey = `login:${username.toLowerCase()}`;
  const limitResult = await rateLimit({ key: limiterKey, limit: 5, windowSeconds: 15 * 60 });
  if (!limitResult.success) {
    await writeAuditLog({
      eventType: "rate_limited",
      metadata: { action: "login", username },
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>(
      {
        error: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(limitResult.retryAfterSeconds / 60)} menit.`,
      },
      { status: 429 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { isDeleted: false, OR: [{ username }, { email: username }] },
  });

  if (!user || !user.isActive || !(await verifyPassword(password, user.password))) {
    await writeAuditLog({
      userId: user?.userId,
      eventType: "login_failed",
      metadata: { username },
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>(
      { error: "Username/email atau kata sandi salah." },
      { status: 401 }
    );
  }

  await resetRateLimit(limiterKey);

  if (user.mfaEnabled) {
    await createPendingMfaChallenge(user.userId, Boolean(rememberMe));
    await writeAuditLog({
      userId: user.userId,
      eventType: "login_mfa_required",
      ipAddress,
      userAgent,
    });
    return NextResponse.json<ApiResult>({ mfaRequired: true });
  }

  await createSession(user.userId, { rememberMe, ipAddress, userAgent });
  await writeAuditLog({ userId: user.userId, eventType: "login_success", ipAddress, userAgent });

  return NextResponse.json<ApiResult>({ redirectTo: "/" });
}
