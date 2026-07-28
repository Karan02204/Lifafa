import { z } from "zod";

export const createEmailSchema = z.object({
  recipient: z.string().email("Invalid email address."),

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
