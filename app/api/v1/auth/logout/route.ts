import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { destroySession, getSessionToken, hashToken } from "@/lib/auth/session";
import { writeAuditLog } from "@/lib/audit-log";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const rawToken = await getSessionToken();

  if (rawToken) {
    const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(rawToken) } });
    if (session) {
      const { ipAddress, userAgent } = await getRequestMeta();
      await writeAuditLog({ userId: session.userId, eventType: "logout", ipAddress, userAgent });
    }
  }

  await destroySession();

  return NextResponse.json<ApiResult>({ redirectTo: "/login" });
}
