"use client";

import { useMemo, useState } from "react";
import PipelineHeader from "@/components/tracking-layanan/pipeline-header";
import StatusSummaryCards from "@/components/tracking-layanan/status-summary-cards";
import TrackingToolbar, {
  type TrackingViewMode,
} from "@/components/tracking-layanan/toolbar";
import KanbanBoard from "@/components/tracking-layanan/kanban/kanban-board";
import ListView from "@/components/tracking-layanan/list/list-view";
import { STATUS_ORDER } from "@/data/data-layanan";
import type { StatusLayanan } from "@/data/data-layanan";
import { useLayananStore } from "@/store/use-layanan-store";

export default function TrackingLayananView() {
  const tickets = useLayananStore((state) => state.tickets);
  const [view, setView] = useState<TrackingViewMode>("kanban");
  const [search, setSearch] = useState("");

  const totalCounts = useMemo(() => {
    const counts = STATUS_ORDER.reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<StatusLayanan, number>
    );

    tickets.forEach((ticket) => {
      counts[ticket.status] += 1;
    });

    return counts;
  }, [tickets]);

  const perluTindakLanjutCount = useMemo(
    () => tickets.filter((ticket) => ticket.perluTindakLanjut).length,
    [tickets]
  );

  // Single filtered dataset shared by both the Kanban board and the List
  // view, so switching views never changes what tickets are shown.
  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query.length === 0) return tickets;

    return tickets.filter(
      (ticket) =>
        ticket.noTiket.toLowerCase().includes(query) ||
        ticket.namaPemohon.toLowerCase().includes(query) ||
        ticket.asalInstansi.toLowerCase().includes(query)
    );
  }, [tickets, search]);

  return (
    <div className="flex flex-col gap-5 p-6">
      <PipelineHeader
        total={tickets.length}
        perluTindakLanjut={perluTindakLanjutCount}
      />

      <StatusSummaryCards counts={totalCounts} total={tickets.length} />

      <TrackingToolbar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        displayedCount={filteredTickets.length}
      />

      {view === "kanban" ? (
        <KanbanBoard tickets={filteredTickets} />
      ) : (
        <ListView tickets={filteredTickets} />
      )}
    </div>
  );
}
