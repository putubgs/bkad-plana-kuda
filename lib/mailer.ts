import "server-only";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
}

/**
 * Dev-mode mailer: logs the email to the server console instead of sending a
 * real message. Swap this out for a real provider (Resend, SES, etc.) before
 * going to production.
 */
export async function sendMail({ to, subject, text }: SendMailInput) {
  console.log("\n========== [DEV MAILER] ==========");
  console.log(`To      : ${to}`);
  console.log(`Subject : ${subject}`);
  console.log("--------------------------------------");
  console.log(text);
  console.log("========================================\n");
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendMail({
    to,
    subject: "Reset Password - Plana Kuda BKAD NTB",
    text: [
      "Kami menerima permintaan untuk mereset password akun Anda.",
      "Klik tautan berikut untuk membuat password baru (tautan berlaku 30 menit):",
      resetUrl,
      "",
      "Jika Anda tidak meminta reset password, abaikan email ini.",
    ].join("\n"),
  });
}
