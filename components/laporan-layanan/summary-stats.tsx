import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { DATA_LAYANAN_MASUK } from "@/data/data-layanan";
import { parseDurasiHari } from "@/components/laporan-layanan/durasi-config";
import { JENIS_LAYANAN_LIST, JENIS_LAYANAN_COLOR } from "@/components/laporan-layanan/jenis-config";

function computeAverageDurasiSelesai() {
  const selesaiTickets = DATA_LAYANAN_MASUK.filter(
    (ticket) => ticket.durasiVariant === "selesai"
  );
  if (selesaiTickets.length === 0) return 0;

  const total = selesaiTickets.reduce(
    (sum, ticket) => sum + parseDurasiHari(ticket.durasiLabel),
    0
  );
  return Math.round(total / selesaiTickets.length);
}

export default function SummaryStats() {
  const avgDurasi = computeAverageDurasiSelesai();

  const jenisCounts = JENIS_LAYANAN_LIST.map((jenis) => ({
    jenis,
    count: DATA_LAYANAN_MASUK.filter((ticket) => ticket.jenisLayanan === jenis).length,
  }));
  const maxCount = Math.max(1, ...jenisCounts.map((item) => item.count));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-blue-500" />
          Rata-rata Durasi Selesai
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {avgDurasi} <span className="text-sm font-medium text-slate-400">hari</span>
        </p>
      </div>

      {jenisCounts.map(({ jenis, count }) => (
        <div key={jenis} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{count}</p>
          <p className="text-xs text-slate-400">{jenis}</p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${JENIS_LAYANAN_COLOR[jenis]}`}
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
