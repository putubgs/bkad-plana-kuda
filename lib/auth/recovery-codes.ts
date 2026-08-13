import "server-only";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/prisma";

const RECOVERY_CODE_COUNT = 10;
const SALT_ROUNDS = 10;

function formatCode(raw: Buffer) {
  const value = raw.toString("hex").toUpperCase().slice(0, 10);
  return `${value.slice(0, 5)}-${value.slice(5)}`;
}

export function generateRecoveryCodePlaintexts() {
  return Array.from({ length: RECOVERY_CODE_COUNT }, () => formatCode(randomBytes(6)));
}

/** Deletes every existing recovery code for the user and stores fresh hashed ones. */
export async function replaceRecoveryCodes(userId: string, plaintextCodes: string[]) {
  const hashed = await Promise.all(
    plaintextCodes.map((code) => bcrypt.hash(code, SALT_ROUNDS))
  );

  await prisma.$transaction([
    prisma.mfaRecoveryCode.deleteMany({ where: { userId } }),
    prisma.mfaRecoveryCode.createMany({
      data: hashed.map((codeHash) => ({ userId, codeHash })),
    }),
  ]);
}

export async function deleteAllRecoveryCodes(userId: string) {
  await prisma.mfaRecoveryCode.deleteMany({ where: { userId } });
}

/** Checks candidate against all unused codes and marks the match as used. Single-use. */
export async function consumeRecoveryCode(userId: string, candidate: string) {
  const normalized = candidate.trim().toUpperCase();
  const unusedCodes = await prisma.mfaRecoveryCode.findMany({
    where: { userId, usedAt: null },
  });

  for (const record of unusedCodes) {
    if (await bcrypt.compare(normalized, record.codeHash)) {
      await prisma.mfaRecoveryCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });
      return true;
    }
  }

  return false;
}

export async function countRemainingRecoveryCodes(userId: string) {
  return prisma.mfaRecoveryCode.count({ where: { userId, usedAt: null } });
}
