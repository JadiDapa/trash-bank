"use server";

import { revalidatePath } from "next/cache";
import { MasyarakatService } from "@/servers/services/masyarakat.service";
import { UserService } from "@/servers/services/user.service";
import { UpdateMasyarakatSchema, ReviewMasyarakatSchema } from "@/servers/validators/masyarakat.validator";
import { requireSuperAdmin, getCurrentUser } from "./auth.action";
import { clerkClient } from "@clerk/nextjs/server";

export async function reviewMasyarakat(input: {
  masyarakatId: number;
  action: "APPROVE" | "REJECT";
  rejectedReason?: string;
}) {
  await requireSuperAdmin();
  const data = ReviewMasyarakatSchema.parse(input);

  if (data.action === "APPROVE") {
    await MasyarakatService.approve(data.masyarakatId);
  } else {
    await MasyarakatService.reject(data.masyarakatId, data.rejectedReason);
  }

  revalidatePath("/super-admin/masyarakat");
}

export async function resubmitMasyarakat(input: {
  name?: string;
  address?: string;
  gender?: "LAKI_LAKI" | "PEREMPUAN";
  phone?: string;
  email?: string;
  ktpImageUrl?: string;
}) {
  const user = await getCurrentUser();
  const masyarakat = user.masyarakat;
  if (!masyarakat || masyarakat.status !== "REJECTED") {
    throw new Error("Tidak dapat resubmit");
  }

  const data = UpdateMasyarakatSchema.parse(input);
  await MasyarakatService.resubmit(masyarakat.id, data);
  revalidatePath("/waiting");
}

export async function deleteMasyarakatAccount() {
  const user = await getCurrentUser();
  const masyarakat = user.masyarakat;
  if (!masyarakat || masyarakat.status !== "REJECTED") {
    throw new Error("Tidak bisa hapus akun");
  }

  const client = await clerkClient();
  await client.users.deleteUser(user.clerkId);
  await UserService.delete(user.id);
}
