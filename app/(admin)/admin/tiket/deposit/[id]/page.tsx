import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import { SettingsService } from "@/servers/services/settings.service";
import { getCurrentUser } from "@/app/action/auth.action";
import { notFound } from "next/navigation";
import DepositTicketDetailClient from "@/components/root/admin/DepositTicketDetailClient";

export default async function DepositTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const admin = user.admin!;

  const [ticket, settings] = await Promise.all([
    DepositTicketService.getById(Number(id)),
    SettingsService.get(),
  ]);

  if (!ticket || ticket.adminId !== admin.id) notFound();

  return (
    <DepositTicketDetailClient
      ticket={ticket}
      grammageToPointRate={settings.grammageToPointRate}
    />
  );
}
