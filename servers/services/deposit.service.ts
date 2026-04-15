import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateDepositDTO,
  UpdateDepositDTO,
} from "../validators/deposit.validator";

export type DepositListOptions = {
  page?: number;
  pageSize?: number;
  userId?: number;
  order?: number;
  search?: string;
  orderBy?: Prisma.DepositOrderByWithRelationInput;
};

function depositWhere(opts: DepositListOptions): Prisma.DepositWhereInput {
  const and: Prisma.DepositWhereInput[] = [];

  if (opts.userId) and.push({ userId: opts.userId });

  return and.length ? { AND: and } : {};
}

export const DepositService = {
  async list(opts: DepositListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = depositWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.deposit.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.deposit.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    const deposit = await prisma.deposit.findMany({});

    return deposit;
  },

  async getByUserId(userId: number) {
    const deposit = await prisma.deposit.findMany({
      where: { userId },
    });

    return deposit;
  },

  async getById(id: number) {
    const deposit = await prisma.deposit.findUnique({
      where: { id },
    });

    return deposit;
  },

  async create(data: CreateDepositDTO) {
    const [deposit, user] = await prisma.$transaction([
      prisma.deposit.create({
        data: {
          grammage: data.grammage,
          trashType: data.trashType,
          userId: data.userId,
          description: data.description,
        },
      }),
      prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          grammage: {
            increment: data.grammage,
          },
        },
      }),
    ]);

    return { deposit, user };
  },

  async update(id: number, data: UpdateDepositDTO) {
    return prisma.deposit.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.deposit.delete({ where: { id } });
  },
};
