import { createHash } from "node:crypto";
import { redis } from "@/lib/redis";

/**
 * Fixed-window rate limiter backed by Redis. Fails open (allows the request)
 * if Redis is unreachable, so a Redis outage never blocks the whole site.
 */
export async function rateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number },
): Promise<{ success: boolean; remaining: number }> {
  try {
    const redisKey = `ratelimit:${key}`;
    const count = await redis.incr(redisKey);
    if (count === 1) {
      await redis.expire(redisKey, windowSeconds);
    }
    return { success: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { success: true, remaining: limit };
  }
}

export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
