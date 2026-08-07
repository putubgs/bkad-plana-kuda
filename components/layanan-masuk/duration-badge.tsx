import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import type { DurasiVariant } from "@/data/data-layanan";

const DURATION_STYLES: Record<DurasiVariant, string> = {
  selesai: "bg-emerald-50 text-emerald-600 border-emerald-200",
  "berjalan-normal": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "hari-ini": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "berjalan-siaga": "bg-amber-50 text-amber-600 border-amber-200",
  "berjalan-telat": "bg-red-50 text-red-600 border-red-200",
};

export default function DurationBadge({
  label,
  variant,
}: {
  label: string;
  variant: DurasiVariant;
}) {
  const Icon =
    variant === "selesai" ? CheckCircleOutlinedIcon : AccessTimeOutlinedIcon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap ${DURATION_STYLES[variant]}`}
    >
      <Icon sx={{ fontSize: 14 }} />
      {label}
    </span>
  );
}
