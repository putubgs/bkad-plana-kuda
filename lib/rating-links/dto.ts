import "server-only";
import { randomBytes } from "crypto";
import type { RatingLink } from "@/app/generated/prisma/client";

export const RATING_LINK_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function createRatingToken() {
  return randomBytes(32).toString("hex");
}

export function ratingLinkExpiresAt(from = new Date()) {
  return new Date(from.getTime() + RATING_LINK_TTL_MS);
}

export function publicRatingUrl(rawToken: string) {
  const origin = process.env.APP_URL ?? "http://localhost:3000";
  return `${origin}/rating/${rawToken}`;
}

export function toRatingLinkDto(link: RatingLink, extras?: { token?: string }) {
  return {
    ratingLinkId: link.ratingLinkId,
    ticketNumber: link.ticketNumber,
    expiresAt: link.expiresAt.toISOString(),
    isUsed: link.isUsed,
    usedAt: link.usedAt?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    ...(extras?.token
      ? { token: extras.token, url: publicRatingUrl(extras.token) }
      : {}),
  };
}
