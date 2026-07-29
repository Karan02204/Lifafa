import prisma from "../config/prisma";
import type { CreateEmailInput } from "../validators/email.validator";
import { emailQueueService } from "../queues/email.queue";
import type { Email } from "../generated/prisma/client";

class EmailService {
  create = async (userId: number, data: CreateEmailInput): Promise<Email> => {
    const email = await prisma.email.create({
      data: {
        userId,
        ...data,
      },
    });

    let job;
    try {
      job = await emailQueueService.schedule(email.id, email.scheduledAt);
    } catch (error) {
      await prisma.email.delete({
        where: {
          id: email.id,
        },
      });

      throw error;
    }

    try {
      await prisma.email.update({
        where: {
          id: email.id,
        },
        data: {
          jobId: String(job.id),
        },
      });
    } catch (error) {
      await job.remove();

      throw error;
    }

    email.jobId = String(job.id);

    return email;
  };

  async getAllEmails(userId: number) {
    //get all the emails for the current User
    return await prisma.email.findMany({
      where: {
        userId,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async getEmailById(id: number, userId: number) { //get the single email with the particular ID
    const email = await prisma.email.findFirst({
      where: {
        id,
        userId,
      },
    });

    return email;
  }
}

export const emailService = new EmailService();
