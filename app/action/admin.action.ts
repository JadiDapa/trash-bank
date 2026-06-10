"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { UserService } from "@/servers/services/user.service";
import { AdminService } from "@/servers/services/admin.service";
import { CreateAdminSchema, UpdateAdminSchema } from "@/servers/validators/admin.validator";
import { requireSuperAdmin } from "./auth.action";

export async function createAdmin(input: {
  clerkUsername: string;
  clerkPassword: string;
  bankName: string;
  bankAddress: string;
  bankArea: string;
  operatingHours: string;
  phone?: string;
  description?: string;
}) {
  await requireSuperAdmin();
  const data = CreateAdminSchema.parse(input);

  const client = await clerkClient();
  const clerkUser = await client.users.createUser({
    username: data.clerkUsername,
    password: data.clerkPassword,
  });

  const user = await UserService.create(clerkUser.id, "ADMIN");

  await AdminService.create(user.id, {
    bankName: data.bankName,
    bankAddress: data.bankAddress,
    bankArea: data.bankArea,
    operatingHours: data.operatingHours,
    phone: data.phone,
    description: data.description,
  });

  revalidatePath("/super-admin/admin");
}

export async function updateAdmin(
  adminId: number,
  input: {
    bankName?: string;
    bankAddress?: string;
    bankArea?: string;
    operatingHours?: string;
    phone?: string;
    description?: string;
  },
) {
  await requireSuperAdmin();
  const data = UpdateAdminSchema.parse(input);
  await AdminService.update(adminId, data);
  revalidatePath("/super-admin/admin");
}

export async function deleteAdmin(adminId: number) {
  await requireSuperAdmin();
  const admin = await AdminService.getById(adminId);
  if (!admin) throw new Error("Admin tidak ditemukan");

  const client = await clerkClient();
  await client.users.deleteUser(admin.user.clerkId);
  await AdminService.delete(adminId);

  revalidatePath("/super-admin/admin");
}
