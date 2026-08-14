import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { destroyAllSessionsForUser } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { updateUserSchema } from "@/lib/validation/auth-schemas";
import { isSuperadmin, requireApiSession } from "@/lib/api/auth";
import { USER_PUBLIC_SELECT } from "@/lib/api/dtos";
import type { ApiResult } from "@/lib/api/types";

async function canAccessUser(actorRole: string, actorId: string, targetId: string) {
  return actorId === targetId || isSuperadmin(actorRole);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { userId } = await context.params;
  if (!(await canAccessUser(session.user.role, session.userId, userId))) {
    return NextResponse.json<ApiResult>({ error: "Akses ditolak." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { userId },
    select: USER_PUBLIC_SELECT,
  });

  if (!user) {
    return NextResponse.json<ApiResult>({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json<ApiResult>({ data: user });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  if (!isSuperadmin(session.user.role)) {
    return NextResponse.json<ApiResult>({ error: "Akses ditolak." }, { status: 403 });
  }

  const { userId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { userId } });
  if (!existing) {
    return NextResponse.json<ApiResult>({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  try {
    const user = await prisma.user.update({
      where: { userId },
      data: parsed.data,
      select: USER_PUBLIC_SELECT,
    });

    return NextResponse.json<ApiResult>({ data: user, success: "Pengguna berhasil diperbarui." });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json<ApiResult>({ error: "Email atau nama bidang sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  if (!isSuperadmin(session.user.role)) {
    return NextResponse.json<ApiResult>({ error: "Akses ditolak." }, { status: 403 });
  }

  const { userId } = await context.params;
  if (userId === session.userId) {
    return NextResponse.json<ApiResult>({ error: "Tidak dapat menghapus akun Anda sendiri." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { userId } });
  if (!existing || existing.isDeleted) {
    return NextResponse.json<ApiResult>({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  await prisma.user.update({
    where: { userId },
    data: { isDeleted: true, isActive: false },
  });
  await destroyAllSessionsForUser(userId);

  return NextResponse.json<ApiResult>({ success: "Pengguna berhasil dihapus." });
}
