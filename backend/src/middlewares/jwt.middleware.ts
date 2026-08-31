import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthPayload } from "../types/auth.type";
import { redis } from "../config/redis";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  // Support both Authorization header and httpOnly cookie
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if ((req as any).cookies?.token) {
    token = (req as any).cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing.",
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload & { jti?: string };

    // Check blacklist (logout)
    if (payload.jti) {
      const blacklisted = await redis.get(`blacklist:${payload.jti}`);
      if (blacklisted) {
        return res.status(401).json({ success: false, message: "Token revoked. Please login again." });
      }
    }

    req.currentUser = { id: payload.id, email: payload.email } as any;
    // attach jti for logout
    (req as any).tokenJti = payload.jti;
    (req as any).rawToken = token;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
