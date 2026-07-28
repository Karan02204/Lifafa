import prisma from "../config/prisma";
import type { CreateEmailInput } from "../validators/email.validator";

class EmailService {
  create = async (userId: number, data: CreateEmailInput) => {
    const email = await prisma.email.create({
      data: {
        userId,
        recipient: data.recipient,
        subject: data.subject,
        body: data.body,
        scheduledAt: data.scheduledAt,
      },
    });

    return email;
  };
}

export const emailService = new EmailService();
