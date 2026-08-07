"use client";

import { useMemo, useState } from "react";
import {
  DATA_LAYANAN_MASUK,
  type StatusFilterValue,
} from "@/data/data-layanan";
import { exportLayananToExcel } from "@/lib/export-layanan-excel";
import LayananMasukPageHeader from "@/components/layanan-masuk/page-header";
import StatusTabs from "@/components/layanan-masuk/status-tabs";
import LayananTable from "@/components/layanan-masuk/layanan-table";
import ExportButton from "@/components/layanan-masuk/export-button";

export default function LayananMasukView() {
  const [activeStatus, setActiveStatus] = useState<StatusFilterValue>("Semua");
  const [exporting, setExporting] = useState(false);

  const filteredData = useMemo(() => {
    if (activeStatus === "Semua") {
      return DATA_LAYANAN_MASUK;
    }
    return DATA_LAYANAN_MASUK.filter((item) => item.status === activeStatus);
  }, [activeStatus]);

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
    <div className="flex flex-col gap-5 p-6">
      <LayananMasukPageHeader />

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Layanan Masuk Plana Kuda
            </h2>
            <p className="text-xs text-slate-400">
              {filteredData.length} dari {DATA_LAYANAN_MASUK.length} layanan
              ditampilkan
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

        <LayananTable data={filteredData} />
      </div>
    </div>
  );
}
