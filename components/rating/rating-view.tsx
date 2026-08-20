"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLayananStore } from "@/store/use-layanan-store";
import RatingTicketSummary from "@/components/rating/rating-ticket-summary";
import RatingForm from "@/components/rating/rating-form";
import RatingNotFound from "@/components/rating/rating-not-found";

export default function RatingView({ token }: { token?: string }) {
  const fetchTicketByRatingToken = useLayananStore((state) => state.fetchTicketByRatingToken);
  const ticket = useLayananStore((state) => state.ratingTicket);
  const loading = useLayananStore((state) => state.ratingLoading);
  const errorKind = useLayananStore((state) => state.ratingErrorKind);

  useEffect(() => {
    if (!token) return;
    void fetchTicketByRatingToken(token);
  }, [token, fetchTicketByRatingToken]);

  const isReadyToRate = ticket !== null && ticket.status === "Selesai" && !errorKind;

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-6 py-4">
          <Image
            src="/logo-nusa-tenggara-barat.png"
            alt="Logo Nusa Tenggara Barat"
            width={36}
            height={53}
            priority
            loading="eager"
            className="h-9 w-auto"
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-[#0F2044]">BKAD NTB</p>
            <p className="text-xs font-medium text-[#155DFC]">Plana Kuda</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-10">
        {loading || (Boolean(token) && !ticket && !errorKind) ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Memuat tautan rating…</p>
            <p className="mt-1 text-xs text-slate-400">Mohon tunggu sebentar.</p>
          </div>
        ) : isReadyToRate && ticket && token ? (
          <>
            <RatingTicketSummary ticket={ticket} />
            <RatingForm token={token} ticket={ticket} onSubmitted={() => {}} />
          </>
        ) : (
          <RatingNotFound
            reason={!token ? "missing" : errorKind ?? "not-found"}
            noTiket={ticket?.noTiket}
          />
        )}
      </main>
    </div>
  );
}
