import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const raw = process.env.MFA_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("MFA_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("MFA_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }

  return key;
}

/** Encrypts a TOTP secret before it is persisted in User.mfaSecret. */
export function encryptSecret(plainText: string) {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(
    "."
  );
}

export function decryptSecret(payload: string) {
  const [ivB64, authTagB64, dataB64] = payload.split(".");
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error("Invalid encrypted MFA secret payload");
  }

  const key = getKey();
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
