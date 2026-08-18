import { NextRequest, NextResponse } from "next/server";
import { getRequestMeta } from "@/lib/auth/request-meta";
import { rateLimit } from "@/lib/rate-limit";
import { sendNewTicketNotification } from "@/lib/mailer";
import { ticketEmailWebhookSchema } from "@/lib/validation/ticket-email-webhook-schema";
import { isValidWebhookSecret } from "@/lib/webhooks/verify-secret";
import type { ApiResult } from "@/lib/api/types";

export async function POST(request: NextRequest) {
  if (!isValidWebhookSecret(request.headers.get("x-webhook-secret"))) {
    return NextResponse.json<ApiResult>({ error: "Webhook tidak valid." }, { status: 401 });
  }

  const { ipAddress } = await getRequestMeta();
  const limitResult = await rateLimit({
    key: `ticket-email-webhook:${ipAddress ?? "unknown"}`,
    limit: 30,
    windowSeconds: 60 * 60,
  });
  if (!limitResult.success) {
    return NextResponse.json<ApiResult>(
      { error: "Terlalu banyak permintaan webhook." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = ticketEmailWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResult>(
      { error: "Payload webhook tidak valid." },
      { status: 400 }
    );
  }

  const { event: _event, ...notification } = parsed.data;
  await sendNewTicketNotification(notification);

  return NextResponse.json<ApiResult>({ success: "Email notifikasi tiket dikirim." });
}
