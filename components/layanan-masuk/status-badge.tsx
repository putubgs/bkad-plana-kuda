import type { StatusLayanan } from "@/data/data-layanan";

const STATUS_STYLES: Record<StatusLayanan, string> = {
  Diterima: "text-blue-600",
  Diverifikasi: "text-orange-600",
  Diproses: "text-indigo-600",
  Selesai: "text-emerald-600",
  Ditolak: "text-red-600",
};

const STATUS_DOT_STYLES: Record<StatusLayanan, string> = {
  Diterima: "bg-blue-600",
  Diverifikasi: "bg-orange-600",
  Diproses: "bg-indigo-600",
  Selesai: "bg-emerald-600",
  Ditolak: "bg-red-600",
};

export default function StatusBadge({ status }: { status: StatusLayanan }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_STYLES[status]}`} />
      {status}
    </span>
  );
}
