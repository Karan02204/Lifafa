import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { env } from "../config/env";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis";

export class AuthController {
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    const result = await authService.handleGoogleLogin(req.user!);

    // Set httpOnly cookie (primary) + keep query param for backwards compatibility / cross-site preview
    const isProd = env.NODE_ENV === "production";
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Redirect with token as query param so frontend on different origin can still capture it
    // Frontend will then switch to cookie-based auth via withCredentials
    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?token=${encodeURIComponent(result.token)}`,
    );
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await authService.getCurrentUser(req.currentUser!.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    res.json({ success: true, user });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = (req as any).rawToken as string | undefined;
      if (token) {
        const decoded = jwt.decode(token) as any;
        if (decoded?.jti && decoded?.exp) {
          const ttl = decoded.exp * 1000 - Date.now();
          if (ttl > 0) {
            await redis.set(`blacklist:${decoded.jti}`, "1", "PX", ttl);
          }
        }
      }
    } catch {}
    res.clearCookie("token", { path: "/" });
    res.json({ success: true, message: "Logged out" });
  };

  failure = async (_req: Request, res: Response): Promise<void> => {
    res.status(401).json({ success: false, message: "Google authentication failed" });
  };
}

export const authController = new AuthController();
