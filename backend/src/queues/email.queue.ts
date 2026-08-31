import { Queue } from "bullmq";
import type { Job } from "bullmq";
import { redis } from "../config/redis";

export const emailQueue = new Queue("email-queue", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  },
});

export interface EmailJobData {
  emailId: number;
}

export class EmailQueue {
  schedule = async (emailId: number, scheduledAt: Date): Promise<Job<EmailJobData>> => {
    const rawDelay = scheduledAt.getTime() - Date.now();
    const delay = Math.max(0, rawDelay);

    return emailQueue.add(
      "send-email",
      { emailId },
      {
        delay,
        jobId: `email-${emailId}-${Date.now()}`, // unique per schedule to allow reschedule
      },
    );
  };
}

export const emailQueueService = new EmailQueue();
