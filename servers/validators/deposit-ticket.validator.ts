import { z } from "zod";

export const CreateDepositTicketSchema = z.object({
  masyarakatId: z.number().int().positive(),
  adminId: z.number().int().positive(),
  estimatedGrammage: z.coerce.number().positive("Gramasi harus lebih dari 0"),
});

export const ValidateDepositTicketSchema = z.object({
  ticketId: z.number().int().positive(),
  action: z.enum(["APPROVE", "REJECT"]),
  actualGrammage: z.coerce.number().positive().optional(),
});

export type CreateDepositTicketDTO = z.infer<typeof CreateDepositTicketSchema>;
export type ValidateDepositTicketDTO = z.infer<
  typeof ValidateDepositTicketSchema
>;
