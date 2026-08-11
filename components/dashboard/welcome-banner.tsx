import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { DATA_LAYANAN_MASUK } from "@/data/data-layanan";

function getFormattedToday() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function WelcomeBanner() {
  const perluTindakLanjut = DATA_LAYANAN_MASUK.filter(
    (ticket) => ticket.perluTindakLanjut
  ).length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F2044] via-[#132a56] to-blue-600 px-6 py-5 text-white">
      <div className="pointer-events-none absolute -top-12 -right-8 h-44 w-44 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute top-10 right-24 h-16 w-16 rounded-full bg-white/10" />

      <div className="relative z-10">
        <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/90">
          DASHBOARD ADMIN
        </span>
        <h1 className="mt-2 text-xl font-bold">Selamat Datang, Pokja Plana Kuda</h1>
        <p className="mt-1 text-sm text-white/70">
          Badan Keuangan dan Aset Daerah Provinsi Nusa Tenggara Barat
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/80">
          <span className="flex items-center gap-1.5">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 15 }} />
            {getFormattedToday()}
          </span>
          <span className="flex items-center gap-1.5">
            <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
            {perluTindakLanjut} tiket perlu tindak lanjut
          </span>
        </div>
      </div>
    </div>
  );
}
