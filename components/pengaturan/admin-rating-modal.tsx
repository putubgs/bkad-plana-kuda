"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import RatingStars from "@/components/pengaturan/rating-stars";
import type { BidangAdmin } from "@/data/data-admin-bidang";

const PAGE_SIZE = 10;

function computeAverage(ratings: number[]) {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
}

export default function AdminRatingModal({
  bidang,
  onClose,
}: {
  bidang: BidangAdmin;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);

  const total = bidang.ratedTickets.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = bidang.ratedTickets.slice(startIndex, startIndex + PAGE_SIZE);
  const avgRating = computeAverage(bidang.ratedTickets.map((item) => item.rating));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-bold text-slate-900">{bidang.bidangNama}</p>
            <p className="text-xs text-slate-400">Admin: {bidang.email}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <RatingStars rating={avgRating} size={16} />
              <span className="text-sm font-bold text-slate-800">
                {avgRating > 0 ? avgRating.toFixed(1) : "-"}
              </span>
              <span className="text-xs text-slate-400">dari {total} penilaian tiket</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {total === 0 ? (
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
              Belum ada tiket yang dinilai untuk admin ini.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pageItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-blue-600">{item.noTiket}</span>
                    <span className="flex items-center gap-1">
                      <RatingStars rating={item.rating} size={14} />
                      <span className="text-xs font-semibold text-slate-600">
                        {item.rating.toFixed(1)}
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{item.namaPemohon}</span>
                    {" · "}
                    {item.tanggal}
                  </p>
                  {item.komentar ? (
                    <p className="mt-2 text-sm text-slate-600">&ldquo;{item.komentar}&rdquo;</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        {total > 0 ? (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-3">
            <p className="text-xs text-slate-400">
              Menampilkan {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, total)} dari {total}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                aria-label="Halaman sebelumnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
              <span className="min-w-16 text-center text-xs font-semibold text-slate-600">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                aria-label="Halaman berikutnya"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
