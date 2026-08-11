import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { DATA_LAYANAN_MASUK, type StatusLayanan } from "@/data/data-layanan";

interface StatCardConfig {
  key: "total" | StatusLayanan;
  label: string;
  subtitle: string;
  icon: ComponentType<SvgIconProps>;
  iconClassName: string;
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: "total",
    label: "Total Layanan",
    subtitle: "Semua periode",
    icon: ArticleOutlinedIcon,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    key: "Diterima",
    label: "Diterima",
    subtitle: "Menunggu verifikasi",
    icon: MoveToInboxOutlinedIcon,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    key: "Diverifikasi",
    label: "Diverifikasi",
    subtitle: "Siap diproses",
    icon: TaskAltOutlinedIcon,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    key: "Diproses",
    label: "Diproses",
    subtitle: "Sedang berjalan",
    icon: AccessTimeOutlinedIcon,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "Selesai",
    label: "Selesai",
    subtitle: "Layanan tuntas",
    icon: CheckCircleOutlineOutlinedIcon,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "Ditolak",
    label: "Ditolak",
    subtitle: "Tidak memenuhi syarat",
    icon: HighlightOffOutlinedIcon,
    iconClassName: "bg-red-50 text-red-600",
  },
];

function countByStatus(status: StatusLayanan) {
  return DATA_LAYANAN_MASUK.filter((ticket) => ticket.status === status).length;
}

export default function StatsCards() {
  const counts: Record<StatCardConfig["key"], number> = {
    total: DATA_LAYANAN_MASUK.length,
    Diterima: countByStatus("Diterima"),
    Diverifikasi: countByStatus("Diverifikasi"),
    Diproses: countByStatus("Diproses"),
    Selesai: countByStatus("Selesai"),
    Ditolak: countByStatus("Ditolak"),
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STAT_CARDS.map(({ key, label, subtitle, icon: Icon, iconClassName }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
            >
              <Icon sx={{ fontSize: 16 }} />
            </span>
            <span className="text-xl font-bold text-slate-900">{counts[key]}</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-700">{label}</p>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
      ))}
    </div>
  );
}
