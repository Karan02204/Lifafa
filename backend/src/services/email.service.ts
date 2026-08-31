import prisma from "../config/prisma";
import type { CreateEmailInput } from "../validators/email.validator";
import { emailQueueService } from "../queues/email.queue";
import type { Email } from "../generated/prisma/client";
import { EmailStatus } from "../generated/prisma/client";
import { emailQueue } from "../queues/email.queue";
import AppError from "../utils/app-error";

class EmailService {
  private async scheduleEmail(emailId: number, scheduledAt: Date): Promise<string> {
    let job;
    try {
      job = await emailQueueService.schedule(emailId, scheduledAt);
    } catch (error) {
      await prisma.email.update({
        where: { id: emailId },
        data: { status: EmailStatus.FAILED },
      });
      throw error;
    }

    try {
      await prisma.email.update({
        where: { id: emailId },
        data: { jobId: String(job.id) },
      });
    } catch (error) {
      await job.remove().catch(() => {});
      throw error;
    }

    return String(job.id);
  }

  private async getOwnedEmail(id: number, userId: number) {
    const email = await prisma.email.findFirst({
      where: { id, userId },
      include: { sender: true, recipients: true },
    });
    if (!email) throw new AppError("Email not found.", 404);
    return email;
  }

  private async removeScheduledJob(jobId: string | null) {
    if (!jobId) return;
    const job = await emailQueue.getJob(jobId);
    if (job) await job.remove().catch(() => {});
  }

  create = async (userId: number, data: CreateEmailInput): Promise<Email> => {
    const sender = await prisma.sender.findFirst({ where: { id: data.senderId, userId } });
    if (!sender) throw new AppError("Sender not found.", 404);

    // Deduplicate recipients
    const uniqueRecipients = Array.from(new Set(data.recipients.map((r) => r.toLowerCase().trim())));

    const email = await prisma.$transaction(async (tx: any) => {
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
        data: uniqueRecipients.map((emailAddress) => ({
          emailId: createdEmail.id,
          emailAddress,
        })),
      });
      return createdEmail;
    });

    email.jobId = await this.scheduleEmail(email.id, email.scheduledAt);
    return email;
  };

  async getAllEmails(
    userId: number,
    opts: { status?: EmailStatus | undefined; page?: number | undefined; limit?: number | undefined; search?: string | undefined },
  ) {
    const page = opts.page ?? 1;
    const limit = Math.min(opts.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (opts.status) where.status = opts.status;
    if (opts.search) {
      where.OR = [
        { subject: { contains: opts.search } },
        { body: { contains: opts.search } },
      ];
    }

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        include: { sender: true, recipients: true },
        orderBy: { scheduledAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.email.count({ where }),
    ]);

    return {
      data: emails,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getEmailById(id: number, userId: number) {
    return this.getOwnedEmail(id, userId);
  }

  async updateEmail(id: number, userId: number, data: CreateEmailInput) {
    const email = await this.getOwnedEmail(id, userId);
    if (email.status !== EmailStatus.PENDING) {
      throw new AppError("Only pending emails can be updated.", 400);
    }

    await this.removeScheduledJob(email.jobId);

    const sender = await prisma.sender.findFirst({ where: { id: data.senderId, userId } });
    if (!sender) throw new AppError("Sender not found.", 404);

    const uniqueRecipients = Array.from(new Set(data.recipients.map((r) => r.toLowerCase().trim())));

    const updatedEmail = await prisma.$transaction(async (tx: any) => {
      const e = await tx.email.update({
        where: { id },
        data: {
          senderId: data.senderId,
          subject: data.subject,
          body: data.body,
          scheduledAt: data.scheduledAt,
        },
      });
      await tx.emailRecipient.deleteMany({ where: { emailId: id } });
      await tx.emailRecipient.createMany({
        data: uniqueRecipients.map((emailAddress) => ({ emailId: id, emailAddress })),
      });
      return e;
    });

    updatedEmail.jobId = await this.scheduleEmail(updatedEmail.id, updatedEmail.scheduledAt);
    return updatedEmail;
  }

  async deleteEmail(id: number, userId: number) {
    const email = await this.getOwnedEmail(id, userId);
    if (email.status !== EmailStatus.PENDING && email.status !== EmailStatus.FAILED) {
      throw new AppError("Only pending or failed emails can be deleted.", 400);
    }
    await this.removeScheduledJob(email.jobId);
    await prisma.email.delete({ where: { id } });
  }

  async rescheduleEmail(email: Email, retryAfter: number) {
    const newScheduledAt = new Date(Date.now() + retryAfter);
    const job = await emailQueueService.schedule(email.id, newScheduledAt);
    try {
      const result = await prisma.email.updateMany({
        where: { id: email.id, jobId: email.jobId, status: EmailStatus.PENDING },
        data: { scheduledAt: newScheduledAt, jobId: String(job.id) },
      });
      if (result.count === 0) await job.remove().catch(() => {});
    } catch (error) {
      await job.remove().catch(() => {});
      throw error;
    }
  }

  // For cron recovery: re-queue stale PROCESSING jobs
  async recoverStaleJobs() {
    const stale = await prisma.email.findMany({
      where: { status: EmailStatus.PROCESSING, updatedAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
    });
    for (const e of stale) {
      await prisma.email.update({ where: { id: e.id }, data: { status: EmailStatus.PENDING } });
      await this.scheduleEmail(e.id, new Date(Date.now() + 5000));
    }
  }
}

export const emailService = new EmailService();
