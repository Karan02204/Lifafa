import app from "./app";
import prisma from "./config/prisma";
import { env } from "./config/env";
import { redis } from "./config/redis";

const PORT = env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    // Verify redis
    try {
      await redis.ping();
      console.log("✅ Redis connected");
    } catch (e) {
      console.warn("⚠️ Redis not ready:", (e as Error).message);
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(async () => {
        await prisma.$disconnect().catch(() => {});
        await redis.quit().catch(() => {});
        console.log("✅ Shutdown complete");
        process.exit(0);
      });
      // Force exit after 10s
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
