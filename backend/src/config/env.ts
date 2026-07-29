import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  DATABASE_HOST: process.env.DATABASE_HOST!,
  DATABASE_PORT: Number(process.env.DATABASE_PORT),
  DATABASE_USER: process.env.DATABASE_USER!,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
  DATABASE_NAME: process.env.DATABASE_NAME!,

  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

  JWT_SECRET: process.env.JWT_SECRET!,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM
};
