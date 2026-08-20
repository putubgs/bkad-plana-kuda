import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { requireApiSession } from "@/lib/api/auth";
import { findAccessibleTicket } from "@/lib/tickets/scope";
import { updateRatingLinkSchema } from "@/lib/validation/rating-link-schema";
import { ratingLinkExpiresAt, toRatingLinkDto } from "@/lib/rating-links/dto";
import type { ApiResult } from "@/lib/api/types";

type RouteContext = { params: Promise<{ ticketNumber: string }> };

async function loadAccessibleLink(ticketNumber: string, actor: { role: string; departmentName: string | null }) {
  const accessible = await findAccessibleTicket(actor, ticketNumber);
  if (!accessible) {
    return { error: NextResponse.json<ApiResult>({ error: "Tiket tidak ditemukan." }, { status: 404 }) };
  }

  const link = await prisma.ratingLink.findUnique({ where: { ticketNumber } });
  if (!link) {
    return { error: NextResponse.json<ApiResult>({ error: "Tautan rating tidak ditemukan." }, { status: 404 }) };
  }

  return { link };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { ticketNumber } = await context.params;
  const decoded = decodeURIComponent(ticketNumber);
  const result = await loadAccessibleLink(decoded, session.user);
  if (result.error) return result.error;

  return NextResponse.json<ApiResult>({ data: toRatingLinkDto(result.link) });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const { ticketNumber } = await context.params;
  const decoded = decodeURIComponent(ticketNumber);
  const result = await loadAccessibleLink(decoded, session.user);
  if (result.error) return result.error;

  if (result.link.isUsed) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan rating sudah digunakan dan tidak dapat diperbarui." },
      { status: 409 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = updateRatingLinkSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const expiresAt = parsed.data.expiresAt ?? ratingLinkExpiresAt();
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
    return NextResponse.json<ApiResult>(
      { error: "Tanggal kedaluwarsa tautan rating tidak valid." },
      { status: 400 }
    );
  }

  const link = await prisma.ratingLink.update({
    where: { ticketNumber: decoded },
    data: { expiresAt },
  });

  return NextResponse.json<ApiResult>({
    data: toRatingLinkDto(link),
    success: "Tautan rating berhasil diperbarui.",
  });
}
