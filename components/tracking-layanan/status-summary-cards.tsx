import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import { STATUS_ORDER } from "@/data/data-layanan";
import type { StatusLayanan } from "@/data/data-layanan";

export default function StatusSummaryCards({
  counts,
  total,
  statuses = STATUS_ORDER,
}: {
  counts: Record<StatusLayanan, number>;
  total: number;
  statuses?: StatusLayanan[];
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-stretch gap-2">
        {statuses.map((status, index) => {
          const meta = STATUS_META[status];
          const Icon = meta.icon;
          const count = counts[status] ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status} className="flex flex-1 items-center gap-2">
              <div
                className={`flex flex-1 flex-col gap-2 rounded-xl border px-4 py-3 ${meta.softBorder} ${meta.softBg}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${meta.iconBg}`}
                  >
                    <Icon fontSize="small" />
                  </span>
                  <span className={`text-xl font-bold ${meta.text}`}>{count}</span>
                </div>
                <div>
                  <p className={`text-sm font-semibold ${meta.text}`}>{status}</p>
                  <p className="text-xs text-slate-400">{percent}% dari total</p>
                </div>
              </div>

              {index < statuses.length - 1 ? (
                <ChevronRightOutlinedIcon fontSize="small" className="shrink-0 text-slate-300" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
        {statuses.map((status) => {
          const meta = STATUS_META[status];
          const count = counts[status] ?? 0;
          const percent = total > 0 ? (count / total) * 100 : 0;

          if (percent <= 0) return null;

          return (
            <div key={status} className={meta.iconBg} style={{ width: `${percent}%` }} />
          );
        })}
      </div>
    </div>
  );
}
