import "server-only";
import { generateSecret, verify, generateURI } from "otplib";
import QRCode from "qrcode";

const ISSUER = "Plana Kuda BKAD NTB";

/** otplib v13 is a full rewrite (functional API) - see otplib README, not the old `authenticator` singleton. */
export function generateMfaSecret() {
  return generateSecret();
}

export function buildOtpAuthUri(email: string, secret: string) {
  return generateURI({ issuer: ISSUER, label: email, secret });
}

export async function generateQrCodeDataUrl(otpAuthUri: string) {
  return QRCode.toDataURL(otpAuthUri);
}

export async function verifyOtp(token: string, secret: string) {
  try {
    const result = await verify({
      secret,
      token: token.replace(/\s/g, ""),
      // One 30s window either side — phone clocks are often a few seconds off.
      epochTolerance: 30,
    });
    return result.valid;
  } catch (error) {
    console.error("OTP verification failed", error);
    return false;
  }
}
