import "server-only";
import type { TicketEmailWebhookPayload } from "@/lib/validation/ticket-email-webhook-schema";

export async function dispatchTicketEmailWebhook(
  payload: TicketEmailWebhookPayload,
  webhookUrl: string
) {
  const secret = process.env.TICKET_EMAIL_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error("TICKET_EMAIL_WEBHOOK_SECRET is not set.");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": secret,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Ticket email webhook failed (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
}

export function resolveTicketEmailWebhookUrl(requestOrigin: string) {
  return (
    process.env.TICKET_EMAIL_WEBHOOK_URL?.trim() ||
    new URL("/api/webhooks/ticket-email", requestOrigin).toString()
  );
}
