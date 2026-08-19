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
import { statusesForRole, isAdmin } from "@/lib/auth/roles";
import { useCurrentUser } from "@/components/auth/current-user-provider";
import { useLayananStore } from "@/store/use-layanan-store";

export default function TrackingLayananView() {
  const tickets = useLayananStore((state) => state.tickets);
  const { role, departmentName } = useCurrentUser();
  const visibleStatuses = statusesForRole(role);
  const [view, setView] = useState<TrackingViewMode>("kanban");
  const [search, setSearch] = useState("");

  const scopedTickets = useMemo(() => {
    if (!isAdmin(role)) return tickets;
    return tickets.filter(
      (ticket) =>
        ticket.status !== "Diterima" &&
        (!departmentName || ticket.bidangUptb.includes(departmentName))
    );
  }, [tickets, role, departmentName]);

  const totalCounts = useMemo(() => {
    const counts = STATUS_ORDER.reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<StatusLayanan, number>
    );

    scopedTickets.forEach((ticket) => {
      counts[ticket.status] += 1;
    });

    return counts;
  }, [scopedTickets]);

  const perluTindakLanjutCount = useMemo(
    () => scopedTickets.filter((ticket) => ticket.perluTindakLanjut).length,
    [scopedTickets]
  );

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query.length === 0) return scopedTickets;

    return scopedTickets.filter(
      (ticket) =>
        ticket.noTiket.toLowerCase().includes(query) ||
        ticket.namaPemohon.toLowerCase().includes(query) ||
        ticket.asalInstansi.toLowerCase().includes(query)
    );
  }, [scopedTickets, search]);

  return (
    <div className="flex flex-col gap-5 p-6">
      <PipelineHeader
        total={scopedTickets.length}
        perluTindakLanjut={perluTindakLanjutCount}
      />

      <StatusSummaryCards counts={totalCounts} total={scopedTickets.length} statuses={visibleStatuses} />

      <TrackingToolbar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        displayedCount={filteredTickets.length}
      />

      {view === "kanban" ? (
        <KanbanBoard tickets={filteredTickets} statuses={visibleStatuses} />
      ) : (
        <ListView tickets={filteredTickets} />
      )}
    </div>
  );
}
