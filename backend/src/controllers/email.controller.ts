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
}

export const emailController = new EmailController();
