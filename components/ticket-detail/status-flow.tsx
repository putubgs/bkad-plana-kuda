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

      <div className="flex items-start w-full justify-center">
        {STATUS_ORDER.map((step, index) => {
          const meta = STATUS_META[step];
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step} className="flex flex-1 items-center">
              {/* Left Line */}
              {index !== 0 ? (
                <div className="h-px flex-1 mr-6 mb-6 bg-slate-200" />
              ) : (
                <div className="flex-1" />
              )}

              {/* Dot */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                    ${
                      isCurrent
                        ? `${meta.iconBg} text-white`
                        : isDone
                          ? `${meta.softBg} ${meta.text} border-1 ${meta.softBorder}`
                          : "bg-slate-100 text-slate-400"
                    }`}
                >
                  {isDone ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
                </div>

                <div className={`text-xs ${isFuture ? "text-slate-400" : `font-semibold ${meta.text}`} `}>
                  {step}
                </div>
              </div>

              {/* Right Line */}
              {index !== STATUS_ORDER.length - 1 ? (
                <div className="h-px flex-1 ml-6 mb-6 bg-slate-200" />
              ) : (
                <div className="flex-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
