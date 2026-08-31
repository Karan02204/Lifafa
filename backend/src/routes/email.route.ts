import { Router } from "express";
import { authenticate } from "../middlewares/jwt.middleware";
import { asyncHandler } from "../utils/async-handler";
import { emailController } from "../controllers/email.controller";

const router = Router();

router.post("/", authenticate, asyncHandler(emailController.create));
router.get("/", authenticate, asyncHandler(emailController.getAllEmails));
router.get("/:id", authenticate, asyncHandler(emailController.getEmailById));
router.patch("/:id", authenticate, asyncHandler(emailController.updateEmail));
router.delete("/:id", authenticate, asyncHandler(emailController.deleteEmail));

export default router;
