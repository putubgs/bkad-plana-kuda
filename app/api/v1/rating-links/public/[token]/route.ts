import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashToken } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import { TICKET_DETAIL_INCLUDE } from "@/lib/tickets/queries";
import { toLayananMasuk } from "@/lib/tickets/to-layanan-masuk";
import { submitPublicRatingSchema } from "@/lib/validation/rating-link-schema";
import type { ApiResult } from "@/lib/api/types";

type RouteContext = { params: Promise<{ token: string }> };

const PUBLIC_LINK_INCLUDE = {
  ticket: {
    include: {
      ...TICKET_DETAIL_INCLUDE,
      rating: { select: { ratingId: true } },
    },
  },
} as const;

async function findLinkByRawToken(rawToken: string) {
  return prisma.ratingLink.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: PUBLIC_LINK_INCLUDE,
  });
}

async function rateLimitPublicRating(ipAddress: string | null) {
  return rateLimit({
    key: `rating-link:${ipAddress ?? "unknown"}`,
    limit: 30,
    windowSeconds: 60,
  });
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { ipAddress } = await getRequestMeta();
  const limitResult = await rateLimitPublicRating(ipAddress);
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const { token } = await context.params;
  const rawToken = decodeURIComponent(token).trim();
  if (!rawToken) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating tidak valid." }, { status: 404 });
  }

  const link = await findLinkByRawToken(rawToken);
  if (!link || link.ticket.isDeleted) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating tidak ditemukan." }, { status: 404 });
  }

  if (link.isUsed || link.ticket.rating) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan rating sudah digunakan." },
      { status: 410 }
    );
  }

  if (link.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating sudah kedaluwarsa." }, { status: 410 });
  }

  return NextResponse.json<ApiResult>({
    data: {
      ticket: toLayananMasuk(link.ticket),
      isUsed: false,
      expiresAt: link.expiresAt.toISOString(),
    },
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { ipAddress } = await getRequestMeta();
  const limitResult = await rateLimitPublicRating(ipAddress);
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const { token } = await context.params;
  const rawToken = decodeURIComponent(token).trim();
  if (!rawToken) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating tidak valid." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitPublicRatingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const link = await findLinkByRawToken(rawToken);
  if (!link || link.ticket.isDeleted) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating tidak ditemukan." }, { status: 404 });
  }

  if (link.isUsed || link.ticket.rating) {
    return NextResponse.json<ApiResult>(
      { error: "Tautan rating sudah digunakan." },
      { status: 410 }
    );
  }

  if (link.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json<ApiResult>({ error: "Tautan rating sudah kedaluwarsa." }, { status: 410 });
  }

  const mapped = toLayananMasuk(link.ticket);
  if (mapped.status !== "Selesai" && !link.ticket.isCompleted) {
    return NextResponse.json<ApiResult>(
      { error: "Rating hanya dapat dikirim setelah layanan selesai." },
      { status: 400 }
    );
  }

  const departmentNames = link.ticket.departments.map((row) => row.departmentName);
  const departmentUsers =
    departmentNames.length > 0
      ? await prisma.user.findMany({
          where: { departmentName: { in: departmentNames }, isDeleted: false },
          select: { userId: true },
        })
      : [];

  try {
    await prisma.$transaction(async (tx) => {
      await tx.ratingLink.update({
        where: { ratingLinkId: link.ratingLinkId },
        data: { isUsed: true, usedAt: new Date() },
      });

      await tx.rating.create({
        data: {
          ticketNumber: link.ticketNumber,
          ratingValue: parsed.data.rating,
          ratingComment: parsed.data.comment || null,
          users: {
            create: departmentUsers.map((user) => ({ userId: user.userId })),
          },
        },
      });
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") {
      return NextResponse.json<ApiResult>(
        { error: "Tautan rating sudah digunakan." },
        { status: 410 }
      );
    }
    throw error;
  }

  return NextResponse.json<ApiResult>({ success: "Rating berhasil dikirim." }, { status: 201 });
}
