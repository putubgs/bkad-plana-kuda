"use client";

import { useEffect } from "react";
import { useLayananStore } from "@/store/use-layanan-store";

export default function TicketsBootstrap() {
  const fetchTickets = useLayananStore((state) => state.fetchTickets);

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets]);

  return null;
}
