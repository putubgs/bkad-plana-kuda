import "server-only";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/** Baseline strength check shared by change-password and reset-password flows. */
export function isPasswordStrongEnough(password: string) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}
