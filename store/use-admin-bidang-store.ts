import { create } from "zustand";
import { DATA_BIDANG_ADMIN, type BidangAdmin, type TicketRating } from "@/data/data-admin-bidang";
import { formatTanggalRingkas } from "@/lib/format-tanggal";

function cloneInitialBidangList(): BidangAdmin[] {
  return DATA_BIDANG_ADMIN.map((bidang) => ({
    ...bidang,
    ratedTickets: bidang.ratedTickets.map((entry) => ({ ...entry })),
  }));
}

export interface AdminFormValues {
  bidangNama: string;
  email: string;
  biografi: string;
}

export interface NewTicketRatingInput {
  noTiket: string;
  namaPemohon: string;
  rating: number;
  komentar?: string;
}

interface AdminBidangStore {
  bidangList: BidangAdmin[];
  toggleStatus: (id: string) => void;
  updateAdmin: (id: string, values: AdminFormValues) => void;
  deleteAdmin: (id: string) => void;
  addAdmin: (values: AdminFormValues) => void;
  addRatingForBidangNames: (bidangNamaList: string[], input: NewTicketRatingInput) => void;
  isTicketRated: (noTiket: string) => boolean;
}

/**
 * In-memory only: state lives for the lifetime of the tab and is
 * re-seeded from the dummy dataset on every page load/refresh.
 */
export const useAdminBidangStore = create<AdminBidangStore>((set, get) => ({
  bidangList: cloneInitialBidangList(),

  toggleStatus: (id) =>
    set((state) => ({
      bidangList: state.bidangList.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Aktif" ? "Nonaktif" : "Aktif" }
          : item
      ),
    })),

  updateAdmin: (id, values) =>
    set((state) => ({
      bidangList: state.bidangList.map((item) =>
        item.id === id ? { ...item, ...values } : item
      ),
    })),

  deleteAdmin: (id) =>
    set((state) => ({
      bidangList: state.bidangList.filter((item) => item.id !== id),
    })),

  addAdmin: (values) =>
    set((state) => ({
      bidangList: [
        ...state.bidangList,
        {
          id: `bidang-${Date.now()}`,
          bidangNama: values.bidangNama,
          email: values.email,
          biografi: values.biografi,
          status: "Aktif",
          ratedTickets: [],
        },
      ],
    })),

  addRatingForBidangNames: (bidangNamaList, input) =>
    set((state) => ({
      bidangList: state.bidangList.map((item) => {
        if (!bidangNamaList.includes(item.bidangNama)) return item;

        const entry: TicketRating = {
          id: `${item.id}-user-${Date.now()}`,
          noTiket: input.noTiket,
          namaPemohon: input.namaPemohon,
          rating: input.rating,
          komentar: input.komentar,
          tanggal: formatTanggalRingkas(),
        };

        return { ...item, ratedTickets: [...item.ratedTickets, entry] };
      }),
    })),

  isTicketRated: (noTiket) =>
    get().bidangList.some((item) =>
      item.ratedTickets.some((entry) => entry.noTiket === noTiket)
    ),
}));
