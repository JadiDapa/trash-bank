import { AdminService } from "@/servers/services/admin.service";
import SuperAdminAdminClient from "@/components/root/super-admin/SuperAdminAdminClient";
import CreateAdminButton from "@/components/root/super-admin/CreateAdminButton";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Building2 } from "lucide-react";

export default async function SuperAdminAdminPage() {
  const admins = await AdminService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title="Bank Sampah"
            subtitle="Kelola seluruh bank sampah yang terdaftar"
          />
        </div>
        <div className="flex items-center gap-2">
          <CreateAdminButton />
        </div>
      </div>

      <PageStats
        stats={[
          { title: "Total Bank Sampah", value: admins.length, icon: Building2 },
        ]}
      />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Bank Sampah
        </h2>
        <SuperAdminAdminClient admins={admins} />
      </div>
    </main>
  );
}
