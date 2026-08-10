"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

export type TrackingViewMode = "kanban" | "list";

export default function TrackingToolbar({
  search,
  onSearchChange,
  view,
  onViewChange,
  displayedCount,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  view: TrackingViewMode;
  onViewChange: (view: TrackingViewMode) => void;
  displayedCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
        <SearchOutlinedIcon fontSize="small" className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari tiket, pemohon, instansi..."
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => onViewChange("kanban")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            view === "kanban"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ViewKanbanOutlinedIcon sx={{ fontSize: 16 }} />
          Kanban
        </button>
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FormatListBulletedOutlinedIcon sx={{ fontSize: 16 }} />
          List
        </button>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 whitespace-nowrap">
        <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
        {displayedCount} tiket ditampilkan
      </div>
    </div>
  );
}
