"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

export default function LoginMfaForm() {
  const router = useRouter();
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/mfa/verify", {
        otp: formData.get("otp"),
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
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#155DFC]">
          <ShieldOutlinedIcon />
        </span>
        <h2 className="text-lg font-bold text-slate-900">Verifikasi Dua Langkah</h2>
        <p className="text-sm text-slate-500">
          Masukkan kode 6 digit dari aplikasi autentikator Anda, atau salah satu kode pemulihan.
        </p>
      </div>

      {state?.error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <ErrorOutlineOutlinedIcon fontSize="small" />
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="otp" className="text-sm font-semibold text-slate-700">
          Kode OTP / Kode Pemulihan
        </label>
        <input
          id="otp"
          name="otp"
          type="text"
          inputMode="text"
          autoComplete="one-time-code"
          required
          autoFocus
          placeholder="123456 atau XXXXX-XXXXX"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-semibold tracking-widest text-slate-800 outline-none transition-colors focus:border-[#155DFC] focus:bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Memverifikasi..." : "Verifikasi"}
        {!isPending ? <ArrowForwardOutlinedIcon fontSize="small" /> : null}
      </button>
    </form>
  );
}
