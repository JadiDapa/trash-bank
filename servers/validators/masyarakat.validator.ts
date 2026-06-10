import { z } from "zod";
import { Gender } from "@/generated/prisma";

export const RegisterMasyarakatSchema = z
  .object({
    nik: z
      .string()
      .length(16, "NIK harus 16 digit")
      .regex(/^\d+$/, "NIK harus berupa angka"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Nama wajib diisi"),
    address: z.string().min(1, "Alamat wajib diisi"),
    gender: z.enum(Gender),
    phone: z.string().min(10, "Nomor HP tidak valid"),
    email: z.string().email("Email tidak valid"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  });

export const UpdateMasyarakatSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  gender: z.enum(Gender).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  ktpImageUrl: z.string().min(1).optional(),
});

export const ReviewMasyarakatSchema = z.object({
  masyarakatId: z.number().int().positive(),
  action: z.enum(["APPROVE", "REJECT"]),
  rejectedReason: z.string().optional(),
});

export type RegisterMasyarakatDTO = z.infer<typeof RegisterMasyarakatSchema>;
export type UpdateMasyarakatDTO = z.infer<typeof UpdateMasyarakatSchema>;
export type ReviewMasyarakatDTO = z.infer<typeof ReviewMasyarakatSchema>;
