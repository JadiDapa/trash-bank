import { prisma } from "@/lib/prisma";
import { MasyarakatStatus } from "@/generated/prisma";
import type {
  UpdateMasyarakatDTO,
} from "../validators/masyarakat.validator";

export const MasyarakatService = {
  async getAll(status?: MasyarakatStatus) {
    return prisma.masyarakat.findMany({
      where: status ? { status } : undefined,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.masyarakat.findUnique({
      where: { id },
      include: { user: true },
    });
  },

  async getByUserId(userId: number) {
    return prisma.masyarakat.findUnique({
      where: { userId },
      include: { user: true },
    });
  },

  async getByNik(nik: string) {
    return prisma.masyarakat.findUnique({ where: { nik } });
  },

  async create(
    userId: number,
    data: {
      nik: string;
      name: string;
      address: string;
      gender: "LAKI_LAKI" | "PEREMPUAN";
      phone: string;
      email: string;
      ktpImageUrl: string;
    },
  ) {
    return prisma.masyarakat.create({
      data: { userId, ...data },
    });
  },

  async update(id: number, data: UpdateMasyarakatDTO) {
    return prisma.masyarakat.update({ where: { id }, data });
  },

  async approve(id: number) {
    return prisma.masyarakat.update({
      where: { id },
      data: { status: "APPROVED", rejectedReason: null },
    });
  },

  async reject(id: number, reason?: string) {
    return prisma.masyarakat.update({
      where: { id },
      data: { status: "REJECTED", rejectedReason: reason ?? null },
    });
  },

  async resubmit(id: number, data: UpdateMasyarakatDTO) {
    return prisma.masyarakat.update({
      where: { id },
      data: { ...data, status: "WAITING", rejectedReason: null },
    });
  },

  async delete(id: number) {
    return prisma.masyarakat.delete({ where: { id } });
  },
};
