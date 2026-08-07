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
      where: { id: job.data.emailId },
      include: { sender: true, recipients: true },
    });

    if (!email) return;
    if (email.status !== EmailStatus.PENDING) return;

    await prisma.email.update({
      where: { id: email.id },
      data: { status: EmailStatus.PROCESSING },
    });

    let successCount = 0;
    let failedCount = 0;

    for (const recipient of email.recipients) {
      // Skip already sent (idempotency if job retried)
      if (recipient.status === RecipientStatus.SENT) {
        successCount++;
        continue;
      }

      // Per-recipient rate limiting
      const permit = await rateLimiterService.acquirePermit(email.userId);
      if (!permit.allowed) {
        // Reschedule remaining work
        await emailService.rescheduleEmail(email, permit.retryAfter!);
        // Revert status to PENDING so rescheduled job can run
        await prisma.email.update({
          where: { id: email.id },
          data: { status: EmailStatus.PENDING },
        });
        return;
      }

      await prisma.emailRecipient.update({
        where: { id: recipient.id },
        data: { status: RecipientStatus.PROCESSING },
      });

      try {
        await mailService.send(email, recipient.emailAddress);
        successCount++;
        await prisma.emailRecipient.update({
          where: { id: recipient.id },
          data: {
            status: RecipientStatus.SENT,
            sentAt: new Date(),
            attempts: { increment: 1 },
            error: null,
          },
        });
      } catch (error) {
        failedCount++;
        await prisma.emailRecipient.update({
          where: { id: recipient.id },
          data: {
            status: RecipientStatus.FAILED,
            attempts: { increment: 1 },
            error: error instanceof Error ? error.message : "Unknown error",
          },
        });
        continue;
      }

      // Respect MIN_DELAY_BETWEEN_EMAILS between recipients (already via rate limiter lock, but small buffer)
      // No extra sleep needed — next loop iteration will hit the Redis lock if too soon and reschedule
    }

    const totalRecipients = email.recipients.length;
    let finalStatus: EmailStatus;
    if (successCount === totalRecipients) finalStatus = EmailStatus.COMPLETED;
    else if (failedCount === totalRecipients) finalStatus = EmailStatus.FAILED;
    else finalStatus = EmailStatus.PARTIAL_SUCCESS;

    await prisma.email.update({
      where: { id: email.id },
      data: { status: finalStatus, sentAt: new Date() },
    });
  },
  {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
    lockDuration: 30000,
  },
);

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
  // If job exhausted retries, mark email as FAILED
  if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
    prisma.email
      .updateMany({
        where: { id: job.data.emailId, status: EmailStatus.PROCESSING },
        data: { status: EmailStatus.FAILED },
      })
      .catch(() => {});
  }
});
