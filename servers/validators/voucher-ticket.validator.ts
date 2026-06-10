import { z } from "zod";

export const CreateVoucherTicketSchema = z.object({
  masyarakatId: z.number().int().positive(),
  adminId: z.number().int().positive(),
});

export const ValidateVoucherTicketSchema = z.object({
  ticketId: z.number().int().positive(),
  action: z.enum(["APPROVE", "REJECT"]),
});

export type CreateVoucherTicketDTO = z.infer<typeof CreateVoucherTicketSchema>;
export type ValidateVoucherTicketDTO = z.infer<
  typeof ValidateVoucherTicketSchema
>;
