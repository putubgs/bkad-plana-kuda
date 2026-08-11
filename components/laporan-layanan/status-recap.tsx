import { DATA_LAYANAN_MASUK, STATUS_ORDER, type StatusLayanan } from "@/data/data-layanan";

const STATUS_CARD_STYLES: Record<StatusLayanan, { bg: string; text: string }> = {
  Diterima: { bg: "bg-blue-50", text: "text-blue-600" },
  Diverifikasi: { bg: "bg-amber-50", text: "text-amber-600" },
  Diproses: { bg: "bg-indigo-50", text: "text-indigo-600" },
  Selesai: { bg: "bg-emerald-50", text: "text-emerald-600" },
  Ditolak: { bg: "bg-red-50", text: "text-red-600" },
};

export default function StatusRecap() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Rekap Status Layanan</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STATUS_ORDER.map((status) => {
          const count = DATA_LAYANAN_MASUK.filter((ticket) => ticket.status === status).length;
          const { bg, text } = STATUS_CARD_STYLES[status];

          return (
            <div key={status} className={`rounded-2xl p-4 ${bg}`}>
              <p className={`text-2xl font-bold ${text}`}>{count}</p>
              <p className={`text-xs font-medium ${text}`}>{status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
