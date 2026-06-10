import { z } from "zod";

export const UpdateSettingsSchema = z.object({
  grammageToPointRate: z.coerce
    .number()
    .positive("Rate harus lebih dari 0")
    .optional(),
  pointsToVoucherRate: z.coerce
    .number()
    .positive("Rate harus lebih dari 0")
    .optional(),
});

export type UpdateSettingsDTO = z.infer<typeof UpdateSettingsSchema>;
