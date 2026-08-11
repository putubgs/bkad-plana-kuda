import type { LayananMasuk } from "@/data/data-layanan";

export type DurasiBarKategori = "cepat" | "normal" | "lambat" | "selesai";

export function parseDurasiHari(durasiLabel: string): number {
  const match = durasiLabel.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

/**
 * Categorizes a ticket for the duration bar chart. Finished tickets
 * (durasiVariant === "selesai") are always shown as "selesai" regardless
 * of how many days they took; unfinished tickets are bucketed by how
 * long they have been running.
 */
export function getDurasiBarKategori(ticket: LayananMasuk): DurasiBarKategori {
  if (ticket.durasiVariant === "selesai") return "selesai";

  const hari = parseDurasiHari(ticket.durasiLabel);
  if (hari <= 2) return "cepat";
  if (hari <= 6) return "normal";
  return "lambat";
}

export const DURASI_BAR_COLOR: Record<DurasiBarKategori, string> = {
  cepat: "bg-blue-500",
  normal: "bg-amber-500",
  lambat: "bg-red-500",
  selesai: "bg-emerald-500",
};

export const DURASI_BAR_LEGEND: { color: string; label: string }[] = [
  { color: "bg-blue-500", label: "\u22642 hari (cepat)" },
  { color: "bg-amber-500", label: "3-6 hari (normal)" },
  { color: "bg-red-500", label: "\u22657 hari (lambat)" },
  { color: "bg-emerald-500", label: "Selesai" },
];
