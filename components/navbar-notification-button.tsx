"use client";

import { useEffect, useRef, useState } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NavbarNotificationDropdown, {
  NOTIFICATIONS,
  type NotificationItem,
} from "@/components/navbar-notification-dropdown";
import { useLayananStore } from "@/store/use-layanan-store";

export default function NavbarNotificationButton() {
  const openTicketDetail = useLayananStore((state) => state.openTicketDetail);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = NOTIFICATIONS.length - readIds.size;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleMarkAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((item) => item.id)));
  }

  function handleNotificationClick(notification: NotificationItem) {
    setReadIds((prev) => new Set(prev).add(notification.id));
    openTicketDetail(notification.ticketId);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifikasi"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
      >
        <NotificationsNoneOutlinedIcon fontSize="small" />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <NavbarNotificationDropdown
          readIds={readIds}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
        />
      ) : null}
    </div>
  );
}
