import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import CatatanEntry from "@/components/ticket-detail/catatan-entry";
import type { CatatanProgres } from "@/data/data-layanan";

export default function CatatanTimeline({ entries }: { entries: CatatanProgres[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
          <ChecklistOutlinedIcon fontSize="small" className="text-blue-600" />
          Catatan Progres Layanan
        </span>
        <span className="text-xs text-slate-400">
          {entries.length} entri · Klik untuk detail
        </span>
      </div>

      <div className="p-4">
        {entries.map((entry, index) => (
          <CatatanEntry
            key={entry.id}
            entry={entry}
            isLast={index === entries.length - 1}
            defaultOpen={index === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
