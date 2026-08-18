import { z } from "zod";

export const ticketEmailWebhookSchema = z.object({
  event: z.literal("ticket.created"),
  to: z.string().trim().email(),
  ticketNumber: z.string().trim().min(1).max(50),
  applicantName: z.string().trim().min(1).max(255),
  organizationName: z.string().trim().min(1).max(255),
  applicantEmail: z.string().trim().email().max(255),
  whatsappNumber: z.string().trim().min(1).max(20),
  departmentNames: z.array(z.string().trim().min(1).max(255)),
  topic: z.string().trim().min(1).max(255),
  serviceDescription: z.string().trim().min(1),
});

export type TicketEmailWebhookPayload = z.infer<typeof ticketEmailWebhookSchema>;
