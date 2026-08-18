import Image from "next/image";
import KonsultasiForm from "@/components/konsultasi/konsultasi-form";

export default function KonsultasiPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Image
            src="/logo-nusa-tenggara-barat.png"
            alt="Logo Nusa Tenggara Barat"
            width={36}
            height={53}
            priority
            loading="eager"
            className="h-9 w-auto"
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#0F2044]">BKAD NTB</p>
            <p className="text-xs font-medium text-[#155DFC]">Plana Kuda</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8">
        <KonsultasiForm />
      </main>
    </div>
  );
}
