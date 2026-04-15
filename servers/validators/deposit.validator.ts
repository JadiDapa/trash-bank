import { Prisma, TrashType } from "@/generated/prisma";
import { z } from "zod";

export type DepositType = Prisma.DepositGetPayload<{
  include: {
    user: true;
  };
}>;

export const DepositSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const DepositBaseSchema = z.object({
  userId: z.number().min(1),
  trashType: z.enum(TrashType),
  grammage: z.coerce.number(),
  description: z.string(),
});

export const CreateDepositSchema = DepositBaseSchema;

export const UpdateDepositSchema = DepositBaseSchema.partial();

export type CreateDepositDTO = z.infer<typeof CreateDepositSchema>;
export type UpdateDepositDTO = z.infer<typeof UpdateDepositSchema>;
