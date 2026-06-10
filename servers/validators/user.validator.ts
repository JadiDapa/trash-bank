import { z } from "zod";
import { UserRole } from "@/generated/prisma";

export const CreateUserSchema = z.object({
  clerkId: z.string().min(1),
  role: z.enum(UserRole),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
