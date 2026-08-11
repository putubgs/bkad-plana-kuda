"use client";

import { useState } from "react";
import { DATA_LAYANAN_MASUK } from "@/data/data-layanan";
import { DATA_BIDANG_ADMIN } from "@/data/data-admin-bidang";
import ExportButton from "@/components/layanan-masuk/export-button";
import { exportLayananToExcel } from "@/lib/export-layanan-excel";

export default function BidangDistribution() {
  const [exporting, setExporting] = useState(false);

  const bidangCounts = DATA_BIDANG_ADMIN.map((bidang) => ({
    bidangNama: bidang.bidangNama,
    count: DATA_LAYANAN_MASUK.filter((ticket) => ticket.bidangUptb.includes(bidang.bidangNama))
      .length,
  }));
  const maxCount = Math.max(1, ...bidangCounts.map((item) => item.count));

  async function handleExport() {
    setExporting(true);
    try {
      await exportLayananToExcel(DATA_LAYANAN_MASUK, "laporan-layanan");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900">Distribusi per Bidang / UPTB</h2>
        <ExportButton label="Export Laporan" onClick={handleExport} loading={exporting} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {bidangCounts.map(({ bidangNama, count }) => (
          <div key={bidangNama} className="flex items-center gap-3">
            <span className="w-48 shrink-0 truncate text-xs text-slate-600">{bidangNama}</span>
            <div className="h-2 flex-1 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-semibold text-slate-500">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
