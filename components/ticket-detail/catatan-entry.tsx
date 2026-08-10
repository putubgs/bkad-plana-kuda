"use client";

import { useState } from "react";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { STATUS_META } from "@/components/tracking-layanan/status-config";
import type { CatatanProgres } from "@/data/data-layanan";

export default function CatatanEntry({
  entry,
  isLast,
  defaultOpen = false,
}: {
  entry: CatatanProgres;
  isLast: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = STATUS_META[entry.status];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${meta.iconBg}`} />
        {!isLast ? <span className="w-px flex-1 bg-slate-200" /> : null}
      </div>

      <div
        className={`mb-3 flex-1 overflow-hidden rounded-xl border transition-colors ${
          open ? `${meta.softBorder} ${meta.softBg}` : "border-slate-100 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="flex flex-wrap items-center gap-2">
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${meta.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.iconBg}`} />
              {entry.status}
            </span>
            <span className="text-xs text-slate-400">{entry.timestamp}</span>
          </span>
          <ExpandMoreOutlinedIcon
            fontSize="small"
            className={`shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 px-4 pb-4 text-sm">
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
                  <DescriptionOutlinedIcon sx={{ fontSize: 14 }} />
                  CATATAN PROGRES
                </p>
                <p className="text-slate-700">{entry.catatan}</p>
              </div>

              {entry.estimasiSelesai || entry.keteranganProses ? (
                <div className={`rounded-lg border px-3 py-2.5 ${meta.softBorder} bg-white/70`}>
                  {entry.estimasiSelesai ? (
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <EventOutlinedIcon sx={{ fontSize: 14 }} className={meta.text} />
                      <span className="font-semibold tracking-wide text-slate-400">
                        ESTIMASI SELESAI:
                      </span>
                      <span className={`font-semibold ${meta.text}`}>{entry.estimasiSelesai}</span>
                    </p>
                  ) : null}
                  {entry.keteranganProses ? (
                    <div className={entry.estimasiSelesai ? "mt-2" : undefined}>
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
                        <AutorenewOutlinedIcon sx={{ fontSize: 14 }} className={meta.text} />
                        KETERANGAN PROSES
                      </p>
                      <p className="mt-1 text-slate-700">{entry.keteranganProses}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {entry.alasanPenolakan ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-red-500">
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                    ALASAN PENOLAKAN
                  </p>
                  <p className="mt-1 text-red-600">{entry.alasanPenolakan}</p>
                </div>
              ) : null}

              {entry.tindakLanjutBerikutnya ? (
                <div>
                  <p className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-slate-400">
                    <ChevronRightOutlinedIcon sx={{ fontSize: 14 }} />
                    TINDAK LANJUT BERIKUTNYA
                  </p>
                  <p className="mt-1 font-medium text-blue-600">
                    {entry.tindakLanjutBerikutnya}
                  </p>
                </div>
              ) : null}

              {entry.dokumenPendukung && entry.dokumenPendukung.length > 0 ? (
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400">
                    <AttachFileOutlinedIcon sx={{ fontSize: 14 }} />
                    DOKUMEN PENDUKUNG
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.dokumenPendukung.map((file) => (
                      <span
                        key={file}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium whitespace-nowrap text-blue-600"
                      >
                        <InsertDriveFileOutlinedIcon sx={{ fontSize: 13 }} />
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-1.5 border-t border-slate-200/70 pt-2.5 text-xs text-slate-400">
                <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                Diinput oleh:
                <span className="font-medium text-slate-600">{entry.diinputOleh}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
