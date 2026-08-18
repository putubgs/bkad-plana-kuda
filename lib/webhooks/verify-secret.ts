import "server-only";
import { timingSafeEqual } from "crypto";

export function isValidWebhookSecret(provided: string | null) {
  const expected = process.env.TICKET_EMAIL_WEBHOOK_SECRET?.trim();
  if (!expected || !provided) {
    return false;
  }

  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}
