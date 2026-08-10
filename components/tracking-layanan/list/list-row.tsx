"use client";

import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SlaBadge from "@/components/tracking-layanan/sla-badge";
import BidangTags from "@/components/tracking-layanan/bidang-tags";
import InstansiLabel from "@/components/tracking-layanan/instansi-label";
import TicketStatusPill from "@/components/tracking-layanan/ticket-status-pill";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import ListStepper from "@/components/tracking-layanan/list/list-stepper";
import type { LayananMasuk } from "@/data/data-layanan";
import { useLayananStore } from "@/store/use-layanan-store";

export default function ListRow({ ticket }: { ticket: LayananMasuk }) {
  const openTicketDetail = useLayananStore((state) => state.openTicketDetail);
  const borderLeft = STATUS_META[ticket.status].borderLeft;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openTicketDetail(ticket.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openTicketDetail(ticket.id);
      }}
      className={`flex cursor-pointer flex-wrap items-center gap-4 border-b border-l-4 border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50/60 ${borderLeft}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-blue-600">{ticket.noTiket}</span>
          <TicketStatusPill status={ticket.status} />
          {ticket.perluTindakLanjut ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              <WarningAmberOutlinedIcon sx={{ fontSize: 12 }} />
              Perlu Tindak Lanjut
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm font-semibold text-slate-900">{ticket.namaPemohon}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <InstansiLabel label={ticket.asalInstansi} />
          <BidangTags items={ticket.bidangUptb} inline />
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <ListStepper status={ticket.status} />

        <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-500">
          <SlaBadge label={ticket.durasiLabel} variant={ticket.durasiVariant} plain />
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-400" />
            {ticket.tglMasuk}
          </span>
        </div>
      </div>

      <ChevronRightOutlinedIcon fontSize="small" className="shrink-0 text-slate-300" />
    </div>
  );
}
