import { Router } from "express";
import { authenticate } from "../middlewares/jwt.middleware";
import { asyncHandler } from "../utils/async-handler";
import { emailController } from "../controllers/email.controller";

const router = Router();

router.post("/", authenticate, asyncHandler(emailController.create));
router.get("/", authenticate, emailController.getAllEmails);
router.get("/:id", authenticate, emailController.getEmailById);
export default router;
