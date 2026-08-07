import prisma from "../config/prisma";
import { encrypt, decrypt, isEncrypted } from "../utils/encryption";
import { mailService } from "./mail.service";
import AppError from "../utils/app-error";

class SenderService {
  async getAllSenders(userId: number) {
    const senders = await prisma.sender.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    // Don't expose decrypted password to frontend
    return senders.map((s: any) => ({ ...s, password: "••••••••" }));
  }

  async createSender(userId: number, data: { name: string; email: string; password: string }) {
    // Verify SMTP credentials before saving
    const tempSender = { id: -1, email: data.email, password: data.password } as any;
    try {
      await mailService.verify(tempSender);
    } catch (e) {
      throw new AppError(`SMTP verification failed: ${(e as Error).message}`, 400);
    }

    const existing = await prisma.sender.findFirst({
      where: { userId, email: data.email },
    });
    if (existing) throw new AppError("Sender with this email already exists", 409);

    const encrypted = encrypt(data.password);
    const sender = await prisma.sender.create({
      data: { userId, name: data.name, email: data.email, password: encrypted },
    });
    return { ...sender, password: "••••••••" };
  }

  async deleteSender(userId: number, id: number) {
    const sender = await prisma.sender.findFirst({ where: { id, userId } });
    if (!sender) throw new AppError("Sender not found", 404);

    const inUse = await prisma.email.findFirst({
      where: { senderId: id, status: "PENDING" as any },
    });
    if (inUse) throw new AppError("Cannot delete sender with pending emails", 400);

    await prisma.sender.delete({ where: { id } });
  }

  // Internal: get sender with decrypted password for worker
  async getDecryptedSender(id: number) {
    const sender = await prisma.sender.findUnique({ where: { id } });
    if (!sender) return null;
    return sender;
  }
}

export const senderService = new SenderService();
