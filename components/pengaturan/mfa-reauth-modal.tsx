"use client";

import { useState, useTransition } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import MfaRecoveryCodesView from "@/components/pengaturan/mfa-recovery-codes-view";

interface MfaReauthModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  endpoint: string;
  onClose: () => void;
  onSuccess?: () => void;
  danger?: boolean;
}

export default function MfaReauthModal({
  title,
  description,
  confirmLabel,
  endpoint,
  onClose,
  onSuccess,
  danger,
}: MfaReauthModalProps) {
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>(endpoint, {
        currentPassword: formData.get("currentPassword"),
      });
      setState(result);
      if (result.success) {
        onSuccess?.();
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
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-400">{description}</p>
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

        {state?.success ? (
          <div className="flex flex-col gap-4 px-6 py-5">
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {state.success}
            </p>
            {state.recoveryCodes ? <MfaRecoveryCodesView codes={state.recoveryCodes} /> : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-[#0F2044] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a335f]"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
            {state?.error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {state.error}
              </p>
            ) : null}

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-700">Password Saat Ini</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-slate-300">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                  )}
                </button>
              </div>
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
                disabled={isPending}
                className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                  danger ? "bg-red-600 hover:bg-red-700" : "bg-[#0F2044] hover:bg-[#1a335f]"
                }`}
              >
                {isPending ? "Memproses..." : confirmLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}