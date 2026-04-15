import { Prisma } from "@/generated/prisma";
import { z } from "zod";

export type PointExchangeType = Prisma.PointExchangeGetPayload<{
  include: {
    user: true;
  };
}>;

export const PointExchangeSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const PointExchangeBaseSchema = z.object({
  userId: z.number().min(1),
  points: z.coerce.number(),
  grammage: z.coerce.number(),
});

export const CreatePointExchangeSchema = PointExchangeBaseSchema;

export const UpdatePointExchangeSchema = PointExchangeBaseSchema.partial();

export type CreatePointExchangeDTO = z.infer<typeof CreatePointExchangeSchema>;
export type UpdatePointExchangeDTO = z.infer<typeof UpdatePointExchangeSchema>;
