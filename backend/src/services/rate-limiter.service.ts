import { redis } from "../config/redis";
import { env } from "../config/env";

interface PermitResult {
  allowed: boolean;
  retryAfter?: number;
}

class RateLimiterService {
  async acquirePermit(userId: number): Promise<PermitResult> {
    const delayKey = `email-last-send:${userId}`;

    const delayResult = await redis.set(
      delayKey,
      Date.now(),
      "PX",
      env.MIN_DELAY_BETWEEN_EMAILS,
      "NX"
    );

    if (delayResult !== "OK") {
      const ttl = await redis.pttl(delayKey);

      return {
        allowed: false,
        retryAfter: Math.max(ttl, 100),
      };
    }

    // Step 2: Hourly limiter

    const now = new Date();

    const hourKey =
      `email-hourly:${userId}:` +
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, "0")}-` +
      `${String(now.getDate()).padStart(2, "0")}-` +
      `${String(now.getHours()).padStart(2, "0")}`;

    const nextHour = new Date(now);

    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);

    const ttl = nextHour.getTime() - now.getTime();

    const count = await redis.incr(hourKey);

    if (count === 1) {
      await redis.pexpire(hourKey, ttl);
    }

    if (count > env.MAX_EMAILS_PER_HOUR) {
      return {
        allowed: false,
        retryAfter: ttl,
      };
    }

    return {
      allowed: true,
    };
  }
}

export const rateLimiterService = new RateLimiterService();
