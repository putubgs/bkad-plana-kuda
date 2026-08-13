import { NextRequest, NextResponse } from "next/server";
import { getApiSession } from "@/lib/auth/dal";
import { buildOtpAuthUri, generateMfaSecret, generateQrCodeDataUrl } from "@/lib/auth/mfa";
import { storePendingMfaSecret } from "@/lib/auth/mfa-pending";
import { resetRateLimit } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const session = await getApiSession();
  if (!session) {
    return NextResponse.json<ApiResult>({ error: "Sesi tidak valid. Silakan login kembali." }, { status: 401 });
  }

  if (session.user.mfaEnabled) {
    return NextResponse.json<ApiResult>({ error: "MFA sudah aktif untuk akun ini." }, { status: 400 });
  }

  const secret = await storePendingMfaSecret(session.userId, generateMfaSecret());
  await resetRateLimit(`mfa-setup-verify:${session.userId}`);

  const otpAuthUri = buildOtpAuthUri(session.user.email, secret);
  const qrCodeDataUrl = await generateQrCodeDataUrl(otpAuthUri);

  return NextResponse.json<ApiResult>({ qrCodeDataUrl, secret });
}
