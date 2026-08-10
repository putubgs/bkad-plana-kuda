"use client";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SlaBadge from "@/components/tracking-layanan/sla-badge";
import BidangTags from "@/components/tracking-layanan/bidang-tags";
import InstansiLabel from "@/components/tracking-layanan/instansi-label";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import type { LayananMasuk } from "@/data/data-layanan";
import { useLayananStore } from "@/store/use-layanan-store";

export default function KanbanCard({ ticket }: { ticket: LayananMasuk }) {
  const openTicketDetail = useLayananStore((state) => state.openTicketDetail);
  const topBorder = STATUS_META[ticket.status].topBorder;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openTicketDetail(ticket.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openTicketDetail(ticket.id);
      }}
      className={`cursor-pointer rounded-2xl border border-t-2 border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${topBorder}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-blue-600">{ticket.noTiket}</span>
        {ticket.perluTindakLanjut ? (
          <WarningAmberOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-500" />
        ) : null}
      </div>

      <p className="mt-1.5 text-sm font-semibold text-slate-900">{ticket.namaPemohon}</p>

      <div className="mt-2">
        <InstansiLabel label={ticket.asalInstansi} />
      </div>

      <div className="mt-2">
        <BidangTags items={ticket.bidangUptb} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <SlaBadge label={ticket.durasiLabel} variant={ticket.durasiVariant} />
        <span className="inline-flex items-center gap-0.5 text-xs whitespace-nowrap text-slate-400">
          <CalendarTodayOutlinedIcon sx={{ fontSize: 13 }} />
          {ticket.tglMasuk}
        </span>
      </div>
    </div>
  );
}
