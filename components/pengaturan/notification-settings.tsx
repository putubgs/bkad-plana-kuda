"use client";

import { useState } from "react";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ToggleSwitch from "@/components/pengaturan/toggle-switch";

interface NotificationChannel {
  id: "whatsapp" | "email";
  icon: typeof PhoneIphoneOutlinedIcon;
  label: string;
  description: string;
}

const CHANNELS: NotificationChannel[] = [
  {
    id: "whatsapp",
    icon: PhoneIphoneOutlinedIcon,
    label: "Bot WhatsApp",
    description: "Notifikasi ke admin via WhatsApp Bot saat tiket baru masuk.",
  },
  {
    id: "email",
    icon: EmailOutlinedIcon,
    label: "Email Otomatis ke Pemohon",
    description: "Kirim email konfirmasi setiap kali status tiket berubah.",
  },
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<NotificationChannel["id"], boolean>>({
    whatsapp: true,
    email: true,
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-900">Pengaturan Notifikasi</p>
      <p className="mb-4 text-xs text-slate-400">Kelola saluran notifikasi otomatis sistem</p>

      <div className="flex flex-col divide-y divide-slate-100">
        {CHANNELS.map((channel) => {
          const Icon = channel.icon;

          return (
            <div key={channel.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Icon sx={{ fontSize: 18 }} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{channel.label}</p>
                  <p className="text-xs text-slate-400">{channel.description}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={enabled[channel.id]}
                onChange={() =>
                  setEnabled((prev) => ({ ...prev, [channel.id]: !prev[channel.id] }))
                }
                ariaLabel={channel.label}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
