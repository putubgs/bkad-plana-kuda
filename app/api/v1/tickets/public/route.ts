import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isSameOrigin } from "@/lib/auth/verify-origin";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import { publicConsultationSchema } from "@/lib/validation/public-ticket-schema";
import {
  assertDepartmentNamesExist,
  DepartmentNotFoundError,
  generateTicketNumber,
  TICKET_DETAIL_INCLUDE,
} from "@/lib/tickets/queries";
import { toLayananMasuk } from "@/lib/tickets/to-layanan-masuk";
import {
  dispatchTicketEmailWebhook,
  resolveTicketEmailWebhookUrl,
} from "@/lib/webhooks/dispatch-ticket-email";
import type { ApiResult } from "@/lib/api/types";

const NOTIFY_EMAIL = process.env.TICKET_NOTIFY_EMAIL?.trim() || "putubaguswidia@gmail.com";
const DITERIMA_NOTE =
  "Permohonan layanan konsultasi diterima melalui formulir publik Plana Kuda dan nomor tiket diterbitkan secara otomatis.";

function clip(value: string, max = 255) {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json<ApiResult>({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const { ipAddress } = await getRequestMeta();
  const limitResult = await rateLimit({
    key: `public-ticket:${ipAddress ?? "unknown"}`,
    limit: 8,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak pengiriman. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = publicConsultationSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    console.warn("public ticket validation failed", fieldErrors);
    return NextResponse.json<ApiResult>(
      {
        error: "Periksa kembali data yang Anda masukkan.",
        fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const uniqueDepartments = await assertDepartmentNamesExist(data.departmentNames);
    const actor = await prisma.user.findFirst({
      where: { isDeleted: false, OR: [{ role: "superadmin" }, { username: "planakuda" }] },
      orderBy: { createdAt: "asc" },
      select: { userId: true },
    });

    if (!actor) {
      return NextResponse.json<ApiResult>(
        { error: "Sistem belum siap menerima tiket. Hubungi administrator." },
        { status: 503 }
      );
    }

    const ticketNumber = await generateTicketNumber();
    const serviceDescription = `Topik: ${data.topic}\n\n${data.serviceDescription}`;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        applicantName: data.applicantName,
        applicantOccupation: data.applicantOccupation?.trim() || "-",
        whatsappNumber: data.whatsappNumber,
        organizationName: data.organizationName,
        identityNumber: data.identityNumber,
        applicantEmail: data.applicantEmail,
        serviceDescription,
        departments: {
          create: uniqueDepartments.map((departmentName) => ({ departmentName })),
        },
        progresses: {
          create: {
            progressName: "Diterima",
            dateAndTime: new Date(),
            progressNote: clip(DITERIMA_NOTE),
            followUpFeedback: "Verifikasi dokumen dan identitas pemohon.",
            updatedById: actor.userId,
          },
        },
      },
      include: TICKET_DETAIL_INCLUDE,
    });

    try {
      await dispatchTicketEmailWebhook(
        {
          event: "ticket.created",
          to: NOTIFY_EMAIL,
          ticketNumber: ticket.ticketNumber,
          applicantName: ticket.applicantName,
          organizationName: ticket.organizationName,
          applicantEmail: ticket.applicantEmail,
          whatsappNumber: ticket.whatsappNumber,
          departmentNames: uniqueDepartments,
          topic: data.topic,
          serviceDescription: data.serviceDescription,
        },
        resolveTicketEmailWebhookUrl(request.nextUrl.origin)
      );
    } catch (mailError) {
      console.error("Failed to dispatch new-ticket email webhook", mailError);
      return NextResponse.json<ApiResult>(
        {
          data: toLayananMasuk(ticket),
          success: `Tiket ${ticket.ticketNumber} tercatat, tetapi email notifikasi gagal dikirim.`,
        },
        { status: 201 }
      );
    }

    return NextResponse.json<ApiResult>(
      {
        data: toLayananMasuk(ticket),
        success: `Permohonan berhasil dikirim. Nomor tiket Anda ${ticket.ticketNumber}.`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof DepartmentNotFoundError) {
      return NextResponse.json<ApiResult>(
        { error: `Bidang/UPTB tidak ditemukan: ${error.missing.join(", ")}` },
        { status: 400 }
      );
    }
    throw error;
  }
}
