import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FlowStep {
  title: string;
  description: string;
  icon: ComponentType<SvgIconProps>;
  iconClassName: string;
  borderClassName: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    title: "User Submit Form",
    description: "Pemohon isi & kirim form layanan online",
    icon: PersonOutlineOutlinedIcon,
    iconClassName: "bg-violet-50 text-violet-600",
    borderClassName: "border-slate-100",
  },
  {
    title: "Masuk Dashboard Admin",
    description: "Tiket tercatat & notifikasi tampil otomatis",
    icon: DashboardOutlinedIcon,
    iconClassName: "bg-blue-50 text-blue-600",
    borderClassName: "border-slate-100",
  },
  {
    title: "Email Konfirmasi ke User",
    description: "Email otomatis dikirim ke pemohon sebagai bukti",
    icon: SendOutlinedIcon,
    iconClassName: "bg-amber-50 text-amber-600",
    borderClassName: "border-amber-200",
  },
];

export default function NotificationFlow() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Alur Notifikasi Otomatis</h2>
          <p className="text-xs text-slate-400">
            Sistem notifikasi berjalan otomatis untuk setiap layanan masuk
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Aktif
        </span>
      </div>

      <div className="mt-4 flex flex-col items-stretch gap-2 lg:flex-row">
        {FLOW_STEPS.map((step, index) => (
          <div key={step.title} className="flex flex-1 items-stretch gap-2">
            <div
              className={`flex-1 rounded-xl border bg-white p-4 ${step.borderClassName}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${step.iconClassName}`}
              >
                <step.icon sx={{ fontSize: 16 }} />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-800">{step.title}</p>
              <p className="mt-0.5 text-xs text-slate-400">{step.description}</p>
            </div>

            {index < FLOW_STEPS.length - 1 ? (
              <div className="hidden shrink-0 items-center justify-center text-slate-300 lg:flex">
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
