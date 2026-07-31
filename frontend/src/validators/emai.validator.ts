import { z } from "zod";

export const createEmailSchema = z.object({
  senderId: z.number().positive(),
  recipients: z
    .array(z.string().trim().email())
    .min(1, "At least one recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  scheduledAt: z.date(),
});

export type CreateEmailInput = z.infer<typeof createEmailSchema>;