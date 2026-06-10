import { prisma } from "@/lib/prisma";
import type { UpdateSettingsDTO } from "../validators/settings.validator";

export const SettingsService = {
  async get() {
    return prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, grammageToPointRate: 100, pointsToVoucherRate: 25000 },
    });
  },

  async update(data: UpdateSettingsDTO) {
    return prisma.settings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        grammageToPointRate: data.grammageToPointRate ?? 100,
        pointsToVoucherRate: data.pointsToVoucherRate ?? 25000,
      },
    });
  },
};
