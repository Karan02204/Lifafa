import type { Request, Response } from "express";
import { createEmailSchema, emailQuerySchema } from "../validators/email.validator";
import { emailService } from "../services/email.service";

class EmailController {
  create = async (req: Request, res: Response) => {
    const data = createEmailSchema.parse(req.body);
    const email = await emailService.create(req.currentUser!.id, data);
    return res.status(201).json({ success: true, data: email });
  };

  getAllEmails = async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const parsed = emailQuerySchema.parse(req.query);
    const result = await emailService.getAllEmails(userId, parsed as any);
    res.status(200).json({ success: true, ...result });
  };

  getEmailById = async (req: Request, res: Response) => {
    const userId = req.currentUser!.id;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const email = await emailService.getEmailById(id, userId);
    res.status(200).json({ success: true, data: email });
  };

  updateEmail = async (req: Request, res: Response) => {
    const emailId = Number(req.params.id);
    const userId = req.currentUser!.id;
    const data = createEmailSchema.parse(req.body);
    const updatedEmail = await emailService.updateEmail(emailId, userId, data);
    return res.status(200).json({ success: true, data: updatedEmail });
  };

  deleteEmail = async (req: Request, res: Response) => {
    const emailId = Number(req.params.id);
    const userId = req.currentUser!.id;
    await emailService.deleteEmail(emailId, userId);
    return res.status(200).json({ success: true, message: "Email deleted successfully." });
  };
}

export const emailController = new EmailController();
