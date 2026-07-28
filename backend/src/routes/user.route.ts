import { Router } from "express";
import { authenticate } from "../middlewares/jwt.middleware";
import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/profile", authenticate, userController.profile);

export default router;
