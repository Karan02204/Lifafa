import prisma from "../config/prisma";
import type { HealthResponse } from "../types/health.types";

class healthService {

    async check() : Promise<HealthResponse> {

        await prisma.$queryRaw`SELECT 1`;

        return {
            server: "running",
            database: "connected",
            timestamp: new Date(),
        };
    }

}

export default new healthService();