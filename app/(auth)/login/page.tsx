import Image from "next/image";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LoginBrandPanel from "@/components/login/brand-panel";
import LoginForm from "@/components/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

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
              className="h-14 w-auto"
            />
            <div className="text-center leading-tight">
              <p className="text-base font-bold text-[#0F2044]">BKAD NTB</p>
              <p className="text-xs font-medium text-[#155DFC]">
                Plana Kuda Admin
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-900">
              Selamat Datang Kembali
            </h1>
            <p className="text-sm text-slate-500">
              Masukkan kredensial Anda untuk mengakses dashboard Plana Kuda.
            </p>
          </div>

          {reset === "success" ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              <CheckCircleOutlinedIcon fontSize="small" />
              Password berhasil diubah. Silakan masuk dengan password baru Anda.
            </div>
          ) : null}

          <LoginForm />

          <p className="text-center text-xs text-slate-400">
            Hanya untuk personel Pokja Plana Kuda &amp; BKAD Provinsi NTB yang
            berwenang.
          </p>
        </div>
      </div>
    </div>
  );
}
