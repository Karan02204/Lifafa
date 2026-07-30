import { z } from "zod";

export const createEmailSchema = z.object({
  senderId: z.number().int().positive(),
  recipients: z
    .array(z.string().trim().email())
    .min(1, "At least one recipient is required"),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(255, "Subject cannot exceed 255 characters."),

  body: z.string().trim().min(1, "Body is required."),

  scheduledAt: z.coerce.date().refine((date) => date.getTime() > Date.now(), {
    message: "Scheduled time must be in the future.",
  }),
});

export type CreateEmailInput = z.infer<typeof createEmailSchema>;
