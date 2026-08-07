import { z } from "zod";

export const createEmailSchema = z.object({
  senderId: z.number().int().positive(),
  recipients: z
    .array(z.string().trim().email())
    .min(1, "At least one recipient is required")
    .max(1000, "Too many recipients (max 1000)"),
  subject: z.string().trim().min(1, "Subject is required.").max(255),
  body: z.string().trim().min(1, "Body is required.").max(50000),
  scheduledAt: z.coerce.date().refine((date) => date.getTime() > Date.now() - 60000, {
    message: "Scheduled time must be in the future.",
  }),
});

export type CreateEmailInput = z.infer<typeof createEmailSchema>;

export const emailQuerySchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "PARTIAL_SUCCESS", "FAILED"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
});
