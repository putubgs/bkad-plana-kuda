import type { User, Session, MfaRecoveryCode } from "@/app/generated/prisma/client";

const USER_PUBLIC_SELECT = {
  userId: true,
  username: true,
  email: true,
  role: true,
  departmentName: true,
  biography: true,
  isActive: true,
  mfaEnabled: true,
  mfaEnabledAt: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export { USER_PUBLIC_SELECT };

export type PublicUser = Pick<
  User,
  | "userId"
  | "username"
  | "email"
  | "role"
  | "departmentName"
  | "biography"
  | "isActive"
  | "mfaEnabled"
  | "mfaEnabledAt"
  | "isDeleted"
  | "createdAt"
  | "updatedAt"
>;

export function toPublicSession(session: Session, currentSessionId?: string) {
  return {
    id: session.id,
    userId: session.userId,
    userAgent: session.userAgent,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    lastSeenAt: session.lastSeenAt,
    isCurrent: currentSessionId === session.id,
  };
}

export function toPublicRecoveryCode(code: MfaRecoveryCode) {
  return {
    id: code.id,
    used: Boolean(code.usedAt),
    usedAt: code.usedAt,
    createdAt: code.createdAt,
  };
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 20) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}
