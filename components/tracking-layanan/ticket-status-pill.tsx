import { STATUS_META } from "@/components/tracking-layanan/status-config";
import type { StatusLayanan } from "@/data/data-layanan";

export default function TicketStatusPill({ status }: { status: StatusLayanan }) {
  const meta = STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.softBg} ${meta.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.iconBg}`} />
      {status}
    </span>
  );
}
