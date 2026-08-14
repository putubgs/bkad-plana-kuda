import { z } from "zod";

export const createTicketSchema = z.object({
  ticketNumber: z.string().trim().min(1).max(100).optional(),
  applicantName: z.string().trim().min(1, "Nama pemohon wajib diisi").max(255),
  applicantOccupation: z.string().trim().min(1, "Jabatan wajib diisi").max(255),
  whatsappNumber: z.string().trim().min(1, "Nomor WhatsApp wajib diisi").max(20),
  organizationName: z.string().trim().min(1, "Asal instansi wajib diisi").max(255),
  identityNumber: z.string().trim().min(1, "NIP/NIK wajib diisi").max(50),
  applicantEmail: z.string().trim().email("Format email tidak valid").max(255),
  serviceDescription: z.string().trim().min(1, "Uraian layanan wajib diisi"),
  isCompleted: z.boolean().optional(),
  departmentNames: z.array(z.string().trim().min(1).max(255)).optional(),
});

export const updateTicketSchema = createTicketSchema.partial();
