"use client";

import { useState, useTransition } from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Link from "next/link";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

export default function ForgotPasswordMfaForm() {
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleOutlinedIcon />
        </span>
        <p className="text-sm text-slate-600">{state.success}</p>
        <Link
          href="/login"
          className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#155DFC] transition-colors hover:text-blue-700"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/forgot-password/verify-mfa", {
        otp: formData.get("otp"),
      });
      setState(result);
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
          Akun ini dilindungi MFA. Masukkan kode 6 digit dari aplikasi autentikator Anda, atau
          salah satu kode pemulihan, sebelum tautan reset password dikirim.
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
        {isPending ? "Memverifikasi..." : "Verifikasi & Kirim Tautan"}
        {!isPending ? <ArrowForwardOutlinedIcon fontSize="small" /> : null}
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
