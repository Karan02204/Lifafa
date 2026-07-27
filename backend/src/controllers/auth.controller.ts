import type { Request, Response } from "express";
import { authService } from "../services/auth.service";

export class AuthController {
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.handleGoogleLogin(req.user!);

    res.status(200).json({
      success: true,
      ...result,
    });
  };
}

export const authController  = new AuthController();