import Image from "next/image";
import LoginBrandPanel from "@/components/login/brand-panel";
import ForgotPasswordForm from "@/components/login/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <LoginBrandPanel />

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <Image
              src="/logo-nusa-tenggara-barat.png"
              alt="Logo Nusa Tenggara Barat"
              width={56}
              height={83}
              priority
              loading="eager"
              className="h-14 w-auto"
            />
            <div className="text-center leading-tight">
              <p className="text-base font-bold text-[#0F2044]">BKAD NTB</p>
              <p className="text-xs font-medium text-[#155DFC]">Plana Kuda Admin</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900">Lupa Kata Sandi?</h1>
            <p className="text-sm text-slate-500">
              Masukkan email akun Anda, kami akan mengirimkan tautan untuk membuat kata sandi
              baru.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
