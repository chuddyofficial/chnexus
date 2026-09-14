import Redis from "ioredis";

declare global {
  var redisGlobal: Redis | undefined;
}

export const redis =
  globalThis.redisGlobal ??
  new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.redisGlobal = redis;
}
