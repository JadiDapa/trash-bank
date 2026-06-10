import { getCurrentUser } from "@/app/action/auth.action";
import { AdminService } from "@/servers/services/admin.service";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { SettingsService } from "@/servers/services/settings.service";
import VoucherTicketsClient from "@/components/root/citizen/VoucherTicketsClient";

export default async function TiketPoinPage() {
  const user = await getCurrentUser();
  const masyarakat = user.masyarakat!;

  const [tickets, admins, settings] = await Promise.all([
    VoucherTicketService.getByMasyarakatId(masyarakat.id),
    AdminService.getAll(),
    SettingsService.get(),
  ]);

  return (
    <VoucherTicketsClient
      masyarakat={masyarakat}
      tickets={tickets}
      admins={admins}
      pointsToVoucherRate={settings.pointsToVoucherRate}
    />
  );
}
