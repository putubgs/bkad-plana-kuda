"use client";

import type { ReactNode } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { pipelineForRole } from "@/lib/auth/roles";
import type { StatusLayanan } from "@/data/data-layanan";
import { useCurrentUser } from "@/components/auth/current-user-provider";

const ACTIVE_COLOR: Record<StatusLayanan, string> = {
  Diterima: "bg-blue-600",
  Diverifikasi: "bg-orange-500",
  Diproses: "bg-indigo-600",
  Selesai: "bg-emerald-600",
  Ditolak: "bg-red-600",
};

export default function ListStepper({ status }: { status: StatusLayanan }) {
  const { role } = useCurrentUser();
  const pipeline = pipelineForRole(role);
  const isRejected = status === "Ditolak";
  const currentIndex = isRejected ? -1 : pipeline.indexOf(status);

  return (
    <div className="flex items-center">
      {pipeline.map((step, index) => {
        const stepNumber = index + 1;
        const isPassed = !isRejected && index < currentIndex;
        const isCurrent = !isRejected && index === currentIndex;
        const isSelesaiStep = step === "Selesai";

        let circleClasses = "bg-slate-100 text-slate-400";
        let content: ReactNode = stepNumber;

        if (isRejected || isPassed) {
          content = <CheckIcon sx={{ fontSize: 12 }} />;
        } else if (isCurrent) {
          circleClasses = `${ACTIVE_COLOR[status]} text-white`;
          content = isSelesaiStep ? <CheckIcon sx={{ fontSize: 12 }} /> : stepNumber;
        }

        return (
          <div key={step} className="flex items-center">
            {index > 0 ? <span className="h-px w-4 bg-slate-200" /> : null}
            <span
              title={step}
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${circleClasses}`}
            >
              {content}
            </span>
          </div>
        );
      })}

      {isRejected ? (
        <>
          <span className="mx-1.5 h-4 w-px bg-slate-200" />
          <span
            title="Ditolak"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-white"
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </span>
        </>
      ) : null}
    </div>
  );
}
