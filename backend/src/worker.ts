import "./workers/email.worker";
import { emailWorker } from "./workers/email.worker";
import prisma from "./config/prisma";
import { redis } from "./config/redis";
import { mailService } from "./services/mail.service";

console.log("📧 Email Worker Starting...");

emailWorker.on("ready", () => console.log("✅ Worker connected to Redis"));
emailWorker.on("active", (job) => console.log(`🚀 Active: ${job.id} (email ${job.data.emailId})`));
emailWorker.on("completed", (job) => console.log(`✅ Completed: ${job.id}`));
emailWorker.on("failed", (job, err) => console.log(`❌ Failed: ${job?.id}`, err.message));
emailWorker.on("error", (err) => console.error("Worker Error:", err));

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing worker...`);
  await emailWorker.close().catch(() => {});
  await mailService.closeAll().catch(() => {});
  await prisma.$disconnect().catch(() => {});
  await redis.quit().catch(() => {});
  console.log("✅ Worker shutdown complete");
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
