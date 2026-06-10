import { getCurrentUser } from "@/app/action/auth.action";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import AdminDepositTicketList from "@/components/root/admin/AdminDepositTicketList";
import QRScanDialog from "@/components/root/admin/QRScanDialog";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Trash2, Clock, CheckCircle } from "lucide-react";

export default async function AdminDepositTicketPage() {
  const user = await getCurrentUser();
  const admin = user.admin!;

  const tickets = await DepositTicketService.getByAdminId(admin.id);

  const pending = tickets.filter((t) => t.status === "PENDING").length;
  const completed = tickets.filter((t) => t.status === "COMPLETED").length;

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Tiket Setor Sampah"
            subtitle="Kelola tiket setor sampah dari warga"
          />
          <QRScanDialog />
        </div>
      </div>

      <PageStats
        stats={[
          { title: "Total Tiket", value: tickets.length, icon: Trash2 },
          { title: "Menunggu Proses", value: pending, icon: Clock },
          { title: "Selesai", value: completed, icon: CheckCircle },
        ]}
      />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Semua Tiket Deposit
        </h2>
        <AdminDepositTicketList tickets={tickets} />
      </div>
    </main>
  );
}
