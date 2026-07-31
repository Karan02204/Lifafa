export type EmailStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "PARTIAL_SUCCESS"
  | "FAILED";

export type RecipientStatus = "PENDING" | "PROCESSING" | "SENT" | "FAILED";

export interface Sender {
  id: number;
  email: string;
  name?: string;
}

export interface EmailRecipient {
  id: number;
  emailAddress: string;
  status: RecipientStatus;
  attempts: number;
  sentAt: string | null;
  error: string | null;
}

export interface Email {
  id: number;
  recipients: EmailRecipient[];
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt: string | null;
  status: EmailStatus;
  senderId: number;
  sender: Sender;
  createdAt: string;
  updatedAt: string;
}
