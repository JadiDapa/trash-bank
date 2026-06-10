import { prisma } from "@/lib/prisma";
import { VoucherTicketStatus } from "@/generated/prisma";
import type { CreateVoucherTicketDTO } from "../validators/voucher-ticket.validator";

const ticketInclude = {
  masyarakat: true,
  admin: true,
};

function generateVoucherSerial(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VCH-${dateStr}-${rand}`;
}

export const VoucherTicketService = {
  async getAll() {
    return prisma.voucherTicket.findMany({
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getByAdminId(adminId: number, status?: VoucherTicketStatus) {
    return prisma.voucherTicket.findMany({
      where: { adminId, ...(status ? { status } : {}) },
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getByMasyarakatId(masyarakatId: number) {
    return prisma.voucherTicket.findMany({
      where: { masyarakatId },
      include: ticketInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.voucherTicket.findUnique({
      where: { id },
      include: ticketInclude,
    });
  },

  async create(data: CreateVoucherTicketDTO, pointsUsed: number) {
    // Check user has enough points
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { id: data.masyarakatId },
      select: { points: true },
    });
    if (!masyarakat) throw new Error("Masyarakat tidak ditemukan");
    if (masyarakat.points < pointsUsed)
      throw new Error("Poin tidak mencukupi");

    return prisma.voucherTicket.create({
      data: {
        masyarakatId: data.masyarakatId,
        adminId: data.adminId,
        pointsUsed,
      },
      include: ticketInclude,
    });
  },

  async approve(ticketId: number) {
    return prisma.$transaction(async (tx) => {
      const ticket = await tx.voucherTicket.findUnique({
        where: { id: ticketId },
      });
      if (!ticket) throw new Error("Tiket tidak ditemukan");

      const updated = await tx.voucherTicket.update({
        where: { id: ticketId },
        data: {
          status: "COMPLETED",
          voucherSerial: generateVoucherSerial(),
        },
      });

      await tx.masyarakat.update({
        where: { id: ticket.masyarakatId },
        data: { points: { decrement: ticket.pointsUsed } },
      });

      return updated;
    });
  },

  async reject(ticketId: number) {
    return prisma.voucherTicket.update({
      where: { id: ticketId },
      data: { status: "CANCELLED" },
    });
  },

  async cancel(ticketId: number, masyarakatId: number) {
    const ticket = await prisma.voucherTicket.findFirst({
      where: { id: ticketId, masyarakatId, status: "PENDING" },
    });
    if (!ticket) throw new Error("Tiket tidak ditemukan atau tidak bisa dibatalkan");

    return prisma.voucherTicket.update({
      where: { id: ticketId },
      data: { status: "CANCELLED" },
    });
  },
};
