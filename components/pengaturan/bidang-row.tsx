"use client";

import { useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ToggleSwitch from "@/components/pengaturan/toggle-switch";
import type { BidangAdmin } from "@/data/data-admin-bidang";

interface AdminFormValues {
  bidangNama: string;
  email: string;
  biografi: string;
}

function computeAverage(ratings: number[]) {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

export default function BidangRow({
  index,
  bidang,
  onToggleStatus,
  onUpdateAdmin,
  onDeleteAdmin,
  onOpenRatings,
}: {
  index: number;
  bidang: BidangAdmin;
  onToggleStatus: () => void;
  onUpdateAdmin: (values: AdminFormValues) => void;
  onDeleteAdmin: () => void;
  onOpenRatings: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [form, setForm] = useState<AdminFormValues>({
    bidangNama: bidang.bidangNama,
    email: bidang.email,
    biografi: bidang.biografi,
  });

  const isAktif = bidang.status === "Aktif";
  const avgRating = computeAverage(bidang.ratedTickets.map((item) => item.rating));

  function startEditing() {
    setForm({ bidangNama: bidang.bidangNama, email: bidang.email, biografi: bidang.biografi });
    setConfirmingDelete(false);
    setEditing(true);
  }

  function handleSave() {
    if (!form.bidangNama.trim() || !form.email.trim()) return;
    onUpdateAdmin(form);
    setEditing(false);
  }

  return (
    <div className="border-b border-slate-100 last:border-0">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-bold text-blue-600">
            {index}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{bidang.bidangNama}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-slate-500">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                Admin
              </span>
              <button
                type="button"
                onClick={onOpenRatings}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-amber-600 transition-colors hover:bg-amber-100"
              >
                <StarRoundedIcon sx={{ fontSize: 14 }} />
                {avgRating > 0 ? avgRating.toFixed(1) : "-"}
                <span className="text-amber-400">({bidang.ratedTickets.length})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`text-xs font-semibold whitespace-nowrap ${
              isAktif ? "text-emerald-600" : "text-slate-400"
            }`}
          >
            {bidang.status}
          </span>
          <ToggleSwitch
            checked={isAktif}
            onChange={onToggleStatus}
            ariaLabel={`Status admin ${bidang.bidangNama}`}
          />
          <button
            type="button"
            onClick={() => (editing ? setEditing(false) : startEditing())}
            aria-label={`Edit admin ${bidang.bidangNama}`}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              editing ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:bg-slate-100"
            }`}
          >
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400">
                NAMA BIDANG / UPTB
              </label>
              <input
                value={form.bidangNama}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, bidangNama: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400">
                EMAIL ADMIN
              </label>
              <input
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400">
                BIOGRAFI
              </label>
              <textarea
                rows={3}
                value={form.biografi}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, biografi: event.target.value }))
                }
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {confirmingDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-red-600">Hapus admin ini?</span>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteAdmin}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    Ya, Hapus
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                  Hapus Admin
                </button>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
