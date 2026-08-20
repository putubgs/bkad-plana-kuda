"use client";

import { useState, type FormEvent } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import type { LayananMasuk } from "@/data/data-layanan";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";
import RatingInputStars from "@/components/rating/rating-input-stars";

export default function RatingForm({
  token,
  ticket,
  onSubmitted,
}: {
  token: string;
  ticket: LayananMasuk;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (rating === 0) {
      setError("Silakan pilih rating bintang terlebih dahulu.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await postJson<ApiResult>(
        `/api/v1/rating-links/public/${encodeURIComponent(token)}`,
        {
          rating,
          comment: komentar.trim() || undefined,
        }
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setSubmitted(true);
      onSubmitted();
    } catch {
      setError("Gagal mengirim rating. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleOutlinedIcon sx={{ fontSize: 26 }} />
        </span>
        <p className="mt-3 text-sm font-bold text-slate-900">Terima kasih atas rating Anda!</p>
        <p className="mt-1 text-xs text-slate-400">
          Rating Anda telah tercatat untuk bidang/UPTB yang menangani tiket {ticket.noTiket}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <p className="text-sm font-bold text-slate-900">Bagaimana pengalaman Anda?</p>
      <p className="text-xs text-slate-400">
        Rating Anda akan menjadi penilaian kinerja bagi bidang/UPTB yang menangani tiket ini.
      </p>

      <div className="mt-5 flex flex-col items-center gap-2 border-y border-slate-100 py-5">
        <span className="text-xs font-semibold text-slate-600">
          Seberapa puas Anda dengan layanan ini?
        </span>
        <RatingInputStars value={rating} onChange={setRating} />
      </div>

      <label className="mt-5 flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-slate-700">Komentar (opsional)</span>
        <textarea
          rows={3}
          value={komentar}
          onChange={(event) => setKomentar(event.target.value)}
          placeholder="Bagikan pengalaman Anda menggunakan layanan ini..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-300"
        />
      </label>

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-xl bg-[#0F2044] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a335f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Mengirim rating…" : "Kirim Rating"}
      </button>
    </form>
  );
}
