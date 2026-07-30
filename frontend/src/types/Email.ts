export type EmailStatus = "PENDING" | "SENT" | "FAILED";

export interface Sender {
  id: number;
  email: string;
  name?: string;
}

export interface Email {
  id: number;
  recipient: string;
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