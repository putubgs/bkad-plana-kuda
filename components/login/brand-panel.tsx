import Image from "next/image";

export default function LoginBrandPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0F2044] px-12 py-12 lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#155DFC]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#5B8DFB]/10 blur-3xl"
      />

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative flex flex-col items-center gap-6 text-center">
          <Image
            src="/logo-nusa-tenggara-barat.png"
            alt="Logo Nusa Tenggara Barat"
            width={140}
            height={207}
            priority
            loading="eager"
            className="h-44 w-auto drop-shadow-2xl"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Dashboard Plana Kuda
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#B7C7EA]">
              Sistem Manajemen Konsultasi Publik yang Dikelola Oleh &mdash; Badan Keuangan dan Aset Daerah Provinsi Nusa Tenggara Barat.
            </p>
          </div>
        </div>
      </div>

      <p className="relative text-xs text-[#7C8CB3]">
        &copy; {new Date().getFullYear()} BKAD Provinsi NTB. Seluruh hak cipta dilindungi.
      </p>
    </div>
  );
}
