"use server";

import { revalidatePath } from "next/cache";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import { SettingsService } from "@/servers/services/settings.service";
import { CreateDepositTicketSchema } from "@/servers/validators/deposit-ticket.validator";
import { getCurrentMasyarakat, getCurrentAdmin } from "./auth.action";

export async function createDepositTicket(input: {
  adminId: number;
  estimatedGrammage: number;
}) {
  const masyarakat = await getCurrentMasyarakat();
  const data = CreateDepositTicketSchema.parse({
    masyarakatId: masyarakat.id,
    adminId: input.adminId,
    estimatedGrammage: input.estimatedGrammage,
  });

  await DepositTicketService.create(data);
  revalidatePath("/tiket-sampah");
  revalidatePath("/");
}

export async function validateDepositTicket(input: {
  ticketId: number;
  action: "APPROVE" | "REJECT";
  actualGrammage?: number;
}) {
  const admin = await getCurrentAdmin();
  const ticket = await DepositTicketService.getById(input.ticketId);

  if (!ticket) throw new Error("Tiket tidak ditemukan");
  if (ticket.adminId !== admin.id) throw new Error("Tiket bukan milik bank Anda");
  if (ticket.status !== "PENDING") throw new Error("Tiket sudah diproses");

  if (input.action === "APPROVE") {
    if (!input.actualGrammage || input.actualGrammage <= 0) {
      throw new Error("Masukkan gramasi aktual");
    }
    const settings = await SettingsService.get();
    const pointsEarned = input.actualGrammage / settings.grammageToPointRate;
    await DepositTicketService.approve(input.ticketId, input.actualGrammage, pointsEarned);
  } else {
    await DepositTicketService.reject(input.ticketId);
  }

  revalidatePath("/admin/tiket");
  revalidatePath(`/admin/tiket/deposit/${input.ticketId}`);
}

export async function cancelDepositTicket(ticketId: number) {
  const masyarakat = await getCurrentMasyarakat();
  await DepositTicketService.cancel(ticketId, masyarakat.id);
  revalidatePath("/tiket-sampah");
}
