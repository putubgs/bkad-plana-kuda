"use client";

import CheckIcon from "@mui/icons-material/Check";
import { statusesForRole } from "@/lib/auth/roles";
import type { StatusLayanan } from "@/data/data-layanan";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import { useCurrentUser } from "@/components/auth/current-user-provider";

export default function StatusFlow({ status }: { status: StatusLayanan }) {
  const { role } = useCurrentUser();
  const steps = statusesForRole(role);
  const currentIndex = steps.indexOf(status);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <p className="mb-4 text-[11px] font-semibold tracking-wider text-slate-400">
        ALUR STATUS LAYANAN
      </p>

      <div className="flex w-full items-start justify-center">
        {steps.map((step, index) => {
          const meta = STATUS_META[step];
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              {/* Dot + Lines */}
              <div className="flex w-full items-center">
                {/* Left Line */}
                {index !== 0 ? (
                  <div className="h-px flex-1 bg-slate-200 mr-6" />
                ) : (
                  <div className="flex-1" />
                )}

                {/* Dot */}
                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
              ${
                isCurrent
                  ? `${meta.iconBg} text-white`
                  : isDone
                    ? `${meta.softBg} ${meta.text} border ${meta.softBorder}`
                    : "bg-slate-100 text-slate-400"
              }`}
                >
                  {isDone ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
                </div>

                {/* Right Line */}
                {index !== steps.length - 1 ? (
                  <div className="h-px flex-1 bg-slate-200 ml-6" />
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Status Text */}
              <div
                className={`mt-2 text-center text-xs ${index == 0 ? "mr-6" : "mr-0"} ${index == steps.length - 1 ? "ml-6" : "ml-0"} ${
                  isFuture ? "text-slate-400" : `font-semibold ${meta.text}`
                }`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
