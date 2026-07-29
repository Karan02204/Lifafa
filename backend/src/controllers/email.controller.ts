import type { Request, Response } from "express";
import { createEmailSchema } from "../validators/email.validator";
import { emailService } from "../services/email.service";
import { success } from "zod";

class EmailController {
  create = async (req: Request, res: Response) => {
    const data = createEmailSchema.parse(req.body);

    const email = await emailService.create(req.currentUser!.id, data);

    return res.status(201).json({
      success: true,
      data: email,
    });
  };

  async getAllEmails(req: Request, res: Response) {
    const userId = req.currentUser.id;

    const emails = await emailService.getAllEmails(userId);

    res.status(200).json({
      success: true,
      data: emails,
    });
  }

  async getEmailById(req: Request , res: Response){
    const userId = req.currentUser.id;
    const id = Number(req.params.id);
    const email = await emailService.getEmailById(id , userId);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    res.status(200).json({
      success: true,
      data: email,
    });
  }
}

export const emailController = new EmailController();
