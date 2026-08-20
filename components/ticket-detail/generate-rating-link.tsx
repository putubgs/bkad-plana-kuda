"use client";

import { useState } from "react";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { postJson } from "@/lib/api-client";
import type { ApiResult } from "@/lib/api/types";

interface RatingLinkPayload {
  ratingLinkId: string;
  ticketNumber: string;
  expiresAt: string;
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  token?: string;
  url?: string;
}

function formatExpiry(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function GenerateRatingLink({ ticketNumber }: { ticketNumber: string }) {
  const [link, setLink] = useState<RatingLinkPayload | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setSaving(true);
    setError(null);
    setCopied(false);

    try {
      const result = await postJson<ApiResult>("/api/v1/rating-links", { ticketNumber });
      if (result.error) {
        setError(result.error);
        return;
      }

      const payload = result.data as RatingLinkPayload | undefined;
      if (!payload?.url) {
        setError("Tautan rating gagal dibuat.");
        return;
      }

      setLink(payload);
    } catch {
      setError("Gagal membuat tautan rating.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    if (!link?.url) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Gagal menyalin tautan. Salin secara manual.");
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <LinkOutlinedIcon fontSize="small" className="text-blue-600" />
            Tautan Rating Pemohon
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Buat tautan khusus agar pemohon dapat menilai layanan setelah tiket selesai.
          </p>
        </div>
      </div>

      {link?.url ? (
        <>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600">{link.url}</p>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
            >
              {copied ? (
                <CheckOutlinedIcon sx={{ fontSize: 14 }} className="text-emerald-600" />
              ) : (
                <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
              )}
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">Berlaku sampai {formatExpiry(link.expiresAt)}</p>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={saving}
        className="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Membuat tautan…" : link ? "Buat ulang tautan rating" : "Buat tautan rating"}
      </button>

      {error ? (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
