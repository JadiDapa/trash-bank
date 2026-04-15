import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreatePointExchangeDTO,
  UpdatePointExchangeDTO,
} from "../validators/point-exchange.validator";

export type PointExchangeListOptions = {
  page?: number;
  pageSize?: number;
  userId?: number;
  order?: number;
  search?: string;
  orderBy?: Prisma.PointExchangeOrderByWithRelationInput;
};

function pointExchangeWhere(
  opts: PointExchangeListOptions,
): Prisma.PointExchangeWhereInput {
  const and: Prisma.PointExchangeWhereInput[] = [];

  if (opts.userId) and.push({ userId: opts.userId });

  return and.length ? { AND: and } : {};
}

export const PointExchangeService = {
  async list(opts: PointExchangeListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = pointExchangeWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.pointExchange.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.pointExchange.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    return await prisma.pointExchange.findMany({});
  },

  async getById(id: number) {
    return await prisma.pointExchange.findUnique({
      where: { id },
    });
  },

  async getByUserId(userId: number) {
    return await prisma.pointExchange.findMany({
      where: { userId },
    });
  },

  async create(data: CreatePointExchangeDTO) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get user first
      const user = await tx.user.findUnique({
        where: { id: data.userId },
        select: { grammage: true, points: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // 2. Validation: prevent overdraft
      if (user.grammage < data.grammage) {
        throw new Error("Grammage not enough");
      }

      // 3. Create exchange
      const pointExchange = await tx.pointExchange.create({
        data: {
          grammage: data.grammage,
          points: data.points,
          userId: data.userId,
        },
      });

      // 4. Update user safely
      const updatedUser = await tx.user.update({
        where: { id: data.userId },
        data: {
          grammage: {
            decrement: data.grammage,
          },
          points: {
            increment: data.points,
          },
        },
      });

      return { pointExchange, user: updatedUser };
    });
  },
  async update(id: number, data: UpdatePointExchangeDTO) {
    return prisma.pointExchange.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.pointExchange.delete({ where: { id } });
  },
};
