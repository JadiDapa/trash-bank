import { getCurrentUser } from "@/app/action/auth.action";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import AdminDashboard from "@/components/root/admin/AdminDashboard";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Ticket, Clock, CheckCircle } from "lucide-react";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const admin = user.admin!;

  const [depositTickets, voucherTickets] = await Promise.all([
    DepositTicketService.getByAdminId(admin.id),
    VoucherTicketService.getByAdminId(admin.id),
  ]);

  const pendingDeposit = depositTickets.filter(
    (t) => t.status === "PENDING",
  ).length;
  const completedDeposit = depositTickets.filter(
    (t) => t.status === "COMPLETED",
  ).length;
  const pendingVoucher = voucherTickets.filter(
    (t) => t.status === "PENDING",
  ).length;
  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader
          title="Beranda"
          subtitle={`Bank Sampah ${admin.bankName} · ${admin.bankArea}`}
        />
      </div>

      <PageStats
        stats={[
          {
            title: "Total Tiket Setor",
            value: depositTickets.length,
            icon: Ticket,
          },
          {
            title: "Tiket Setor Pending",
            value: pendingDeposit,
            icon: Clock,
          },
          {
            title: "Tiket Setor Selesai",
            value: completedDeposit,
            icon: CheckCircle,
          },
          {
            title: "Tiket Poin Pending",
            value: pendingVoucher,
            icon: Clock,
          },
        ]}
      />

      <AdminDashboard
        admin={admin}
        depositTickets={depositTickets}
        voucherTickets={voucherTickets}
      />
    </main>
  );
}
