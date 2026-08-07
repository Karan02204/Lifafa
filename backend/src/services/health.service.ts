import prisma from "../config/prisma";
import { redis } from "../config/redis";
import { emailQueue } from "../queues/email.queue";
import type { HealthResponse } from "../types/health.types";

class HealthService {
  async check(): Promise<HealthResponse & { redis: string; queue: any }> {
    await prisma.$queryRaw`SELECT 1`;

    let redisStatus = "connected";
    try {
      await redis.ping();
    } catch {
      redisStatus = "disconnected";
    }

    let queueCounts: any = {};
    try {
      queueCounts = await emailQueue.getJobCounts();
    } catch {}

    return {
      server: "running",
      database: "connected",
      timestamp: new Date(),
      redis: redisStatus,
      queue: queueCounts,
    } as any;
  }
}

export default new HealthService();
