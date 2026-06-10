import { prisma } from "@/lib/prisma";
import type {
  CreateEducationDTO,
  UpdateEducationDTO,
} from "../validators/education.validator";

export const EducationService = {
  async getAll() {
    return prisma.education.findMany({ orderBy: { createdAt: "desc" } });
  },

  async getById(id: number) {
    return prisma.education.findUnique({ where: { id } });
  },

  async create(data: CreateEducationDTO) {
    return prisma.education.create({ data });
  },

  async update(id: number, data: UpdateEducationDTO) {
    return prisma.education.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.education.delete({ where: { id } });
  },
};
