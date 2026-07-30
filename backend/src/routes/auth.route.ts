import { Router } from "express";
import passport from "../config/passport";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/jwt.middleware";
const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),

  authController.googleCallback,
);

router.get("/me", authenticate, authController.me);

export default router;