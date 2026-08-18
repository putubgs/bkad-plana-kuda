import Image from "next/image";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Link from "next/link";
import LoginBrandPanel from "@/components/login/brand-panel";
import ResetPasswordForm from "@/components/login/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

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

          {token ? (
            <>
              <div className="flex flex-col gap-1.5 text-center lg:text-left">
                <h1 className="text-2xl font-bold text-slate-900">Buat Kata Sandi Baru</h1>
                <p className="text-sm text-slate-500">
                  Pastikan kata sandi baru Anda kuat dan tidak digunakan di tempat lain.
                </p>
              </div>
              <ResetPasswordForm token={token} />
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <ErrorOutlineOutlinedIcon />
              </span>
              <p className="text-sm font-bold text-slate-900">Tautan Tidak Lengkap</p>
              <p className="text-sm text-slate-500">
                Tautan reset password tidak valid. Silakan minta tautan baru melalui halaman lupa
                kata sandi.
              </p>
              <Link
                href="/forgot-password"
                className="mt-2 text-sm font-semibold text-[#155DFC] transition-colors hover:text-blue-700"
              >
                Minta Tautan Reset Baru
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
