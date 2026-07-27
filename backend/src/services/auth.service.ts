import type { Profile } from "passport-google-oauth20";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { User } from "../types/user.type";

interface LoginResponse {
  user: User;
  token: string;
}

export class AuthService {
  async handleGoogleLogin(profile: Profile): Promise<LoginResponse> {
    let user = await prisma.user.findUnique({
      where: {
        googleId: profile.id,
      },
    });

    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new Error("Google account has no email.");
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          name: profile.displayName,
          email: email,
          avatar: profile.photos?.[0]?.value ?? null,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return {
      user,
      token,
    };
  }
}

export const authService = new AuthService();
