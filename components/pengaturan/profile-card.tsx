"use client";

import { useState } from "react";
import UbahPasswordModal from "@/components/pengaturan/ubah-password-modal";

export default function ProfileCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-slate-900">Profil Pokja Plana Kuda</p>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
            PK
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">Pokja Plana Kuda</p>
            <p className="text-xs text-slate-500">Administrator BKAD Provinsi NTB</p>
            <p className="text-xs text-blue-600">planakuda@bkad.ntbprov.go.id</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Ubah Password
        </button>
      </div>

      {open ? <UbahPasswordModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
