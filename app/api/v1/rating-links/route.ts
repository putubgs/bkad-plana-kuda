import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { requireApiSession } from "@/lib/api/auth";
import { hashToken } from "@/lib/auth/session";
import { findAccessibleTicket } from "@/lib/tickets/scope";
import { createRatingLinkSchema } from "@/lib/validation/rating-link-schema";
import {
  createRatingToken,
  ratingLinkExpiresAt,
  toRatingLinkDto,
} from "@/lib/rating-links/dto";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { session, response } = await requireApiSession();
  if (!session) return response;

  const body = await request.json().catch(() => null);
  const parsed = createRatingLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const ticketNumber = parsed.data.ticketNumber;
  const accessible = await findAccessibleTicket(session.user, ticketNumber);
  if (!accessible) {
    return NextResponse.json<ApiResult>({ error: "Tiket tidak ditemukan." }, { status: 404 });
  }

  if (accessible.mapped.status !== "Selesai" && !accessible.ticket.isCompleted) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan rating hanya dapat dibuat untuk tiket yang sudah selesai." },
      { status: 400 }
    );
  }

  const existing = await prisma.ratingLink.findUnique({ where: { ticketNumber } });
  if (existing?.isUsed) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan rating sudah digunakan. Tautan baru tidak dapat dibuat." },
      { status: 409 }
    );
  }

  const rawToken = createRatingToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = ratingLinkExpiresAt();

  const link = existing
    ? await prisma.ratingLink.update({
        where: { ticketNumber },
        data: { tokenHash, expiresAt },
      })
    : await prisma.ratingLink.create({
        data: { ticketNumber, tokenHash, expiresAt },
      });

  return NextResponse.json<ApiResult>(
    {
      data: toRatingLinkDto(link, { token: rawToken }),
      success: existing ? "Tautan rating diperbarui." : "Tautan rating berhasil dibuat.",
    },
    { status: existing ? 200 : 201 }
  );
}
