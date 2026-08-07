import { Router } from "express";
import { authenticate } from "../middlewares/jwt.middleware";
import { asyncHandler } from "../utils/async-handler";
import { senderController } from "../controllers/sender.controller";

const router = Router();

router.get("/", authenticate, asyncHandler(senderController.getAllSenders));
router.post("/", authenticate, asyncHandler(senderController.createSender));
router.delete("/:id", authenticate, asyncHandler(senderController.deleteSender));

export default router;
