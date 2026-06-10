import { MasyarakatService } from "@/servers/services/masyarakat.service";
import SuperAdminMasyarakatClient from "@/components/root/super-admin/SuperAdminMasyarakatClient";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Users, Clock, CheckCircle } from "lucide-react";

export default async function SuperAdminMasyarakatPage() {
  const masyarakat = await MasyarakatService.getAll();

  const waiting = masyarakat.filter((m) => m.status === "WAITING").length;
  const approved = masyarakat.filter((m) => m.status === "APPROVED").length;

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title="Masyarakat"
            subtitle="Kelola dan setujui pendaftaran warga"
          />
        </div>
      </div>

      <PageStats
        stats={[
          { title: "Total Masyarakat", value: masyarakat.length, icon: Users },
          { title: "Menunggu Persetujuan", value: waiting, icon: Clock },
          { title: "Telah Disetujui", value: approved, icon: CheckCircle },
        ]}
      />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Masyarakat
        </h2>
        <SuperAdminMasyarakatClient masyarakat={masyarakat} />
      </div>
    </main>
  );
}
