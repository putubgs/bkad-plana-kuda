import { create } from "zustand";
import {
  DATA_LAYANAN_MASUK,
  type CatatanProgres,
  type LayananMasuk,
  type StatusLayanan,
} from "@/data/data-layanan";

function cloneInitialTickets(): LayananMasuk[] {
  return DATA_LAYANAN_MASUK.map((ticket) => ({
    ...ticket,
    bidangUptb: [...ticket.bidangUptb],
    catatanProgres: ticket.catatanProgres.map((entry) => ({ ...entry })),
  }));
}

export interface NewCatatanProgresInput {
  status: StatusLayanan;
  catatan: string;
  estimasiSelesai?: string;
  keteranganProses?: string;
  tindakLanjutBerikutnya?: string;
  alasanPenolakan?: string;
  dokumenPendukung?: string[];
}

interface LayananStore {
  tickets: LayananMasuk[];
  openTicketId: string | null;
  openTicketDetail: (ticketId: string) => void;
  closeTicketDetail: () => void;
  addCatatanProgres: (ticketId: string, input: NewCatatanProgresInput) => void;
}

/**
 * In-memory only: state lives for the lifetime of the tab and is
 * re-seeded from the dummy dataset on every page load/refresh.
 */
export const useLayananStore = create<LayananStore>((set) => ({
  tickets: cloneInitialTickets(),
  openTicketId: null,

  openTicketDetail: (ticketId) => set({ openTicketId: ticketId }),
  closeTicketDetail: () => set({ openTicketId: null }),

  addCatatanProgres: (ticketId, input) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const entry: CatatanProgres = {
          id: `${ticketId}-${Date.now()}`,
          status: input.status,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          catatan: input.catatan,
          estimasiSelesai: input.estimasiSelesai,
          keteranganProses: input.keteranganProses,
          tindakLanjutBerikutnya: input.tindakLanjutBerikutnya,
          alasanPenolakan: input.alasanPenolakan,
          dokumenPendukung: input.dokumenPendukung,
          diinputOleh: "Pokja Plana Kuda",
        };

        return {
          ...ticket,
          status: input.status,
          catatanProgres: [...ticket.catatanProgres, entry],
        };
      }),
    })),
}));
