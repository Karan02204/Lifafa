import { redis } from "../config/redis";
import { env } from "../config/env";

interface PermitResult {
  allowed: boolean;
  retryAfter?: number;
}

class RateLimiterService {
  async acquirePermit(userId: number): Promise<PermitResult> {
    const key = `email-last-send:${userId}`;

    const result = await redis.set(
      key,
      Date.now(),
      "PX",
      env.MIN_DELAY_BETWEEN_EMAILS,
      "NX"
    );

    if (result === "OK") {
      return {
        allowed: true,
      };
    }

    const ttl = await redis.pttl(key);

    return {
      allowed: false,
      retryAfter: Math.max(ttl, 100),
    };
  }
}

export const rateLimiterService = new RateLimiterService();
