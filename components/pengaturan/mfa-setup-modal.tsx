"use client";

import { useEffect, useState, useTransition } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import MfaRecoveryCodesView from "@/components/pengaturan/mfa-recovery-codes-view";

export default function MfaSetupModal({
  onClose,
  onEnabled,
}: {
  onClose: () => void;
  onEnabled?: () => void;
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    postJson<ApiResult>("/api/v1/mfa/setup/start").then((result) => {
      if (!active) return;
      if (result.error) {
        setLoadError(result.error);
      } else {
        setQrCodeDataUrl(result.qrCodeDataUrl ?? null);
        setSecret(result.secret ?? null);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/mfa/setup/verify", {
        otp: formData.get("otp"),
      });
      setState(result);
      if (result.success) {
        onEnabled?.();
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-bold text-slate-900">Aktifkan MFA</p>
            <p className="text-xs text-slate-400">
              Amankan akun Anda dengan aplikasi autentikator
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {state?.success && state.recoveryCodes ? (
          <div className="flex flex-col gap-4 px-6 py-5">
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {state.success}
            </p>
            <MfaRecoveryCodesView codes={state.recoveryCodes} />
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#0F2044] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a335f]"
            >
              Saya Sudah Menyimpan Kode Ini
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-6 py-5">
            {loadError ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {loadError}
              </p>
            ) : qrCodeDataUrl ? (
              <div className="flex flex-col items-center gap-3">
                {/* Base64 data URL generated on demand - next/image optimization is not useful here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeDataUrl}
                  alt="Kode QR MFA"
                  className="h-40 w-40 rounded-lg border border-slate-100"
                />
                <p className="text-center text-xs text-slate-500">
                  Pindai kode QR ini menggunakan aplikasi autentikator (Google Authenticator,
                  Authy, dsb), atau masukkan kode manual berikut:
                </p>
                <code className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-mono tracking-wide text-slate-700">
                  {secret}
                </code>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">Memuat kode QR...</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {state?.error ? (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {state.error}
                </p>
              ) : null}

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-700">Kode OTP</span>
                <input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  placeholder="123456"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm font-semibold tracking-widest text-slate-800 outline-none focus:border-slate-300"
                />
              </label>

              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || !qrCodeDataUrl}
                  className="rounded-lg bg-[#0F2044] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1a335f] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
