"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import {
  CreatePointExchangeSchema,
  UpdatePointExchangeSchema,
} from "@/servers/validators/point-exchange.validator";
import { PointExchangeService } from "@/servers/services/point-exchange.service";

export async function createPointExchange(
  input: z.input<typeof CreatePointExchangeSchema>,
) {
  const data = CreatePointExchangeSchema.parse({
    userId: input.userId,
    grammage: input.grammage,
    points: input.points,
  });

  await PointExchangeService.create(data);

  revalidatePath("/documentation");
}

export async function updatePointExchange(
  id: number,
  input: z.input<typeof UpdatePointExchangeSchema>,
) {
  const data = UpdatePointExchangeSchema.parse(input);

  await PointExchangeService.update(id, {
    ...data,
  });

  revalidatePath("/documentation/" + id);
  revalidatePath("/documentation");
}
