import { Education } from "@/generated/prisma";
import { z } from "zod";

export type EducationType = Education;

export const EducationSearchSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  search: z.string().min(1).max(50).optional(),
});

const EducationBaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  userId: z.number().min(1),
});

export const CreateEducationSchema = EducationBaseSchema;

export const UpdateEducationSchema = EducationBaseSchema.partial();

export type CreateEducationDTO = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDTO = z.infer<typeof UpdateEducationSchema>;
