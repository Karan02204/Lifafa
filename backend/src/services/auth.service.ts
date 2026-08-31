import type { Profile } from "passport-google-oauth20";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { User } from "../types/user.type";
import crypto from "node:crypto";

interface LoginResponse {
  user: User;
  token: string;
}

export class AuthService {
  async handleGoogleLogin(profile: Profile): Promise<LoginResponse> {
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error("Google account has no email.");

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0]?.value ?? null,
        },
      });
    } else {
      // Keep avatar/name in sync
      const newAvatar = profile.photos?.[0]?.value ?? user.avatar;
      const newName = profile.displayName ?? user.name;
      if (newAvatar !== user.avatar || newName !== user.name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: newAvatar, name: newName },
        });
      }
    }

    const jti = crypto.randomUUID();
    const token = jwt.sign({ id: user.id, email: user.email, jti }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { user, token };
  }

  async getCurrentUser(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}

export const authService = new AuthService();
