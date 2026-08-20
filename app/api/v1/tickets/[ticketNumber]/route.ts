import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { requireApiSession } from "@/lib/api/auth";
import { updateTicketSchema } from "@/lib/validation/ticket-schemas";
import {
  assertDepartmentNamesExist,
  DepartmentNotFoundError,
  TICKET_DETAIL_INCLUDE,
} from "@/lib/tickets/queries";
import { findAccessibleTicket } from "@/lib/tickets/scope";
import { toLayananMasuk } from "@/lib/tickets/to-layanan-masuk";
import type { ApiResult } from "@/lib/api/types";

type RouteContext = { params: Promise<{ ticketNumber: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { session, response } = await requireApiSession();
  console.log(session);
  if (!session) return response;

  const { ticketNumber } = await context.params;
  const accessible = await findAccessibleTicket(session.user, decodeURIComponent(ticketNumber));
  if (!accessible) {
    return NextResponse.json<ApiResult>({ error: "Tiket tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json<ApiResult>({ data: accessible.mapped });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { ticketNumber } = await context.params;
  const decoded = decodeURIComponent(ticketNumber);
  const accessible = await findAccessibleTicket(session.user, decoded);
  if (!accessible) {
    return NextResponse.json<ApiResult>({ error: "Tiket tidak ditemukan." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateTicketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { departmentNames, ticketNumber: nextNumber, ...fields } = parsed.data;
  const finalNumber = nextNumber ?? decoded;

  try {
    if (departmentNames) {
      await assertDepartmentNamesExist(departmentNames);
    }

    const ticket = await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { ticketNumber: decoded },
        data: {
          ...fields,
          ...(nextNumber && nextNumber !== decoded ? { ticketNumber: nextNumber } : {}),
        },
      });

      if (departmentNames) {
        const uniqueDepartments = [...new Set(departmentNames)];
        await tx.ticketDepartment.deleteMany({ where: { ticketNumber: finalNumber } });
        if (uniqueDepartments.length > 0) {
          await tx.ticketDepartment.createMany({
            data: uniqueDepartments.map((departmentName) => ({
              ticketNumber: finalNumber,
              departmentName,
            })),
          });
        }
      }

      return tx.ticket.findUniqueOrThrow({
        where: { ticketNumber: finalNumber },
        include: TICKET_DETAIL_INCLUDE,
      });
    });

    return NextResponse.json<ApiResult>({ data: toLayananMasuk(ticket), success: "Tiket berhasil diperbarui." });
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { ticketNumber } = await context.params;
  const decoded = decodeURIComponent(ticketNumber);
  const accessible = await findAccessibleTicket(session.user, decoded);
  if (!accessible) {
    return NextResponse.json<ApiResult>({ error: "Tiket tidak ditemukan." }, { status: 404 });
  }

  await prisma.ticket.update({
    where: { ticketNumber: decoded },
    data: { isDeleted: true },
  });

  return NextResponse.json<ApiResult>({ success: "Tiket berhasil dihapus." });
}
