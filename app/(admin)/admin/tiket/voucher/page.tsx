import { getCurrentUser } from "@/app/action/auth.action";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import AdminVoucherTicketList from "@/components/root/admin/AdminVoucherTicketList";
import QRScanDialog from "@/components/root/admin/QRScanDialog";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Gift, Clock, CheckCircle } from "lucide-react";

export default async function AdminVoucherTicketPage() {
  const user = await getCurrentUser();
  const admin = user.admin!;

  const tickets = await VoucherTicketService.getByAdminId(admin.id);

  const pending = tickets.filter((t) => t.status === "PENDING").length;
  const completed = tickets.filter((t) => t.status === "COMPLETED").length;

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Tiket Tukar Poin"
            subtitle="Kelola tiket penukaran poin dari warga"
          />
          <QRScanDialog />
        </div>
      </div>

      <PageStats
        stats={[
          { title: "Total Tiket", value: tickets.length, icon: Gift },
          { title: "Menunggu Proses", value: pending, icon: Clock },
          { title: "Selesai", value: completed, icon: CheckCircle },
        ]}
      />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Semua Tiket Voucher
        </h2>
        <AdminVoucherTicketList tickets={tickets} />
      </div>
    </main>
  );
}
