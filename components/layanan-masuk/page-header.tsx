"use client";

import { useState } from "react";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { exportLayananToExcel } from "@/lib/export-layanan-excel";
import ExportButton from "@/components/layanan-masuk/export-button";
import { useLayananStore } from "@/store/use-layanan-store";

export default function LayananMasukPageHeader() {
  const tickets = useLayananStore((state) => state.tickets);
  const [loading, setLoading] = useState(false);

  const handleExportAll = async () => {
    setLoading(true);
    try {
      await exportLayananToExcel(tickets, "layanan-masuk-semua");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Layanan Masuk</h1>
        <p className="text-sm text-slate-500">
          Kelola semua permohonan layanan Plana Kuda
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <FilterListOutlinedIcon fontSize="small" />
          Filter
        </button>
        <ExportButton
          label="Export Excel"
          variant="solid"
          onClick={handleExportAll}
          loading={loading}
        />
      </div>
    </div>
  );
}
