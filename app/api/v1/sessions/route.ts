import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { requireApiSession } from "@/lib/api/auth";
import { toPublicSession } from "@/lib/api/dtos";
import type { ApiResult } from "@/lib/api/types";

export async function GET() {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const rows = await prisma.session.findMany({
    where: { userId: session.userId },
    orderBy: { lastSeenAt: "desc" },
  });

  return NextResponse.json<ApiResult>({
    data: rows.map((row) => toPublicSession(row, session.id)),
  });
}

/** Revoke every session except the current one. */
export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const result = await prisma.session.deleteMany({
    where: { userId: session.userId, id: { not: session.id } },
  });

  return NextResponse.json<ApiResult>({
    success: "Sesi lain telah diakhiri.",
    data: { revoked: result.count },
  });
}
