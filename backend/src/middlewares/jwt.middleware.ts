import type {Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { AuthPayload } from "../types/auth.type";


export const authenticate = (
    req: Request,
    res: Response,
    next : NextFunction
) =>{

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            success : false,
            message: "Authorization header missing."
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header.",
      });
    }

    const token  = authHeader.split(" ")[1]!;

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;

      req.currentUser = payload;
      next();

    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

};