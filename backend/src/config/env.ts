import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  DATABASE_HOST: z.string().default("localhost"),
  DATABASE_PORT: z.coerce.number().default(3306),
  DATABASE_USER: z.string().default("root"),
  DATABASE_PASSWORD: z.string().default("password"),
  DATABASE_NAME: z.string().default("email_scheduler"),
  DATABASE_URL: z.string().optional(),

  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  JWT_SECRET: z.string().default("dev_jwt_secret_change_in_prod"),
  ENCRYPTION_KEY: z.string().optional(),

  SMTP_HOST: z.string().default("smtp.ethereal.email"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_FROM: z.string().optional(),

  WORKER_CONCURRENCY: z.coerce.number().default(3),
  MAX_EMAILS_PER_HOUR: z.coerce.number().default(100),
  MIN_DELAY_BETWEEN_EMAILS: z.coerce.number().default(1000),

  FRONTEND_URL: z.string().default("http://localhost:5173"),
  BACKEND_URL: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  // Don't crash in dev, just warn — but throw in production
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = (parsed.success ? parsed.data : envSchema.parse({})) as z.infer<
  typeof envSchema
>;

// Helper to build DATABASE_URL if not provided (for Prisma)
if (!env.DATABASE_URL) {
  (env as any).DATABASE_URL =
    `mysql://${env.DATABASE_USER}:${encodeURIComponent(env.DATABASE_PASSWORD)}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
}
