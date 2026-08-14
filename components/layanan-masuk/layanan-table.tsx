"use client";

import { useMemo, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { type StatusFilterValue } from "@/data/data-layanan";
import { exportLayananToExcel } from "@/lib/export-layanan-excel";
import StatusBadge from "@/components/layanan-masuk/status-badge";
import DurationBadge from "@/components/layanan-masuk/duration-badge";
import BidangTags from "@/components/layanan-masuk/bidang-tags";
import TicketCell from "@/components/layanan-masuk/ticket-cell";
import StatusTabs from "@/components/layanan-masuk/status-tabs";
import ExportButton from "@/components/layanan-masuk/export-button";
import { useLayananStore } from "@/store/use-layanan-store";

const COLUMNS = [
  "NO. TIKET",
  "TGL MASUK",
  "DURASI",
  "NAMA PEMOHON",
  "ASAL INSTANSI",
  "BIDANG/UPTB",
  "STATUS",
  "AKSI",
];

export default function LayananTable() {
  const tickets = useLayananStore((state) => state.tickets);
  const loading = useLayananStore((state) => state.loading);
  const error = useLayananStore((state) => state.error);
  const openTicketDetail = useLayananStore((state) => state.openTicketDetail);
  const [activeStatus, setActiveStatus] = useState<StatusFilterValue>("Semua");
  const [exporting, setExporting] = useState(false);

  const filteredData = useMemo(() => {
    if (activeStatus === "Semua") {
      return tickets;
    }
    return tickets.filter((item) => item.status === activeStatus);
  }, [tickets, activeStatus]);

  const handleExportFiltered = async () => {
    setExporting(true);
    try {
      const suffix =
        activeStatus === "Semua" ? "semua" : activeStatus.toLowerCase();
      await exportLayananToExcel(filteredData, `layanan-masuk-${suffix}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Daftar Layanan Masuk Plana Kuda
          </h2>
            <p className="text-xs text-slate-400">
              {filteredData.length} dari {tickets.length} layanan ditampilkan
            </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusTabs active={activeStatus} onChange={setActiveStatus} />
          <ExportButton
            label="Export"
            variant="outline"
            onClick={handleExportFiltered}
            loading={exporting}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-[11px] font-semibold tracking-wider whitespace-nowrap text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item.id}
                onClick={() => openTicketDetail(item.id)}
                className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-4 py-4 align-top">
                  <TicketCell
                    noTiket={item.noTiket}
                    perluTindakLanjut={item.perluTindakLanjut}
                  />
                </td>
                <td className="px-4 py-4 align-top text-sm whitespace-nowrap text-slate-600">
                  {item.tglMasuk}
                </td>
                <td className="px-4 py-4 align-top">
                  <DurationBadge
                    label={item.durasiLabel}
                    variant={item.durasiVariant}
                  />
                </td>
                <td className="px-4 py-4 align-top text-sm font-medium whitespace-nowrap text-slate-800">
                  {item.namaPemohon}
                </td>
                <td className="px-4 py-4 align-top text-sm whitespace-nowrap text-slate-600">
                  {item.asalInstansi}
                </td>
                <td className="px-4 py-4 align-top">
                  <BidangTags items={item.bidangUptb} />
                </td>
                <td className="px-4 py-4 align-top">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4 align-top">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openTicketDetail(item.id);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {loading && tickets.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Memuat layanan...
                </td>
              </tr>
            ) : null}
            {!loading && error ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            ) : null}
            {!loading && !error && filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Tidak ada layanan dengan status ini.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
