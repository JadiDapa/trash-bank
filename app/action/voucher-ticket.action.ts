"use server";

import { revalidatePath } from "next/cache";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { SettingsService } from "@/servers/services/settings.service";
import { getCurrentMasyarakat, getCurrentAdmin } from "./auth.action";

export async function createVoucherTicket(input: { adminId: number }) {
  const masyarakat = await getCurrentMasyarakat();
  const settings = await SettingsService.get();

  await VoucherTicketService.create(
    { masyarakatId: masyarakat.id, adminId: input.adminId },
    settings.pointsToVoucherRate,
  );

  revalidatePath("/tiket-poin");
  revalidatePath("/");
}

export async function validateVoucherTicket(input: {
  ticketId: number;
  action: "APPROVE" | "REJECT";
}) {
  const admin = await getCurrentAdmin();
  const ticket = await VoucherTicketService.getById(input.ticketId);

  if (!ticket) throw new Error("Tiket tidak ditemukan");
  if (ticket.adminId !== admin.id) throw new Error("Tiket bukan milik bank Anda");
  if (ticket.status !== "PENDING") throw new Error("Tiket sudah diproses");

  if (input.action === "APPROVE") {
    await VoucherTicketService.approve(input.ticketId);
  } else {
    await VoucherTicketService.reject(input.ticketId);
  }

  revalidatePath("/admin/tiket");
  revalidatePath(`/admin/tiket/voucher/${input.ticketId}`);
}

export async function cancelVoucherTicket(ticketId: number) {
  const masyarakat = await getCurrentMasyarakat();
  await VoucherTicketService.cancel(ticketId, masyarakat.id);
  revalidatePath("/tiket-poin");
}
