"use client";

import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import StatusBadge from "@/components/layanan-masuk/status-badge";
import StatusFlow from "@/components/ticket-detail/status-flow";
import CatatanTimeline from "@/components/ticket-detail/catatan-timeline";
import TambahCatatanForm from "@/components/ticket-detail/tambah-catatan-form";
import GenerateRatingLink from "@/components/ticket-detail/generate-rating-link";
import InfoLayananTab from "@/components/ticket-detail/info-layanan-tab";
import LogNotifikasiTab from "@/components/ticket-detail/log-notifikasi-tab";
import { useLayananStore } from "@/store/use-layanan-store";
import type { DurasiVariant } from "@/data/data-layanan";

type TabId = "info" | "catatan" | "notifikasi";

const TABS: { id: TabId; label: string; icon: typeof InfoOutlinedIcon }[] = [
  { id: "info", label: "Info Layanan", icon: InfoOutlinedIcon },
  { id: "catatan", label: "Catatan Progres", icon: ChecklistOutlinedIcon },
  {
    id: "notifikasi",
    label: "Log Notifikasi",
    icon: NotificationsNoneOutlinedIcon,
  },
];

const TABS2: { id: TabId; label: string }[] = [
  { id: "info", label: "Info Layanan" },
  { id: "catatan", label: "Catatan Progres" },
  { id: "notifikasi", label: "Log Notifikasi" },
];

const DURATION_BADGE_STYLES: Record<DurasiVariant, string> = {
  selesai: "border-emerald-200 bg-emerald-50 text-emerald-600",
  "berjalan-normal": "border-emerald-200 bg-emerald-50 text-emerald-600",
  "hari-ini": "border-emerald-200 bg-emerald-50 text-emerald-600",
  "berjalan-siaga": "border-amber-200 bg-amber-50 text-amber-600",
  "berjalan-telat": "border-red-200 bg-red-50 text-red-600",
};

// "Selesai 2 hari" -> "Selesai dalam 2 hari" (keeps labels like "Hari ini" untouched)
function toDurasiSentence(label: string) {
  const match = label.match(/^(\S+)\s+(\d+)\s+hari$/i);
  return match ? `${match[1]} dalam ${match[2]} hari` : label;
}

export default function TicketDetailModal() {
  const openTicketId = useLayananStore((state) => state.openTicketId);
  const closeTicketDetail = useLayananStore((state) => state.closeTicketDetail);
  const tickets = useLayananStore((state) => state.tickets);

  const ticket = tickets.find((item) => item.id === openTicketId) ?? null;

  const [activeTab, setActiveTab] = useState<TabId>("catatan");
  const [visible, setVisible] = useState(false);

  // Reset to the "Catatan Progres" tab whenever a different ticket is
  // opened. Adjusted during render (rather than in an effect) since it's
  // derived from a prop-like change, not a sync with an external system.
  const [lastOpenedId, setLastOpenedId] = useState(openTicketId);
  if (openTicketId !== lastOpenedId) {
    setLastOpenedId(openTicketId);
    if (openTicketId) setActiveTab("catatan");
  }

  useEffect(() => {
    if (!openTicketId) return;

    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [openTicketId]);

  useEffect(() => {
    if (!openTicketId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTicketDetail();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [openTicketId, closeTicketDetail]);

  if (!ticket) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={closeTicketDetail}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-blue-600">
                {ticket.noTiket}
              </span>
              <StatusBadge status={ticket.status} />
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap ${DURATION_BADGE_STYLES[ticket.durasiVariant]}`}
              >
                <TimerOutlinedIcon sx={{ fontSize: 14 }} />
                {ticket.durasiLabel}
              </span>
              {ticket.perluTindakLanjut ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                  <WarningAmberOutlinedIcon sx={{ fontSize: 12 }} />
                  Perlu Tindak Lanjut
                </span>
              ) : null}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {ticket.namaPemohon}
              </span>
              <span className="text-slate-300">·</span>
              {toDurasiSentence(ticket.durasiLabel)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeTicketDetail}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="flex items-center gap-6 border-b border-slate-100 bg-slate-50 px-6">
          {TABS2.map((tab) => {
            // const Icon = tab.icon;
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-1.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {/* <Icon fontSize="small" /> */}
                {tab.label}
                {tab.id === "catatan" ? (
                  <span
                    className={`flex items-center justify-center rounded-full text-[11px] font-bold py-0.5 px-1.5 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {ticket.catatanProgres.length}
                  </span>
                ) : null}
                {isActive ? (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/60 px-6 py-5">
          {activeTab === "info" ? <InfoLayananTab ticket={ticket} /> : null}
          {activeTab === "catatan" ? (
            <div className="flex flex-col gap-4">
              <StatusFlow status={ticket.status} />
              <CatatanTimeline entries={ticket.catatanProgres} />
              {ticket.status === "Selesai" ? (
                <GenerateRatingLink ticketNumber={ticket.noTiket} />
              ) : null}
              <TambahCatatanForm
                ticketId={ticket.id}
                currentStatus={ticket.status}
              />
            </div>
          ) : null}
          {activeTab === "notifikasi" ? (
            <LogNotifikasiTab ticket={ticket} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
