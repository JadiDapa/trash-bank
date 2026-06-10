import { prisma } from "@/lib/prisma";
import { DepositTicketStatus } from "@/generated/prisma";
import type { CreateDepositTicketDTO } from "../validators/deposit-ticket.validator";

const ticketInclude = {
  masyarakat: true,
  admin: true,
};

export const DepositTicketService = {
  async getAll() {
    return prisma.depositTicket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getByAdminId(adminId: number, status?: DepositTicketStatus) {
    return prisma.depositTicket.findMany({
      where: { adminId, ...(status ? { status } : {}) },
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getByMasyarakatId(masyarakatId: number) {
    return prisma.depositTicket.findMany({
      where: { masyarakatId },
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.depositTicket.findUnique({
      where: { id },
      include: ticketInclude,
    });
  },

  async create(data: CreateDepositTicketDTO) {
    return prisma.depositTicket.create({
      data: {
        masyarakatId: data.masyarakatId,
        adminId: data.adminId,
        estimatedGrammage: data.estimatedGrammage,
      },
      include: ticketInclude,
    });
  },

  async approve(ticketId: number, actualGrammage: number, pointsEarned: number) {
    return prisma.$transaction(async (tx) => {
      const ticket = await tx.depositTicket.update({
        where: { id: ticketId },
        data: {
          status: "COMPLETED",
          actualGrammage,
          pointsEarned,
        },
      });

      await tx.masyarakat.update({
        where: { id: ticket.masyarakatId },
        data: {
          points: { increment: pointsEarned },
          totalGrammage: { increment: actualGrammage },
        },
      });

      return ticket;
    });
  },

  async reject(ticketId: number) {
    return prisma.depositTicket.update({
      where: { id: ticketId },
      data: { status: "REJECTED" },
    });
  },

  async cancel(ticketId: number, masyarakatId: number) {
    const ticket = await prisma.depositTicket.findFirst({
      where: { id: ticketId, masyarakatId, status: "PENDING" },
    });
    if (!ticket) throw new Error("Tiket tidak ditemukan atau tidak bisa dibatalkan");

    return prisma.depositTicket.update({
      where: { id: ticketId },
      data: { status: "CANCELLED" },
    });
  },
};
