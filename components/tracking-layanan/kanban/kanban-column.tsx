import KanbanCard from "@/components/tracking-layanan/kanban/kanban-card";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import type { LayananMasuk, StatusLayanan } from "@/data/data-layanan";

export default function KanbanColumn({
  status,
  tickets,
}: {
  status: StatusLayanan;
  tickets: LayananMasuk[];
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div
        className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 ${meta.softBorder} ${meta.softBg}`}
      >
        <span className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${meta.iconBg}`}
          >
            <Icon fontSize="small" />
          </span>
          <span className={`text-sm font-bold ${meta.text}`}>{status}</span>
        </span>
        <span
          className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white ${meta.iconBg}`}
        >
          {tickets.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tickets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
            Tidak ada tiket
          </div>
        ) : (
          tickets.map((ticket) => <KanbanCard key={ticket.id} ticket={ticket} />)
        )}
      </div>
    </div>
  );
}
