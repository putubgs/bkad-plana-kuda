import "server-only";
import { redis } from "@/lib/redis";

interface RateLimitOptions {
  /** Unique key per limited action, e.g. `login:${username}` or `forgot-password:${ip}`. */
  key: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** Fixed-window rate limiter backed by Redis (INCR + EXPIRE). */
export async function rateLimit({ key, limit, windowSeconds }: RateLimitOptions): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }

  const ttl = await redis.ttl(redisKey);
  const retryAfterSeconds = ttl > 0 ? ttl : windowSeconds;

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds,
  };
}

export async function resetRateLimit(key: string) {
  await redis.del(`rl:${key}`);
}
