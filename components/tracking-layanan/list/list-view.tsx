import ListRow from "@/components/tracking-layanan/list/list-row";
import type { LayananMasuk } from "@/data/data-layanan";

export default function ListView({ tickets }: { tickets: LayananMasuk[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      {tickets.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate-400">
          Tidak ada tiket yang cocok dengan pencarian.
        </div>
      ) : (
        tickets.map((ticket) => <ListRow key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );
}
