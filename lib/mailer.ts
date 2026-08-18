import "server-only";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function getFromAddress() {
  return process.env.SENDGRID_FROM_EMAIL?.trim() || "office@sasaksatu.com";
}

function describeSendGridFailure(status: number, detail: string) {
  try {
    const parsed = JSON.parse(detail) as { errors?: { message?: string }[] };
    const message = parsed.errors?.[0]?.message ?? "";
    if (status === 403 && message.toLowerCase().includes("sender identity")) {
      return [
        "SendGrid menolak alamat pengirim.",
        `Verifikasi ${getFromAddress()} di SendGrid: Settings → Sender Authentication → Verify a Single Sender,`,
        "lalu klik tautan di email verifikasi.",
      ].join(" ");
    }
    if (message) return `SendGrid request failed (${status}): ${message}`;
  } catch {
    // keep the raw body below
  }
  return `SendGrid request failed (${status})${detail ? `: ${detail}` : ""}`;
}

/**
 * Delivers mail through SendGrid when SENDGRID_API_KEY is set.
 * Used by the ticket-email webhook and by password-reset mail.
 * Falls back to console logging if the key is missing.
 */
export async function sendMail({ to, subject, text, html }: SendMailInput) {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();

  if (!apiKey) {
    console.log("\n========== [DEV MAILER] ==========");
    console.log(`To      : ${to}`);
    console.log(`Subject : ${subject}`);
    console.log("--------------------------------------");
    console.log(text);
    console.log("========================================\n");
    return;
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: getFromAddress(),
        name: process.env.SENDGRID_FROM_NAME?.trim() || "Plana Kuda BKAD NTB",
      },
      subject,
      content: [
        { type: "text/plain", value: text },
        { type: "text/html", value: html ?? text.replaceAll("\n", "<br />") },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(describeSendGridFailure(response.status, detail));
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const text = [
    "Kami menerima permintaan untuk mereset password akun Anda.",
    "Klik tautan berikut untuk membuat password baru (tautan berlaku 30 menit):",
    resetUrl,
    "",
    "Jika Anda tidak meminta reset password, abaikan email ini.",
  ].join("\n");

  await sendMail({
    to,
    subject: "Reset Password - Plana Kuda BKAD NTB",
    text,
  });
}

export async function sendNewTicketNotification(input: {
  to: string;
  ticketNumber: string;
  applicantName: string;
  organizationName: string;
  applicantEmail: string;
  whatsappNumber: string;
  departmentNames: string[];
  topic: string;
  serviceDescription: string;
}) {
  const subject = `Tiket Baru ${input.ticketNumber} — Layanan Konsultasi Plana Kuda`;
  const text = [
    `Tiket baru telah masuk ke Plana Kuda.`,
    "",
    `Nomor tiket     : ${input.ticketNumber}`,
    `Status          : Diterima`,
    `Nama pemohon    : ${input.applicantName}`,
    `Instansi        : ${input.organizationName}`,
    `Email           : ${input.applicantEmail}`,
    `WhatsApp        : ${input.whatsappNumber}`,
    `Bidang/UPTB     : ${input.departmentNames.join(", ") || "-"}`,
    `Topik           : ${input.topic}`,
    "",
    "Uraian konsultasi:",
    input.serviceDescription,
  ].join("\n");

  const html = `
    <p>Tiket baru telah masuk ke <strong>Plana Kuda</strong>.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td><strong>Nomor tiket</strong></td><td>${escapeHtml(input.ticketNumber)}</td></tr>
      <tr><td><strong>Status</strong></td><td>Diterima</td></tr>
      <tr><td><strong>Nama pemohon</strong></td><td>${escapeHtml(input.applicantName)}</td></tr>
      <tr><td><strong>Instansi</strong></td><td>${escapeHtml(input.organizationName)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(input.applicantEmail)}</td></tr>
      <tr><td><strong>WhatsApp</strong></td><td>${escapeHtml(input.whatsappNumber)}</td></tr>
      <tr><td><strong>Bidang/UPTB</strong></td><td>${escapeHtml(input.departmentNames.join(", ") || "-")}</td></tr>
      <tr><td><strong>Topik</strong></td><td>${escapeHtml(input.topic)}</td></tr>
    </table>
    <p><strong>Uraian konsultasi</strong></p>
    <p>${escapeHtml(input.serviceDescription).replaceAll("\n", "<br />")}</p>
  `;

  await sendMail({ to: input.to, subject, text, html });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
