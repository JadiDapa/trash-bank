import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

export const UserService = {
  async getByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
      include: { admin: true, masyarakat: true },
    });
  },

  async create(clerkId: string, role: UserRole) {
    return prisma.user.create({ data: { clerkId, role } });
  },

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  },
};
