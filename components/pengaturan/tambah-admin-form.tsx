"use client";

import { useState } from "react";

export interface NewAdminInput {
  bidangNama: string;
  email: string;
  biografi: string;
}

export default function TambahAdminForm({
  onAdd,
  onCancel,
}: {
  onAdd: (values: NewAdminInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<NewAdminInput>({
    bidangNama: "",
    email: "",
    biografi: "",
  });

  function handleSubmit() {
    if (!form.bidangNama.trim() || !form.email.trim()) return;
    onAdd(form);
    setForm({ bidangNama: "", email: "", biografi: "" });
  }

  return (
    <div className="border-t border-slate-100 bg-blue-50/40 px-5 py-4">
      <p className="mb-3 text-sm font-bold text-slate-800">Tambah Admin Baru</p>
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-semibold tracking-wider text-slate-400">
            NAMA BIDANG / UPTB
          </label>
          <input
            value={form.bidangNama}
            onChange={(event) => setForm((prev) => ({ ...prev, bidangNama: event.target.value }))}
            placeholder="Contoh: Bidang Pendapatan Daerah"
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
            placeholder="admin.bidang@bkad.ntbprov.go.id"
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
            onChange={(event) => setForm((prev) => ({ ...prev, biografi: event.target.value }))}
            placeholder="Deskripsi singkat tugas dan tanggung jawab admin ini"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Simpan Admin
          </button>
        </div>
      </div>
    </div>
  );
}
