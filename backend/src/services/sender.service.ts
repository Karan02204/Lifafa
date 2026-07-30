import prisma from "../config/prisma";

class SenderService {
  async getAllSenders(userId: number) {
    return prisma.sender.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}

export const senderService = new SenderService();
