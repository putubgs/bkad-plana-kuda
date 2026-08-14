import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { createUserSchema } from "@/lib/validation/auth-schemas";
import { isSuperadmin, requireApiSession } from "@/lib/api/auth";
import { parsePagination, USER_PUBLIC_SELECT } from "@/lib/api/dtos";
import type { ApiResult } from "@/lib/api/types";

export async function GET(request: NextRequest) {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { searchParams } = request.nextUrl;
  const { page, pageSize, skip, take } = parsePagination(searchParams);
  const includeDeleted = searchParams.get("includeDeleted") === "true" && isSuperadmin(session.user.role);

  const where = includeDeleted ? {} : { isDeleted: false };

  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: USER_PUBLIC_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
  ]);

  return NextResponse.json<ApiResult>({ data, meta: { page, pageSize, total } });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  if (!isSuperadmin(session.user.role)) {
    return NextResponse.json<ApiResult>({ error: "Akses ditolak." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { username, email, password, role, departmentName, biography, isActive } = parsed.data;

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: await hashPassword(password),
        role: role ?? "admin",
        departmentName: departmentName ?? null,
        biography: biography ?? null,
        isActive: isActive ?? true,
      },
      select: USER_PUBLIC_SELECT,
    });

    return NextResponse.json<ApiResult>({ data: user, success: "Pengguna berhasil dibuat." }, { status: 201 });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json<ApiResult>(
        { error: "Username, email, atau nama bidang sudah digunakan." },
        { status: 409 }
      );
    }
    throw error;
  }
}
