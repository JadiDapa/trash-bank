import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { getCurrentAdmin } from "@/app/action/auth.action";
import { notFound } from "next/navigation";
import VoucherTicketDetailClient from "@/components/root/admin/VoucherTicketDetailClient";

export default async function VoucherTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await getCurrentAdmin();

  const ticket = await VoucherTicketService.getById(Number(id));
  if (!ticket || ticket.adminId !== admin.id) notFound();

  return <VoucherTicketDetailClient ticket={ticket} />;
}
