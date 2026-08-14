import { create } from "zustand";
import { getJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import type { CatatanProgres, LayananMasuk, StatusLayanan } from "@/data/data-layanan";

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
  loading: boolean;
  error: string | null;
  openTicketId: string | null;
  fetchTickets: () => Promise<void>;
  openTicketDetail: (ticketId: string) => void;
  closeTicketDetail: () => void;
  addCatatanProgres: (ticketId: string, input: NewCatatanProgresInput) => void;
}

export const useLayananStore = create<LayananStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,
  openTicketId: null,

  fetchTickets: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      const result = await getJson<ApiResult>("/api/v1/tickets?pageSize=100");
      if (result.error) {
        set({ loading: false, error: result.error });
        return;
      }

      set({
        tickets: Array.isArray(result.data) ? (result.data as LayananMasuk[]) : [],
        loading: false,
        error: null,
      });
    } catch {
      set({ loading: false, error: "Gagal memuat daftar layanan." });
    }
  },

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
