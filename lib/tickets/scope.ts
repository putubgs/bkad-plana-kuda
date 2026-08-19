import "server-only";
import { isAdmin, isSuperadmin } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { TICKET_DETAIL_INCLUDE } from "@/lib/tickets/queries";
import { toLayananMasuk } from "@/lib/tickets/to-layanan-masuk";
import type { LayananMasuk } from "@/data/data-layanan";

type Actor = {
  role: string;
  departmentName: string | null;
};

export function departmentTicketWhere(actor: Actor) {
  if (isSuperadmin(actor.role)) {
    return {};
  }

  if (isAdmin(actor.role) && actor.departmentName) {
    return {
      departments: { some: { departmentName: actor.departmentName } },
    };
  }

  return { ticketNumber: "__no_access__" };
}

export function filterTicketsForActor(actor: Actor, tickets: LayananMasuk[]) {
  if (!isAdmin(actor.role)) {
    return tickets;
  }
  return tickets.filter((ticket) => ticket.status !== "Diterima");
}

export async function findAccessibleTicket(actor: Actor, ticketNumber: string) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      ticketNumber,
      isDeleted: false,
      ...departmentTicketWhere(actor),
    },
    include: TICKET_DETAIL_INCLUDE,
  });

  if (!ticket) {
    return null;
  }

  const mapped = toLayananMasuk(ticket);
  if (isAdmin(actor.role) && mapped.status === "Diterima") {
    return null;
  }

  return { ticket, mapped };
}
