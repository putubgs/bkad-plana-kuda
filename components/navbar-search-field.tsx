"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import StatusBadge from "@/components/layanan-masuk/status-badge";
import { useLayananStore } from "@/store/use-layanan-store";
import type { LayananMasuk } from "@/data/data-layanan";

const SEARCH_DELAY_MS = 3000;

export default function NavbarSearchField() {
  const tickets = useLayananStore((state) => state.tickets);
  const openTicketDetail = useLayananStore((state) => state.openTicketDetail);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LayananMasuk[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setOpen(false);
      setLoading(false);
      setResults([]);
      return;
    }

    setOpen(true);
    setLoading(true);

    timerRef.current = setTimeout(() => {
      const lowered = trimmed.toLowerCase();
      const matches = tickets.filter(
        (ticket) =>
          ticket.noTiket.toLowerCase().includes(lowered) ||
          ticket.namaPemohon.toLowerCase().includes(lowered)
      );
      setResults(matches);
      setLoading(false);
    }, SEARCH_DELAY_MS);
  }

  function handleSelect(ticketId: string) {
    openTicketDetail(ticketId);
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <div ref={containerRef} className="relative w-64">
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition-colors focus-within:border-slate-300 focus-within:bg-white">
        <SearchOutlinedIcon fontSize="small" className="text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim().length > 0 && setOpen(true)}
          placeholder="Cari tiket, pemohon..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {open ? (
        <div className="absolute top-[calc(100%+10px)] left-0 z-30 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-slate-900">Hasil Pencarian</p>
          </div>

          <div className="max-h-96 overflow-y-auto py-1">
            {loading ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                <p className="text-xs text-slate-400">
                  Mencari &ldquo;{query.trim()}&rdquo;...
                </p>
              </div>
            ) : results.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400">
                Tidak ada hasil untuk &ldquo;{query.trim()}&rdquo;
              </p>
            ) : (
              results.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => handleSelect(ticket.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18 }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {ticket.noTiket}
                    </p>
                    <p className="truncate text-xs text-slate-400">{ticket.namaPemohon}</p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
