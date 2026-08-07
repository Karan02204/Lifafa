import { Router } from "express";
import passport from "../config/passport";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/jwt.middleware";
const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failure",
  }),
  authController.googleCallback,
);

router.get("/failure", authController.failure);
router.get("/me", authenticate, authController.me);
router.post("/logout", authenticate, authController.logout);

export default router;
