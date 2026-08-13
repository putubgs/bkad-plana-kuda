"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import MfaSetupModal from "@/components/pengaturan/mfa-setup-modal";
import MfaReauthModal from "@/components/pengaturan/mfa-reauth-modal";

type ModalKind = "setup" | "disable" | "regenerate" | null;

export default function MfaSettingsCard({ mfaEnabled: initialMfaEnabled }: { mfaEnabled: boolean }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalKind>(null);
  const [mfaEnabled, setMfaEnabled] = useState(initialMfaEnabled);

  function handleSettingsChanged(nextEnabled: boolean) {
    setMfaEnabled(nextEnabled);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              mfaEnabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            }`}
          >
            <ShieldOutlinedIcon fontSize="small" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Autentikasi Dua Langkah (MFA)</p>
            <p className="text-xs text-slate-400">
              {mfaEnabled
                ? "MFA aktif. Login memerlukan kode dari aplikasi autentikator."
                : "Tambahkan lapisan keamanan ekstra menggunakan aplikasi autentikator."}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            mfaEnabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {mfaEnabled ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mfaEnabled ? (
          <>
            <button
              type="button"
              onClick={() => setModal("regenerate")}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Buat Ulang Kode Pemulihan
            </button>
            <button
              type="button"
              onClick={() => setModal("disable")}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Nonaktifkan MFA
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setModal("setup")}
            className="rounded-lg bg-[#0F2044] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1a335f]"
          >
            Aktifkan MFA
          </button>
        )}
      </div>

      {modal === "setup" ? (
        <MfaSetupModal onClose={() => setModal(null)} onEnabled={() => handleSettingsChanged(true)} />
      ) : null}
      {modal === "disable" ? (
        <MfaReauthModal
          title="Nonaktifkan MFA"
          description="Masukkan password Anda untuk menonaktifkan autentikasi dua langkah."
          confirmLabel="Nonaktifkan"
          endpoint="/api/v1/mfa/disable"
          onClose={() => setModal(null)}
          onSuccess={() => handleSettingsChanged(false)}
          danger
        />
      ) : null}
      {modal === "regenerate" ? (
        <MfaReauthModal
          title="Buat Ulang Kode Pemulihan"
          description="Kode pemulihan lama tidak akan berlaku lagi. Masukkan password Anda untuk melanjutkan."
          confirmLabel="Buat Kode Baru"
          endpoint="/api/v1/mfa/recovery-codes/regenerate"
          onClose={() => setModal(null)}
        />
      ) : null}
    </div>
  );
}
