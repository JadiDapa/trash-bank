import { z } from "zod";

export const CreateEducationSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  imageUrl: z.string().optional(),
});

export const UpdateEducationSchema = CreateEducationSchema.omit({
  userId: true,
}).partial();

export type CreateEducationDTO = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDTO = z.infer<typeof UpdateEducationSchema>;
