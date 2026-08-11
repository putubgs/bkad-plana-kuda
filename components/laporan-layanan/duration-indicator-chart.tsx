import { DATA_LAYANAN_MASUK } from "@/data/data-layanan";
import DurationBadge from "@/components/layanan-masuk/duration-badge";
import StatusBadge from "@/components/layanan-masuk/status-badge";
import {
  getDurasiBarKategori,
  parseDurasiHari,
  DURASI_BAR_COLOR,
  DURASI_BAR_LEGEND,
} from "@/components/laporan-layanan/durasi-config";

export default function DurationIndicatorChart() {
  const maxHari = Math.max(
    1,
    ...DATA_LAYANAN_MASUK.map((ticket) => parseDurasiHari(ticket.durasiLabel))
  );

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">Indikator Durasi Per Layanan</h2>

      <div className="mt-4 flex flex-col gap-3.5">
        {DATA_LAYANAN_MASUK.map((ticket) => {
          const hari = parseDurasiHari(ticket.durasiLabel);
          const kategori = getDurasiBarKategori(ticket);
          const widthPct = (hari / maxHari) * 100;

          return (
            <div key={ticket.id} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-xs font-bold whitespace-nowrap text-blue-600">
                {ticket.noTiket}
              </span>
              <div className="relative h-2 flex-1 rounded-full bg-slate-100">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${DURASI_BAR_COLOR[kategori]}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="min-w-[150px] shrink-0">
                <DurationBadge label={ticket.durasiLabel} variant={ticket.durasiVariant} />
              </div>
              <div className="min-w-[100px] shrink-0">
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3.5">
        {DURASI_BAR_LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={`h-2 w-2 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
