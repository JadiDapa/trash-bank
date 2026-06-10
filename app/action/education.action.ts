"use server";

import { revalidatePath } from "next/cache";
import { EducationService } from "@/servers/services/education.service";
import { CreateEducationSchema, UpdateEducationSchema } from "@/servers/validators/education.validator";
import { requireSuperAdmin } from "./auth.action";

export async function createEducation(input: {
  title: string;
  description: string;
  imageUrl?: string;
}) {
  const user = await requireSuperAdmin();
  const data = CreateEducationSchema.parse({ ...input, userId: user.id });
  await EducationService.create(data);
  revalidatePath("/super-admin/edukasi");
  revalidatePath("/edukasi-lingkungan");
}

export async function updateEducation(
  id: number,
  input: { title?: string; description?: string; imageUrl?: string },
) {
  await requireSuperAdmin();
  const data = UpdateEducationSchema.parse(input);
  await EducationService.update(id, data);
  revalidatePath("/super-admin/edukasi");
  revalidatePath("/edukasi-lingkungan");
  revalidatePath(`/edukasi-lingkungan/${id}`);
}

export async function deleteEducation(id: number) {
  await requireSuperAdmin();
  await EducationService.delete(id);
  revalidatePath("/super-admin/edukasi");
  revalidatePath("/edukasi-lingkungan");
}
