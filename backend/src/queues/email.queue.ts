import { Queue } from "bullmq";
import type { Job } from "bullmq";
import { redis } from "../config/redis";

export const emailQueue = new Queue("email-queue", {
  connection: redis,
});

export interface EmailJobData {
  emailId: number;
}

export class EmailQueue {
  schedule = async (
    emailId: number,
    scheduledAt: Date,
  ): Promise<Job<EmailJobData>> => {
    const delay = scheduledAt.getTime() - Date.now();

    return emailQueue.add(
      "send-email",
      {
        emailId,
      },
      {
        delay,
      },
    );
  };
}

export const emailQueueService = new EmailQueue();