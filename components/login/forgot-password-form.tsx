"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import ForgotPasswordMfaForm from "@/components/login/forgot-password-mfa-form";

export default function ForgotPasswordForm() {
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  if (state?.mfaRequired) {
    return <ForgotPasswordMfaForm />;
  }

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
      const result = await postJson<ApiResult>("/api/v1/auth/forgot-password", {
        email: formData.get("email"),
      });
      setState(result);
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
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Email
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors focus-within:border-[#155DFC] focus-within:bg-white">
          <EmailOutlinedIcon fontSize="small" className="text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Masukkan email terdaftar"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Mengirim..." : "Kirim Tautan Reset"}
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
