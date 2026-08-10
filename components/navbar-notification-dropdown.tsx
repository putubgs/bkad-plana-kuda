import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export interface NotificationItem {
  id: string;
  ticketId: string;
  icon: typeof MailOutlineOutlinedIcon;
  iconBg: string;
  iconColor: string;
  message: string;
  time: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    ticketId: "6",
    icon: MailOutlineOutlinedIcon,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    message: "Tiket baru masuk: PK-2026-006",
    time: "5 mnt lalu",
  },
  {
    id: "n2",
    ticketId: "3",
    icon: TaskAltOutlinedIcon,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    message: "Tiket PK-2026-003 telah diverifikasi",
    time: "2 jam lalu",
  },
  {
    id: "n3",
    ticketId: "2",
    icon: AutorenewOutlinedIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    message: "Tiket PK-2026-002 sedang diproses",
    time: "3 jam lalu",
  },
  {
    id: "n4",
    ticketId: "2",
    icon: WarningAmberOutlinedIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    message: "Tiket PK-2026-002 perlu tindak lanjut",
    time: "3 jam lalu",
  },
  {
    id: "n5",
    ticketId: "1",
    icon: CheckCircleOutlinedIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    message: "Tiket PK-2026-001 diselesaikan",
    time: "1 hr lalu",
  },
  {
    id: "n6",
    ticketId: "5",
    icon: CancelOutlinedIcon,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    message: "Tiket PK-2026-005 ditolak",
    time: "7 hr lalu",
  },
];

export default function NavbarNotificationDropdown({
  readIds,
  onMarkAllRead,
  onNotificationClick,
}: {
  readIds: Set<string>;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
}) {
  return (
    <div className="absolute top-[calc(100%+10px)] right-0 z-30 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900">Notifikasi</p>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Tandai semua dibaca
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto py-1">
        {NOTIFICATIONS.map((item) => {
          const Icon = item.icon;
          const isRead = readIds.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNotificationClick(item)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                isRead ? "bg-white" : "bg-blue-50/40"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
              >
                <Icon sx={{ fontSize: 18 }} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${isRead ? "font-medium text-slate-500" : "font-semibold text-slate-800"}`}
                >
                  {item.message}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
              </div>
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isRead ? "bg-transparent" : "bg-blue-600"}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
