import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import type { LayananMasuk } from "@/data/data-layanan";

export default function RatingTicketSummary({ ticket }: { ticket: LayananMasuk }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
            Nomor Tiket
          </p>
          <p className="text-lg font-bold text-blue-600">{ticket.noTiket}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <CheckCircleOutlinedIcon sx={{ fontSize: 14 }} />
          {ticket.status}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="mb-3 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Data Pemohon
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Nama Pemohon
              </p>
              <p className="text-sm font-semibold text-slate-800">{ticket.namaPemohon}</p>
              <p className="text-xs text-slate-500">{ticket.jabatan}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <BusinessOutlinedIcon sx={{ fontSize: 18 }} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Asal Instansi
              </p>
              <p className="text-sm font-semibold text-slate-800">{ticket.asalInstansi}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 18 }} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                Tanggal Masuk
              </p>
              <p className="text-sm font-semibold text-slate-800">{ticket.tglMasuk}</p>
              <p className="text-xs text-slate-500">{ticket.durasiLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
        <div className="flex items-start gap-2.5">
          <AccountBalanceOutlinedIcon sx={{ fontSize: 18 }} className="mt-0.5 text-blue-500" />
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
              Bidang / UPTB yang Menangani
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ticket.bidangUptb.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
