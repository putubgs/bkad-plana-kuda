import KanbanColumn from "@/components/tracking-layanan/kanban/kanban-column";
import { STATUS_ORDER } from "@/data/data-layanan";
import type { LayananMasuk, StatusLayanan } from "@/data/data-layanan";

export default function KanbanBoard({
  tickets,
  statuses = STATUS_ORDER,
}: {
  tickets: LayananMasuk[];
  statuses?: StatusLayanan[];
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tickets={tickets.filter((ticket) => ticket.status === status)}
        />
      ))}
    </div>
  );
}
