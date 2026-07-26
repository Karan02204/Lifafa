import { env } from "./env";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,

  allowPublicKeyRetrieval: true, // Required for MySQL 8+ when using caching_sha2_password authentication.
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
