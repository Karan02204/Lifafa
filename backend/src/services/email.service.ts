import prisma from "../config/prisma";
import type { CreateEmailInput } from "../validators/email.validator";
import { emailQueueService } from "../queues/email.queue";
import type { Email } from "../generated/prisma/client";

class EmailService {
  private async scheduleEmail(emailId: number, scheduledAt: Date): Promise<string>{ // Extracted logic to schedule the job and return the jobID
    let job;
    try {
      job = await emailQueueService.schedule(emailId, scheduledAt);
    } catch (error) {
      await prisma.email.delete({
        where: {
          id: emailId,
        },
      });
  
      throw error;
    }
  
    try {
      await prisma.email.update({
        where: {
          id: emailId,
        },
        data: {
          jobId: String(job.id),
        },
      });
    } catch (error) {
      await job.remove();
  
      throw error;
    }
  
    return String(job.id);
  }

  create = async (userId: number, data: CreateEmailInput): Promise<Email> => { // create the email
    const email = await prisma.email.create({
      data: {
        userId,
        ...data,
      },
    });

    email.jobId = await this.scheduleEmail(email.id, email.scheduledAt);
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

  async getEmailById(id: number, userId: number) {
    //get the single email with the particular ID
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
