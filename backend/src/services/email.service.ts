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
      await prisma.email.update({
        where: {
          id: emailId,
        },
        data: {
          status: EmailStatus.FAILED,
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
      include: {
        sender: true,
        recipients: true,
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
    // Validate that the sender belongs to the current user
    const sender = await prisma.sender.findFirst({
      where: {
        id: data.senderId,
        userId,
      },
    });

    if (!sender) {
      throw new Error("Sender not found.");
    }

    // Create email and all recipients atomically
    const email = await prisma.$transaction(async (tx) => {
      const createdEmail = await tx.email.create({
        data: {
          userId,
          senderId: data.senderId,
          subject: data.subject,
          body: data.body,
          scheduledAt: data.scheduledAt,
        },
      });

      await tx.emailRecipient.createMany({
        data: data.recipients.map((recipient) => ({
          emailId: createdEmail.id,
          emailAddress: recipient,
        })),
      });

      return createdEmail;
    });

    // Schedule only after the transaction succeeds
    email.jobId = await this.scheduleEmail(email.id, email.scheduledAt);
    return email;
  };

  async getAllEmails(userId: number, status?: EmailStatus) {
    //get all the emails for the current User
    return await prisma.email.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      include: {
        sender: true,
        recipients: true,
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

    const updatedEmail = await prisma.$transaction(async (tx) => {
      const email = await tx.email.update({
        where: {
          id,
        },
        data: {
          senderId: data.senderId,
          subject: data.subject,
          body: data.body,
          scheduledAt: data.scheduledAt,
        },
      });

      await tx.emailRecipient.deleteMany({
        where: {
          emailId: id,
        },
      });

      await tx.emailRecipient.createMany({
        data: data.recipients.map((recipient) => ({
          emailId: id,
          emailAddress: recipient,
        })),
      });

      return email;
    });

    updatedEmail.jobId = await this.scheduleEmail(
      updatedEmail.id,
      updatedEmail.scheduledAt,
    );

    return updatedEmail;
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
