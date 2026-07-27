import { Router } from "express";
import passport from "../config/passport";
import { authController } from "../controllers/auth.controller";
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


export default router;