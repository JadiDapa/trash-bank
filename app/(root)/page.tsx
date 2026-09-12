import { getCurrentMasyarakat } from "@/app/action/auth.action";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { EducationService } from "@/servers/services/education.service";
import { SettingsService } from "@/servers/services/settings.service";
import CitizenDashboard from "@/components/root/home/CitizenDashboard";

export default async function HomePage() {
  const masyarakat = await getCurrentMasyarakat();

  const [depositTickets, voucherTickets, educations, settings] =
    await Promise.all([
      DepositTicketService.getByMasyarakatId(masyarakat.id),
      VoucherTicketService.getByMasyarakatId(masyarakat.id),
      EducationService.getAll(),
      SettingsService.get(),
    ]);

  return (
    <CitizenDashboard
      masyarakat={masyarakat}
      depositTickets={depositTickets}
      voucherTickets={voucherTickets}
      educations={educations}
      pointsToVoucherRate={settings.pointsToVoucherRate}
    />
  );
}
