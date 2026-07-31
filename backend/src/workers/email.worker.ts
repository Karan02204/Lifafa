import { Worker } from "bullmq";
import { redis } from "../config/redis";
import type { EmailJobData } from "../queues/email.queue";
import type { Job } from "bullmq";
import prisma from "../config/prisma";
import { EmailStatus, RecipientStatus } from "../generated/prisma/enums";
import { mailService } from "../services/mail.service";
import { env } from "../config/env";
import { rateLimiterService } from "../services/rate-limiter.service";
import { emailService } from "../services/email.service";

export const emailWorker = new Worker(
  "email-queue",
  async (job: Job<EmailJobData>) => {
    const email = await prisma.email.findUnique({
      where: {
        id: job.data.emailId,
      },
      include: {
        sender: true,
        recipients: true,
      },
    });

    if (!email) {
      return;
    }

    if (email.status !== EmailStatus.PENDING) {
      return;
    }

    const permit = await rateLimiterService.acquirePermit(email.userId);

    if (!permit.allowed) {
      await emailService.rescheduleEmail(email, permit.retryAfter!);
      return;
    }

    await prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        status: EmailStatus.PROCESSING,
      },
    });

    let successCount = 0;
    let failedCount = 0;

    for (const recipient of email.recipients) {
      await prisma.emailRecipient.update({
        where: {
          id: recipient.id,
        },
        data: {
          status: RecipientStatus.PROCESSING,
        },
      });

      try {
        await mailService.send(email, recipient.emailAddress);

        successCount++;

        await prisma.emailRecipient.update({
          where: {
            id: recipient.id,
          },
          data: {
            status: RecipientStatus.SENT,
            sentAt: new Date(),
            attempts: {
              increment: 1,
            },
            error: null,
          },
        });
      } catch (error) {
        failedCount++;

        await prisma.emailRecipient.update({
          where: {
            id: recipient.id,
          },
          data: {
            status: RecipientStatus.FAILED,
            attempts: {
              increment: 1,
            },
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });

        continue;
      }
    }

    const totalRecipients = email.recipients.length;

    let finalStatus: EmailStatus;

    if (successCount === totalRecipients) {
      finalStatus = EmailStatus.COMPLETED;
    } else if (failedCount === totalRecipients) {
      finalStatus = EmailStatus.FAILED;
    } else {
      finalStatus = EmailStatus.PARTIAL_SUCCESS;
    }

    await prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        status: finalStatus,
        sentAt: new Date(),
      },
    });
  },
  {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
  },
);
