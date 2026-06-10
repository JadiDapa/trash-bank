import { getCurrentUser } from "@/app/action/auth.action";
import { AdminService } from "@/servers/services/admin.service";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import DepositTicketsClient from "@/components/root/citizen/DepositTicketsClient";

export default async function TiketSampahPage() {
  const user = await getCurrentUser();
  const masyarakat = user.masyarakat!;

  const [tickets, admins] = await Promise.all([
    DepositTicketService.getByMasyarakatId(masyarakat.id),
    AdminService.getAll(),
  ]);

  return (
    <DepositTicketsClient
      masyarakat={masyarakat}
      tickets={tickets}
      admins={admins}
    />
  );
}
