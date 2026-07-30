import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { env } from "../config/env";
import prisma from "../config/prisma";

export class AuthController {
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.handleGoogleLogin(req.user!);

    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(result.token)}`,
    );
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getCurrentUser(req.currentUser!.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    res.json({
      success: true,
      user,
    });
  };
}

export const authController  = new AuthController();