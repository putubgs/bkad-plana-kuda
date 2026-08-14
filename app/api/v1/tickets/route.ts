import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { isSuperadmin, requireApiSession } from "@/lib/api/auth";
import { createTicketSchema } from "@/lib/validation/ticket-schemas";
import {
  assertDepartmentNamesExist,
  DepartmentNotFoundError,
  generateTicketNumber,
  TICKET_DETAIL_INCLUDE,
} from "@/lib/tickets/queries";
import { toLayananMasuk } from "@/lib/tickets/to-layanan-masuk";
import type { ApiResult } from "@/lib/api/types";

function parseTicketListQuery(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 50) || 50));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { searchParams } = request.nextUrl;
  const { page, pageSize, skip, take } = parseTicketListQuery(searchParams);
  const includeDeleted = searchParams.get("includeDeleted") === "true" && isSuperadmin(session.user.role);
  const q = searchParams.get("q")?.trim();
  const isCompletedParam = searchParams.get("isCompleted");

  const where = {
    ...(includeDeleted ? {} : { isDeleted: false }),
    ...(isCompletedParam === "true" ? { isCompleted: true } : {}),
    ...(isCompletedParam === "false" ? { isCompleted: false } : {}),
    ...(q
      ? {
          OR: [
            { ticketNumber: { contains: q, mode: "insensitive" as const } },
            { applicantName: { contains: q, mode: "insensitive" as const } },
            { organizationName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      include: TICKET_DETAIL_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
  ]);

  return NextResponse.json<ApiResult>({
    data: rows.map(toLayananMasuk),
    meta: { page, pageSize, total },
  });
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const body = await request.json().catch(() => null);
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { departmentNames = [], ticketNumber: requestedNumber, ...fields } = parsed.data;

  try {
    const uniqueDepartments = await assertDepartmentNamesExist(departmentNames);
    const ticketNumber = requestedNumber ?? (await generateTicketNumber());

    const ticket = await prisma.ticket.create({
      data: {
        ...fields,
        ticketNumber,
        departments: {
          create: uniqueDepartments.map((departmentName) => ({ departmentName })),
        },
      },
      include: TICKET_DETAIL_INCLUDE,
    });

    return NextResponse.json<ApiResult>(
      { data: toLayananMasuk(ticket), success: "Tiket berhasil dibuat." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof DepartmentNotFoundError) {
      return NextResponse.json<ApiResult>(
        { error: `Bidang/UPTB tidak ditemukan: ${error.missing.join(", ")}` },
        { status: 400 }
      );
    }
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json<ApiResult>({ error: "Nomor tiket sudah digunakan." }, { status: 409 });
    }
    throw error;
  }
}
