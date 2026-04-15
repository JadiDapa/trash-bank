"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateEducationSchema,
  UpdateEducationSchema,
} from "@/servers/validators/education.validator";
import { EducationService } from "@/servers/services/education.service";

export async function createEducation(
  input: z.input<typeof CreateEducationSchema>,
) {
  const data = CreateEducationSchema.parse({
    title: input.title,
    description: input.description,
    imageUrl: input.imageUrl,
    userId: input.userId,
  });

  await EducationService.create(data);

  revalidatePath("/documentation");
}

export async function updateEducation(
  id: number,
  input: z.input<typeof UpdateEducationSchema>,
) {
  const data = UpdateEducationSchema.parse(input);

  await EducationService.update(id, {
    ...data,
  });

  revalidatePath("/documentation/" + id);
  revalidatePath("/documentation");
}
