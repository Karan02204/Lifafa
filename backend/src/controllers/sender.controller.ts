import type { Request, Response } from "express";
import { senderService } from "../services/sender.service";
import { z } from "zod";

const createSenderSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email(),
  password: z.string().min(1, "Password required"),
});

class SenderController {
  async getAllSenders(req: Request, res: Response) {
    const userId = req.currentUser!.id;
    const senders = await senderService.getAllSenders(userId);
    return res.status(200).json({ success: true, data: senders });
  }

  async createSender(req: Request, res: Response) {
    const userId = req.currentUser!.id;
    const data = createSenderSchema.parse(req.body);
    const sender = await senderService.createSender(userId, data);
    return res.status(201).json({ success: true, data: sender });
  }

  async deleteSender(req: Request, res: Response) {
    const userId = req.currentUser!.id;
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Invalid id" });
    await senderService.deleteSender(userId, id);
    return res.status(200).json({ success: true, message: "Sender deleted" });
  }
}

export const senderController = new SenderController();
