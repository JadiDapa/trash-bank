"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreateDepositSchema,
  UpdateDepositSchema,
} from "@/servers/validators/deposit.validator";
import { DepositService } from "@/servers/services/deposit.service";

export async function createDeposit(
  input: z.input<typeof CreateDepositSchema>,
) {
  const data = CreateDepositSchema.parse({
    userId: input.userId,
    trashType: input.trashType,
    grammage: input.grammage,
    description: input.description,
  });

  await DepositService.create(data);

  revalidatePath("/documentation");
}

export async function updateDeposit(
  id: number,
  input: z.input<typeof UpdateDepositSchema>,
) {
  const data = UpdateDepositSchema.parse(input);

  await DepositService.update(id, {
    ...data,
  });

  revalidatePath("/documentation/" + id);
  revalidatePath("/documentation");
}
