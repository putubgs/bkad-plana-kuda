import CheckIcon from "@mui/icons-material/Check";
import { STATUS_ORDER } from "@/data/data-layanan";
import type { StatusLayanan } from "@/data/data-layanan";
import { STATUS_META } from "@/components/tracking-layanan/status-config";

export default function StatusFlow({ status }: { status: StatusLayanan }) {
  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <p className="mb-4 text-[11px] font-semibold tracking-wider text-slate-400">
        ALUR STATUS LAYANAN
      </p>

      <div className="flex items-start">
        {STATUS_ORDER.map((step, index) => {
          const meta = STATUS_META[step];
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step} className="flex flex-1 flex-col items-center last:flex-none">
              <div className="flex w-full items-center">
                {index > 0 ? (
                  <span className="h-px flex-1 bg-slate-200" />
                ) : null}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? `${meta.iconBg} text-white`
                      : isDone
                        ? `${meta.softBg} ${meta.text}`
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isDone ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
                </span>
                {index < STATUS_ORDER.length - 1 ? (
                  <span className="h-px flex-1 bg-slate-200" />
                ) : null}
              </div>
              <span
                className={`mt-2 text-xs whitespace-nowrap ${
                  isFuture ? "text-slate-400" : `font-semibold ${meta.text}`
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
