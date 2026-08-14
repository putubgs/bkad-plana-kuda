import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { updateUserSchema } from "@/lib/validation/auth-schemas";
import { requireApiSession } from "@/lib/api/auth";
import { USER_PUBLIC_SELECT } from "@/lib/api/dtos";
import type { ApiResult } from "@/lib/api/types";

export async function GET() {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const user = await prisma.user.findUnique({
    where: { userId: session.userId },
    select: USER_PUBLIC_SELECT,
  });

  if (!user) {
    return NextResponse.json<ApiResult>({ error: "Pengguna tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json<ApiResult>({ data: user });
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const body = await request.json().catch(() => null);
  const parsed = updateUserSchema.pick({ email: true, departmentName: true, biography: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { userId: session.userId },
      data: parsed.data,
      select: USER_PUBLIC_SELECT,
    });

    return NextResponse.json<ApiResult>({ data: user, success: "Profil berhasil diperbarui." });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json<ApiResult>({ error: "Email atau nama bidang sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}
