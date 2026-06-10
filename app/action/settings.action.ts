"use server";

import { revalidatePath } from "next/cache";
import { SettingsService } from "@/servers/services/settings.service";
import { UpdateSettingsSchema } from "@/servers/validators/settings.validator";
import { requireSuperAdmin } from "./auth.action";

export async function updateSettings(input: {
  grammageToPointRate?: number;
  pointsToVoucherRate?: number;
}) {
  await requireSuperAdmin();
  const data = UpdateSettingsSchema.parse(input);
  await SettingsService.update(data);
  revalidatePath("/super-admin/settings");
}
