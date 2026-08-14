import {
  STATUS_ORDER,
  type CatatanProgres,
  type DurasiVariant,
  type LayananMasuk,
  type StatusLayanan,
} from "@/data/data-layanan";
import type { TicketDetailRecord } from "@/lib/tickets/queries";

const STATUS_SET = new Set<string>(STATUS_ORDER);

function asStatus(value: string): StatusLayanan {
  return STATUS_SET.has(value) ? (value as StatusLayanan) : "Diterima";
}

function calendarDaysBetween(from: Date, to: Date) {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function formatTglMasuk(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function durationFor(status: StatusLayanan, days: number): { durasiLabel: string; durasiVariant: DurasiVariant } {
  if (status === "Selesai" || status === "Ditolak") {
    return { durasiLabel: `Selesai ${days} hari`, durasiVariant: "selesai" };
  }
  if (days === 0) {
    return { durasiLabel: "Hari ini", durasiVariant: "hari-ini" };
  }
  if (days <= 2) {
    return { durasiLabel: `Berjalan ${days} hari`, durasiVariant: "berjalan-normal" };
  }
  if (days <= 6) {
    return { durasiLabel: `Berjalan ${days} hari`, durasiVariant: "berjalan-siaga" };
  }
  return { durasiLabel: `Berjalan ${days} hari`, durasiVariant: "berjalan-telat" };
}

export function toLayananMasuk(ticket: TicketDetailRecord): LayananMasuk {
  const catatanProgres: CatatanProgres[] = ticket.progresses.map((progress) => {
    const status = asStatus(progress.progressName);
    return {
      id: progress.progressId,
      status,
      timestamp: formatTimestamp(progress.dateAndTime),
      catatan: progress.progressNote,
      estimasiSelesai:
        progress.estimatedCompletion != null ? `${progress.estimatedCompletion} hari` : undefined,
      keteranganProses: progress.processDescription ?? undefined,
      tindakLanjutBerikutnya: progress.followUpFeedback ?? undefined,
      alasanPenolakan: status === "Ditolak" ? (progress.followUpFeedback ?? progress.processDescription ?? undefined) : undefined,
      dokumenPendukung: progress.documents.map((doc) => doc.fileName),
      diinputOleh: progress.updatedBy.departmentName ?? progress.updatedBy.username,
    };
  });

  const latestProgress = ticket.progresses.at(-1);
  const status = ticket.isCompleted
    ? "Selesai"
    : latestProgress
      ? asStatus(latestProgress.progressName)
      : "Diterima";

  const endDate =
    status === "Selesai" || status === "Ditolak"
      ? (latestProgress?.dateAndTime ?? ticket.updatedAt ?? ticket.createdAt)
      : new Date();
  const days = calendarDaysBetween(ticket.createdAt, endDate);
  const { durasiLabel, durasiVariant } = durationFor(status, days);

  return {
    id: ticket.ticketNumber,
    noTiket: ticket.ticketNumber,
    tglMasuk: formatTglMasuk(ticket.createdAt),
    durasiLabel,
    durasiVariant,
    perluTindakLanjut: status === "Diproses" && durasiVariant === "berjalan-telat",
    namaPemohon: ticket.applicantName,
    asalInstansi: ticket.organizationName,
    bidangUptb: ticket.departments.map((row) => row.departmentName),
    status,
    jenisLayanan: "",
    nip: ticket.identityNumber,
    jabatan: ticket.applicantOccupation,
    noWhatsapp: ticket.whatsappNumber,
    email: ticket.applicantEmail,
    uraianLayanan: ticket.serviceDescription,
    lampiranPemohon: [],
    catatanProgres,
  };
}
