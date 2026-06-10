import { prisma } from "@/lib/prisma";
import type { UpdateAdminDTO } from "../validators/admin.validator";

export const AdminService = {
  async getAll() {
    return prisma.admin.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: number) {
    return prisma.admin.findUnique({
      where: { id },
      include: { user: true },
    });
  },

  async getByUserId(userId: number) {
    return prisma.admin.findUnique({
      where: { userId },
      include: { user: true },
    });
  },

  async create(
    userId: number,
    data: Omit<UpdateAdminDTO, "id"> & {
      bankName: string;
      bankAddress: string;
      bankArea: string;
      operatingHours: string;
    },
  ) {
    return prisma.admin.create({
      data: { userId, ...data },
      include: { user: true },
    });
  },

  async update(id: number, data: UpdateAdminDTO) {
    return prisma.admin.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.admin.delete({ where: { id } });
  },
};
