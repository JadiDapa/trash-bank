import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type {
  CreateEducationDTO,
  UpdateEducationDTO,
} from "../validators/education.validator";

export type EducationListOptions = {
  page?: number;
  pageSize?: number;
  title?: string;
  name?: string;
  isActive?: boolean;
  order?: number;
  search?: string;
  orderBy?: Prisma.EducationOrderByWithRelationInput;
};

function educationWhere(
  opts: EducationListOptions,
): Prisma.EducationWhereInput {
  const and: Prisma.EducationWhereInput[] = [];

  if (opts.title) and.push({ title: opts.title });

  return and.length ? { AND: and } : {};
}

export const EducationService = {
  async list(opts: EducationListOptions = {}) {
    const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const page = Math.max(opts.page ?? 1, 1);

    const where = educationWhere(opts);
    const orderBy = opts.orderBy ?? { order: "asc" };

    const [items, total] = await Promise.all([
      prisma.education.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.education.count({ where }),
    ]);

    return {
      items,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getAll() {
    const education = await prisma.education.findMany({});

    return education;
  },

  async getById(id: number) {
    const education = await prisma.education.findUnique({
      where: { id },
    });

    return education;
  },

  async create(data: CreateEducationDTO) {
    return await prisma.education.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        userId: data.userId,
      },
    });
  },

  async update(id: number, data: UpdateEducationDTO) {
    return prisma.education.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.education.delete({ where: { id } });
  },
};
