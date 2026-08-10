import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import type { LayananMasuk, StatusLayanan } from "@/data/data-layanan";

interface EmailNotification {
  id: string;
  message: string;
  timestamp: string;
}

function shiftTimestamp(timestamp: string, minutes: number) {
  const date = new Date(timestamp.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return timestamp;
  date.setMinutes(date.getMinutes() + minutes);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function messageForStatus(
  status: StatusLayanan,
  bidangUptb: string[],
  namaPemohon: string
): string {
  const bidangList =
    bidangUptb.length <= 1
      ? bidangUptb[0] ?? "bidang terkait"
      : `${bidangUptb.slice(0, -1).join(", ")} serta ${bidangUptb[bidangUptb.length - 1]}`;

  switch (status) {
    case "Diterima":
      return "Konfirmasi penerimaan dikirim ke pemohon.";
    case "Diverifikasi":
      return `Notifikasi verifikasi dikirim ke admin ${bidangList}.`;
    case "Diproses":
      return `Notifikasi proses layanan dikirim ke admin ${bidangList}.`;
    case "Selesai":
      return `Konfirmasi penyelesaian dikirim ke pemohon dan admin ${bidangList}.`;
    case "Ditolak":
      return `Notifikasi penolakan dikirim ke pemohon (${namaPemohon}).`;
    default:
      return "Notifikasi status dikirim ke admin terkait.";
  }
}

function buildEmailNotifications(ticket: LayananMasuk): EmailNotification[] {
  return [...ticket.catatanProgres]
    .map((entry) => ({
      id: `${entry.id}-email`,
      message: messageForStatus(entry.status, ticket.bidangUptb, ticket.namaPemohon),
      timestamp: shiftTimestamp(entry.timestamp, 1),
    }))
    .reverse();
}

export default function LogNotifikasiTab({ ticket }: { ticket: LayananMasuk }) {
  const notifications = buildEmailNotifications(ticket);

  if (notifications.length === 0) {
    return (
      <p className="rounded-xl border border-slate-100 bg-white px-4 py-10 text-center text-sm text-slate-400">
        Belum ada log notifikasi email untuk layanan ini.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <EmailOutlinedIcon sx={{ fontSize: 18 }} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-wider text-blue-600">EMAIL SISTEM</p>
            <p className="mt-0.5 text-sm text-slate-700">{item.message}</p>
            <p className="mt-1 text-xs text-slate-400">{item.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
