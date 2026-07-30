import type { Request, Response } from "express";
import { senderService } from "../services/sender.service";

class SenderController {
  async getAllSenders(req: Request, res: Response) {
    const userId = req.currentUser!.id;

    const senders = await senderService.getAllSenders(userId);

    return res.status(200).json({
      success: true,
      data: senders,
    });
  }
}

export const senderController = new SenderController();
