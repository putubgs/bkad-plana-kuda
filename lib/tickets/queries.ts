import type { TicketGetPayload } from "@/app/generated/prisma/models/Ticket";
import { prisma } from "@/lib/db/prisma";

export const TICKET_DETAIL_INCLUDE = {
  departments: {
    select: { departmentName: true },
    orderBy: { createdAt: "asc" as const },
  },
  progresses: {
    where: { isDeleted: false },
    orderBy: { dateAndTime: "asc" as const },
    include: {
      updatedBy: { select: { username: true, departmentName: true } },
      documents: { select: { fileName: true }, orderBy: { createdAt: "asc" as const } },
    },
  },
};

export type TicketDetailRecord = TicketGetPayload<{ include: typeof TICKET_DETAIL_INCLUDE }>;

export async function generateTicketNumber() {
  const year = new Date().getFullYear();
  const prefix = `PK-${year}-`;
  const latest = await prisma.ticket.findFirst({
    where: { ticketNumber: { startsWith: prefix } },
    orderBy: { ticketNumber: "desc" },
    select: { ticketNumber: true },
  });

  const lastSerial = latest ? Number(latest.ticketNumber.slice(prefix.length)) : 0;
  const next = Number.isFinite(lastSerial) ? lastSerial + 1 : 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export async function assertDepartmentNamesExist(departmentNames: string[]) {
  const unique = [...new Set(departmentNames)];
  if (unique.length === 0) return unique;

  const rows = await prisma.user.findMany({
    where: { departmentName: { in: unique }, isDeleted: false },
    select: { departmentName: true },
  });

  const found = new Set(rows.map((row) => row.departmentName));
  const missing = unique.filter((name) => !found.has(name));
  if (missing.length > 0) {
    throw new DepartmentNotFoundError(missing);
  }

  return unique;
}

export class DepartmentNotFoundError extends Error {
  missing: string[];

  constructor(missing: string[]) {
    super("Bidang/UPTB tidak ditemukan.");
    this.name = "DepartmentNotFoundError";
    this.missing = missing;
  }
}
