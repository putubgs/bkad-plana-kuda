import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { destroySession } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { requireApiSession } from "@/lib/api/auth";
import type { ApiResult } from "@/lib/api/types";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { id } = await context.params;
  const target = await prisma.session.findUnique({ where: { id } });
  if (!target || target.userId !== session.userId) {
    return NextResponse.json<ApiResult>({ error: "Sesi tidak ditemukan." }, { status: 404 });
  }

  const isCurrent = target.id === session.id;

  await prisma.session.delete({ where: { id } });
  if (isCurrent) {
    await destroySession();
  }

  return NextResponse.json<ApiResult>({
    success: isCurrent ? "Sesi saat ini telah diakhiri." : "Sesi berhasil diakhiri.",
    redirectTo: isCurrent ? "/login" : undefined,
  });
}
