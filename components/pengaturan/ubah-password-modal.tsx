"use client";

import { useState, useTransition } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

export default function UbahPasswordModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [showLama, setShowLama] = useState(false);
  const [showBaru, setShowBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/change-password", {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      });
      setState(result);
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
            <p className="text-sm font-bold text-slate-900">Ubah Password</p>
            <p className="text-xs text-slate-400">
              Perbarui password akun administrator Anda
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <PasswordField
            label="Password Lama"
            name="currentPassword"
            show={showLama}
            onToggleShow={() => setShowLama((prev) => !prev)}
            autoComplete="current-password"
          />
          <PasswordField
            label="Password Baru"
            name="newPassword"
            show={showBaru}
            onToggleShow={() => setShowBaru((prev) => !prev)}
            autoComplete="new-password"
            error={state?.fieldErrors?.newPassword?.[0]}
          />
          <PasswordField
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            show={showKonfirmasi}
            onToggleShow={() => setShowKonfirmasi((prev) => !prev)}
            autoComplete="new-password"
            error={state?.fieldErrors?.confirmPassword?.[0]}
          />

          {state?.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {state.error}
            </p>
          ) : null}

          {state?.success ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {state.success}
            </p>
          ) : null}

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
              className="rounded-lg bg-[#0F2044] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1a335f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  show,
  onToggleShow,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  show: boolean;
  onToggleShow: () => void;
  autoComplete: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-slate-300">
        <input
          type={show ? "text" : "password"}
          name={name}
          required
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
        >
          {show ? (
            <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
          ) : (
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </button>
      </div>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
