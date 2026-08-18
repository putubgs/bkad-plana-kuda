import { z } from "zod";

export function normalizeWhatsappNumber(value: string) {
  const compact = value.trim().replace(/[^\d+]/g, "");
  const digits = compact.startsWith("+") ? compact.slice(1) : compact;
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (/^8\d+$/.test(digits)) return `0${digits}`;
  return digits;
}

export const publicConsultationSchema = z.object({
  applicantName: z.string().trim().min(1, "Nama lengkap wajib diisi").max(255),
  identityNumber: z.string().trim().min(1, "NIP/NIK wajib diisi").max(50),
  applicantOccupation: z.string().trim().max(255).optional(),
  organizationName: z.string().trim().min(1, "Asal instansi wajib diisi").max(255),
  whatsappNumber: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi")
    .transform(normalizeWhatsappNumber)
    .refine((value) => /^08\d{8,13}$/.test(value), "Nomor WhatsApp tidak valid. Gunakan 08xxxxxxxxxx")
    .refine((value) => value.length <= 20, "Nomor WhatsApp terlalu panjang"),
  applicantEmail: z.string().trim().email("Format email tidak valid").max(255),
  departmentNames: z.array(z.string().trim().min(1).max(255)).min(1, "Pilih minimal satu bidang/UPTB"),
  topic: z.string().trim().min(1, "Topik konsultasi wajib diisi").max(255),
  serviceDescription: z.string().trim().min(1, "Uraian konsultasi wajib diisi"),
});
