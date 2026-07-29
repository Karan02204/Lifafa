import type { Request, Response } from "express";
import { createEmailSchema } from "../validators/email.validator";
import { emailService } from "../services/email.service";

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

  async getEmailById(req: Request, res: Response) {
    const userId = req.currentUser.id;
    const id = Number(req.params.id);
    const email = await emailService.getEmailById(id, userId);


    res.status(200).json({
      success: true,
      data: email,
    });
  }

  async updateEmail(req: Request, res: Response) {
    const emailId = Number(req.params.id);
    const userId = req.currentUser!.id;

    const updatedEmail = await emailService.updateEmail(
      emailId,
      userId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: updatedEmail,
    });
  }

  async deleteEmail(req: Request, res: Response) {
    const emailId = Number(req.params.id);
    const userId = req.currentUser!.id;

    await emailService.deleteEmail(emailId, userId);

    return res.status(200).json({
      success: true,
      message: "Email deleted successfully.",
    });
  }
}

export const emailController = new EmailController();
