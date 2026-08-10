import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import type { DurasiVariant } from "@/data/data-layanan";

const SLA_TEXT: Record<DurasiVariant, string> = {
  selesai: "text-emerald-600",
  "berjalan-normal": "text-emerald-600",
  "hari-ini": "text-emerald-600",
  "berjalan-siaga": "text-amber-600",
  "berjalan-telat": "text-red-600",
};

const SLA_PILL: Record<DurasiVariant, string> = {
  selesai: "bg-emerald-50 border-emerald-200",
  "berjalan-normal": "bg-emerald-50 border-emerald-200",
  "hari-ini": "bg-emerald-50 border-emerald-200",
  "berjalan-siaga": "bg-amber-50 border-amber-200",
  "berjalan-telat": "bg-red-50 border-red-200",
};

export default function SlaBadge({
  label,
  variant,
  plain = false,
}: {
  label: string;
  variant: DurasiVariant;
  plain?: boolean;
}) {
  const Icon =
    variant === "selesai" ? CheckCircleOutlinedIcon : AccessTimeOutlinedIcon;

  if (plain) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${SLA_TEXT[variant]}`}
      >
        <Icon sx={{ fontSize: 14 }} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap ${SLA_TEXT[variant]} ${SLA_PILL[variant]}`}
    >
      <Icon sx={{ fontSize: 14 }} />
      {label}
    </span>
  );
}
