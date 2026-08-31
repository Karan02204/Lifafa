import { redis } from "../config/redis";
import { env } from "../config/env";

interface PermitResult {
  allowed: boolean;
  retryAfter?: number;
}

class RateLimiterService {
  /**
   * Per-recipient acquire: check MIN_DELAY_BETWEEN_EMAILS lock then hourly cap.
   * Must be called for EACH email sent, not per campaign.
   */
  async acquirePermit(userId: number): Promise<PermitResult> {
    const minDelay = Number(env.MIN_DELAY_BETWEEN_EMAILS) || 1000;
    const maxPerHour = Number(env.MAX_EMAILS_PER_HOUR) || 100;

    // 1) Minimum delay between emails (per user)
    const delayKey = `email-last-send:${userId}`;
    const delayResult = await redis.set(delayKey, Date.now(), "PX", minDelay, "NX");
    if (delayResult !== "OK") {
      const ttl = await redis.pttl(delayKey);
      return {
        allowed: false,
        retryAfter: Math.max(ttl > 0 ? ttl : minDelay, 100),
      };
    }

    // 2) Hourly cap
    const now = new Date();
    const hourKey =
      `email-hourly:${userId}:` +
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}`;

    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + 1);
    const ttl = nextHour.getTime() - now.getTime();

    const count = await redis.incr(hourKey);
    if (count === 1) {
      await redis.pexpire(hourKey, ttl);
    }

    if (count > maxPerHour) {
      // Rollback the delay lock? Keep it but also block
      // Decrement count? No, keep counted but return retry
      return {
        allowed: false,
        retryAfter: ttl,
      };
    }

    return { allowed: true };
  }

  /**
   * Release delay lock early if hourly blocked? Optional
   */
  async releaseDelayLock(userId: number) {
    await redis.del(`email-last-send:${userId}`);
  }
}

export const rateLimiterService = new RateLimiterService();
