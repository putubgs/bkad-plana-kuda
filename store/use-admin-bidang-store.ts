import { create } from "zustand";
import { deleteJson, getJson, patchJson, postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import { formatTanggalRingkas } from "@/lib/format-tanggal";
import { DATA_BIDANG_ADMIN, type BidangAdmin, type TicketRating } from "@/data/data-admin-bidang";

interface AdminUserPayload {
  userId: string;
  username: string;
  email: string;
  departmentName: string | null;
  biography: string | null;
  isActive: boolean | null;
}

export interface AdminFormValues {
  bidangNama: string;
  email: string;
  biografi: string;
  password?: string;
}

export interface NewTicketRatingInput {
  noTiket: string;
  namaPemohon: string;
  rating: number;
  komentar?: string;
}

function cloneInitialBidangList(): BidangAdmin[] {
  return DATA_BIDANG_ADMIN.map((bidang) => ({
    ...bidang,
    ratedTickets: bidang.ratedTickets.map((entry) => ({ ...entry })),
  }));
}

function toBidangAdmin(user: AdminUserPayload, ratedTickets: TicketRating[] = []): BidangAdmin {
  return {
    id: user.userId,
    bidangNama: user.departmentName ?? user.username,
    status: user.isActive ? "Aktif" : "Nonaktif",
    email: user.email,
    biografi: user.biography ?? "",
    ratedTickets,
  };
}

function usernameFromEmail(email: string, bidangNama: string) {
  const fromEmail = email.split("@")[0]?.replace(/[^a-zA-Z0-9._-]/g, "") ?? "";
  if (fromEmail.length >= 3) return fromEmail;
  return bidangNama.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || "admin";
}

interface AdminBidangStore {
  bidangList: BidangAdmin[];
  loading: boolean;
  error: string | null;
  fetchAdmins: () => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  updateAdmin: (id: string, values: AdminFormValues) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  addAdmin: (values: AdminFormValues) => Promise<string | null>;
  addRatingForBidangNames: (bidangNamaList: string[], input: NewTicketRatingInput) => void;
  isTicketRated: (noTiket: string) => boolean;
}

export const useAdminBidangStore = create<AdminBidangStore>((set, get) => ({
  bidangList: cloneInitialBidangList(),
  loading: false,
  error: null,

  fetchAdmins: async () => {
    set({ loading: true, error: null });
    try {
      const result = await getJson<ApiResult>("/api/v1/users?role=admin&pageSize=100");
      if (result.error) {
        set({ loading: false, error: result.error });
        return;
      }

      const ratingsById = new Map(get().bidangList.map((item) => [item.id, item.ratedTickets]));
      const users = (result.data as AdminUserPayload[] | undefined) ?? [];
      set({
        loading: false,
        error: null,
        bidangList: users
          .filter((user) => Boolean(user.departmentName))
          .map((user) => toBidangAdmin(user, ratingsById.get(user.userId) ?? [])),
      });
    } catch {
      set({ loading: false, error: "Tidak dapat memuat data admin bidang." });
    }
  },

  toggleStatus: async (id) => {
    const current = get().bidangList.find((item) => item.id === id);
    if (!current) return;

    const nextActive = current.status !== "Aktif";
    const result = await patchJson<ApiResult>(`/api/v1/users/${id}`, { isActive: nextActive });
    if (result.error) {
      set({ error: result.error });
      return;
    }
    set((state) => ({
      error: null,
      bidangList: state.bidangList.map((item) =>
        item.id === id ? { ...item, status: nextActive ? "Aktif" : "Nonaktif" } : item
      ),
    }));
  },

  updateAdmin: async (id, values) => {
    const result = await patchJson<ApiResult>(`/api/v1/users/${id}`, {
      email: values.email,
      departmentName: values.bidangNama,
      biography: values.biografi || null,
    });
    if (result.error) {
      set({ error: result.error });
      return;
    }
    const user = result.data as AdminUserPayload;
    set((state) => ({
      error: null,
      bidangList: state.bidangList.map((item) =>
        item.id === id ? toBidangAdmin(user, item.ratedTickets) : item
      ),
    }));
  },

  deleteAdmin: async (id) => {
    const result = await deleteJson<ApiResult>(`/api/v1/users/${id}`);
    if (result.error) {
      set({ error: result.error });
      return;
    }
    set((state) => ({
      error: null,
      bidangList: state.bidangList.filter((item) => item.id !== id),
    }));
  },

  addAdmin: async (values) => {
    const password = values.password?.trim();
    if (!password) {
      set({ error: "Password admin wajib diisi." });
      return "Password admin wajib diisi.";
    }

    const result = await postJson<ApiResult>("/api/v1/users", {
      username: usernameFromEmail(values.email, values.bidangNama),
      email: values.email,
      password,
      role: "admin",
      departmentName: values.bidangNama,
      biography: values.biografi || null,
      isActive: true,
    });

    if (result.error) {
      set({ error: result.error });
      return result.error;
    }

    const user = result.data as AdminUserPayload;
    set((state) => ({
      error: null,
      bidangList: [...state.bidangList, toBidangAdmin(user)],
    }));
    return null;
  },

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
    get().bidangList.some((item) => item.ratedTickets.some((entry) => entry.noTiket === noTiket)),
}));
