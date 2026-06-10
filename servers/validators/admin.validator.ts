import { z } from "zod";

export const CreateAdminSchema = z.object({
  clerkUsername: z.string().min(3, "Username minimal 3 karakter"),
  clerkPassword: z.string().min(8, "Password minimal 8 karakter"),
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  bankAddress: z.string().min(1, "Alamat bank wajib diisi"),
  bankArea: z.string().min(1, "Kecamatan wajib diisi"),
  operatingHours: z.string().min(1, "Jam operasional wajib diisi"),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateAdminSchema = z.object({
  bankName: z.string().min(1).optional(),
  bankAddress: z.string().min(1).optional(),
  bankArea: z.string().min(1).optional(),
  operatingHours: z.string().min(1).optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export type CreateAdminDTO = z.infer<typeof CreateAdminSchema>;
export type UpdateAdminDTO = z.infer<typeof UpdateAdminSchema>;
