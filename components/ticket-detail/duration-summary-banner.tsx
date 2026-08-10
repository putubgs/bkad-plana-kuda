import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import type { DurasiVariant, LayananMasuk } from "@/data/data-layanan";
import { formatTanggalLengkap } from "@/lib/format-tanggal";

const BANNER_STYLES: Record<
  DurasiVariant,
  {
    container: string;
    iconBg: string;
    headline: string;
    subtitle: string;
    bigNumber: string;
    bigUnit: string;
  }
> = {
  selesai: {
    container: "border-emerald-100 bg-emerald-50",
    iconBg: "bg-emerald-100 text-emerald-600",
    headline: "text-emerald-800",
    subtitle: "text-emerald-600",
    bigNumber: "text-emerald-600",
    bigUnit: "text-emerald-400",
  },
  "berjalan-normal": {
    container: "border-emerald-100 bg-emerald-50",
    iconBg: "bg-emerald-100 text-emerald-600",
    headline: "text-emerald-800",
    subtitle: "text-emerald-600",
    bigNumber: "text-emerald-600",
    bigUnit: "text-emerald-400",
  },
  "hari-ini": {
    container: "border-emerald-100 bg-emerald-50",
    iconBg: "bg-emerald-100 text-emerald-600",
    headline: "text-emerald-800",
    subtitle: "text-emerald-600",
    bigNumber: "text-emerald-600",
    bigUnit: "text-emerald-400",
  },
  "berjalan-siaga": {
    container: "border-amber-100 bg-amber-50",
    iconBg: "bg-amber-100 text-amber-600",
    headline: "text-amber-800",
    subtitle: "text-amber-600",
    bigNumber: "text-amber-500",
    bigUnit: "text-amber-400",
  },
  "berjalan-telat": {
    container: "border-red-100 bg-red-50",
    iconBg: "bg-red-100 text-red-600",
    headline: "text-red-800",
    subtitle: "text-red-600",
    bigNumber: "text-red-500",
    bigUnit: "text-red-300",
  },
};

function extractDayCount(label: string): number | null {
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export default function DurationSummaryBanner({ ticket }: { ticket: LayananMasuk }) {
  const style = BANNER_STYLES[ticket.durasiVariant];
  const days = extractDayCount(ticket.durasiLabel);

  const masukEntry = ticket.catatanProgres[0];
  const selesaiEntry =
    ticket.status === "Selesai"
      ? ticket.catatanProgres[ticket.catatanProgres.length - 1]
      : null;

  const headline =
    ticket.durasiVariant === "hari-ini"
      ? "Diterima hari ini"
      : ticket.status === "Selesai"
        ? `Diselesaikan dalam ${days} hari`
        : `Berjalan selama ${days} hari`;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 ${style.container}`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
          <TrendingUpOutlinedIcon fontSize="small" />
        </span>
        <div>
          <p className={`text-sm font-bold ${style.headline}`}>{headline}</p>
          <p className={`mt-0.5 text-xs ${style.subtitle}`}>
            Masuk: {masukEntry ? formatTanggalLengkap(masukEntry.timestamp) : ticket.tglMasuk}
            {selesaiEntry ? ` · Selesai: ${selesaiEntry.timestamp}` : ""}
          </p>
        </div>
      </div>

      {days !== null ? (
        <p className="shrink-0 text-right leading-none">
          <span className={`text-3xl font-extrabold ${style.bigNumber}`}>{days}</span>{" "}
          <span className={`text-sm font-semibold ${style.bigUnit}`}>hari</span>
        </p>
      ) : (
        <p className={`shrink-0 text-lg font-extrabold ${style.bigNumber}`}>{ticket.durasiLabel}</p>
      )}
    </div>
  );
}
