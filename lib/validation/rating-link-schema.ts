import { z } from "zod";

export const createRatingLinkSchema = z.object({
  ticketNumber: z.string().trim().min(1, "Nomor tiket wajib diisi").max(100),
});

export const updateRatingLinkSchema = z.object({
  expiresAt: z.coerce.date().optional(),
});

export const submitPublicRatingSchema = z.object({
  rating: z.number().int().min(1, "Rating wajib diisi").max(5),
  comment: z.string().trim().max(2000).optional(),
});
