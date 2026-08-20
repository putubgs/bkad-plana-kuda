import Image from "next/image";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function RatingNotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-6 py-4">
          <Image
            src="/logo-nusa-tenggara-barat.png"
            alt="Logo Nusa Tenggara Barat"
            width={36}
            height={53}
            priority
            className="h-9 w-auto"
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#0F2044]">BKAD NTB</p>
            <p className="text-xs font-medium text-[#155DFC]">Plana Kuda</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-10">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ErrorOutlineOutlinedIcon sx={{ fontSize: 26 }} />
          </span>
          <p className="text-sm font-bold text-slate-900">404 Not Found</p>
          <p className="max-w-sm text-xs text-slate-500">
            Halaman rating tidak ditemukan. Gunakan tautan rating lengkap yang dikirimkan setelah
            layanan Anda selesai diproses.
          </p>
        </div>
      </main>
    </div>
  );
}
