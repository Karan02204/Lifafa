import { Worker } from "bullmq";
import { redis } from "../config/redis";
import type { EmailJobData } from "../queues/email.queue";
import type { Job } from "bullmq";
import prisma from "../config/prisma";
import { EmailStatus } from "../generated/prisma/enums";
import { mailService } from "../services/mail.service";
import { env } from "../config/env";
import { rateLimiterService } from "../services/rate-limiter.service";
import { emailService } from "../services/email.service";

export const emailWorker = new Worker(
  "email-queue",
  async (job: Job<EmailJobData>) => {
    // console.log("Job received:", job.id);

    const email = await prisma.email.findUnique({
      // fetching the email from the database with the emailID from the job
      where: {
        id: job.data.emailId,
      },
    });

    if (!email) {
      //If no email return
      return;
    }

    if (email.status === EmailStatus.CANCELLED) {
      // CANCELLED emails should not be sent
      return;
    }

    if (email.status !== EmailStatus.PENDING) {
      // Only Pending Emails should be sent
      return;
    }


    try {
      const permit = await rateLimiterService.acquirePermit(email.userId);

      if (!permit.allowed) {
        await emailService.rescheduleEmail(email, permit.retryAfter!);
        return;
      }

      await prisma.email.update({
        // Updating the email status to PROCESSING
        where: {
          id: email.id,
        },
        data: {
          status: EmailStatus.PROCESSING,
        },
      });
      
      await mailService.send(email); // sending the email

      await prisma.email.update({
        // Updating the email status to SENT
        where: {
          id: email.id,
        },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      await prisma.email.update({
        //If the SMTP service is down set the status to FAILED
        where: {
          id: email.id,
        },
        data: {
          status: EmailStatus.FAILED,
        },
    });

      throw error;
    }
  },
  {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
    limiter: {
      max: 1,
      duration: 2000,
    },
  },
);
