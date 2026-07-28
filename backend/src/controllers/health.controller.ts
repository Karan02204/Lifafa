import type { Request , Response } from "express";
import ApiResponse from "../utils/api-response";
import healthService from "../services/health.service";

class HealthController{

    async check(req: Request , res: Response){

        const health = await healthService.check();

        return ApiResponse.success(
            res,
            "Application is healthy",
            health
        );

    }

}

export default new HealthController();