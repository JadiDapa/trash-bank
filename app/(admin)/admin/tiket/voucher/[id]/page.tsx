import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { getCurrentUser } from "@/app/action/auth.action";
import { notFound } from "next/navigation";
import VoucherTicketDetailClient from "@/components/root/admin/VoucherTicketDetailClient";

export default async function VoucherTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const admin = user.admin!;

  const ticket = await VoucherTicketService.getById(Number(id));
  if (!ticket || ticket.adminId !== admin.id) notFound();

  return <VoucherTicketDetailClient ticket={ticket} />;
}
