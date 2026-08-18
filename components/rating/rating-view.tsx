"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useLayananStore } from "@/store/use-layanan-store";
import { useAdminBidangStore } from "@/store/use-admin-bidang-store";
import RatingTicketSummary from "@/components/rating/rating-ticket-summary";
import RatingForm from "@/components/rating/rating-form";
import RatingNotFound from "@/components/rating/rating-not-found";

export default function RatingView({ noTiket }: { noTiket?: string }) {
  const tickets = useLayananStore((state) => state.tickets);
  const bidangList = useAdminBidangStore((state) => state.bidangList);

  const ticket = useMemo(() => {
    if (!noTiket) return null;
    return (
      tickets.find((item) => item.noTiket.toLowerCase() === noTiket.toLowerCase()) ?? null
    );
  }, [tickets, noTiket]);

  const alreadyRated = useMemo(() => {
    if (!ticket) return false;
    return bidangList.some((bidang) =>
      bidang.ratedTickets.some((entry) => entry.noTiket === ticket.noTiket)
    );
  }, [ticket, bidangList]);

  const isReadyToRate = ticket !== null && ticket.status === "Selesai";

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
        {isReadyToRate && ticket ? (
          <>
            <RatingTicketSummary ticket={ticket} />
            <RatingForm ticket={ticket} alreadyRated={alreadyRated} onSubmitted={() => {}} />
          </>
        ) : (
          <RatingNotFound
            reason={!noTiket ? "missing" : !ticket ? "not-found" : "not-finished"}
            noTiket={noTiket}
          />
        )}
      </main>
    </div>
  );
}
