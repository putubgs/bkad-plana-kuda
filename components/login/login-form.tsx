"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import LoginMfaForm from "@/components/login/login-mfa-form";

export default function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<ApiResult | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (state?.mfaRequired) {
    return <LoginMfaForm />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await postJson<ApiResult>("/api/v1/auth/login", {
        username: formData.get("username"),
        password: formData.get("password"),
        rememberMe: formData.get("rememberMe") === "on",
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
        <label htmlFor="username" className="text-sm font-semibold text-slate-700">
          Username atau Email
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors focus-within:border-[#155DFC] focus-within:bg-white">
          <PersonOutlineOutlinedIcon fontSize="small" className="text-slate-400" />
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            placeholder="Masukkan username atau email"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
          Kata Sandi
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors focus-within:border-[#155DFC] focus-within:bg-white">
          <LockOutlinedIcon fontSize="small" className="text-slate-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Masukkan kata sandi"
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
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            name="rememberMe"
            className="h-4 w-4 rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC]"
          />
          Ingat saya
        </label>
        <Link
          href="/forgot-password"
          className="font-semibold text-[#155DFC] transition-colors hover:text-blue-700"
        >
          Lupa kata sandi?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Memproses..." : "Masuk"}
        {!isPending ? <ArrowForwardOutlinedIcon fontSize="small" /> : null}
      </button>
    </form>
  );
}
