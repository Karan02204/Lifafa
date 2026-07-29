import prisma from "../config/prisma";
import type { CreateEmailInput } from "../validators/email.validator";
import { emailQueueService } from "../queues/email.queue";
import type { Email } from "../generated/prisma/client";
import { EmailStatus } from "../generated/prisma/client";
import { emailQueue } from "../queues/email.queue";
class EmailService {
  private async scheduleEmail(
    emailId: number,
    scheduledAt: Date,
  ): Promise<string> {
    // Extracted logic to schedule the job and return the jobID
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
  private async getOwnedEmail(id: number, userId: number) {
    const email = await prisma.email.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!email) {
      throw new Error("Email not found.");
    }

    return email;
  }

  private async removeScheduledJob(jobId: string | null) {
    if (!jobId) return;

    const job = await emailQueue.getJob(jobId);

    if (job) {
      await job.remove();
    }
  }

  create = async (userId: number, data: CreateEmailInput): Promise<Email> => {
    // create the email
    const sender = await prisma.sender.findFirst({
      where: {
        id: data.senderId,
        userId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found.");
    }

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
    return this.getOwnedEmail(id, userId);
  }

  async updateEmail(id: number, userId: number, data: CreateEmailInput) {
    //update the email
    const email = await this.getOwnedEmail(id, userId);

    if (email.status !== EmailStatus.PENDING) {
      throw new Error("Only pending emails can be updated.");
    }

    await this.removeScheduledJob(email.jobId);

    const sender = await prisma.sender.findFirst({
      where: {
        id: data.senderId,
        userId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found.");
    }

    const updatedEmail = await prisma.email.update({
      where: {
        id,
      },
      data: {
        senderId: data.senderId,
        recipient: data.recipient,
        subject: data.subject,
        body: data.body,
        scheduledAt: data.scheduledAt,
      },
    });

    try {
      updatedEmail.jobId = await this.scheduleEmail(
        updatedEmail.id,
        updatedEmail.scheduledAt,
      );

      return updatedEmail;
    } catch (error) {
      await prisma.email.update({
        where: {
          id,
        },
        data: {
          status: EmailStatus.FAILED,
        },
      });

      throw error;
    }
  }

  async deleteEmail(id: number, userId: number) {
    //delete the email
    const email = await this.getOwnedEmail(id, userId);

    if (email.status !== EmailStatus.PENDING) {
      throw new Error("Only pending emails can be deleted.");
    }

    await this.removeScheduledJob(email.jobId);

    await prisma.email.delete({
      where: {
        id,
      },
    });
  }

  async rescheduleEmail(email: Email, retryAfter: number) {
    const newScheduledAt = new Date(Date.now() + retryAfter);

    const job = await emailQueueService.schedule(email.id, newScheduledAt);

    try {
      const result = await prisma.email.updateMany({
        where: {
          id: email.id,
          jobId: email.jobId,
          status: EmailStatus.PENDING,
        },
        data: {
          scheduledAt: newScheduledAt,
          jobId: String(job.id),
        },
      });

      if (result.count === 0) {
        await job.remove();
      }
    } catch (error) {
      await job.remove();
      throw error;
    }
  }
}

export const emailService = new EmailService();
