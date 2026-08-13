"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/reset-password", {
        token,
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });

      setState(result);

      if (result.redirectTo) {
        router.push(result.redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {state?.error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <ErrorOutlineOutlinedIcon fontSize="small" />
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
          Kata Sandi Baru
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors focus-within:border-[#155DFC] focus-within:bg-white">
          <LockOutlinedIcon fontSize="small" className="text-slate-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Minimal 8 karakter, huruf & angka"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            className="text-slate-400 transition-colors hover:text-slate-600"
          >
            {showPassword ? (
              <VisibilityOffOutlinedIcon fontSize="small" />
            ) : (
              <VisibilityOutlinedIcon fontSize="small" />
            )}
          </button>
        </div>
        {state?.fieldErrors?.password ? (
          <p className="text-xs text-red-500">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
          Konfirmasi Kata Sandi Baru
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors focus-within:border-[#155DFC] focus-within:bg-white">
          <LockOutlinedIcon fontSize="small" className="text-slate-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Ulangi kata sandi baru"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
        {state?.fieldErrors?.confirmPassword ? (
          <p className="text-xs text-red-500">{state.fieldErrors.confirmPassword[0]}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
      </button>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowBackOutlinedIcon fontSize="small" />
        Kembali ke halaman masuk
      </Link>
    </form>
  );
}
