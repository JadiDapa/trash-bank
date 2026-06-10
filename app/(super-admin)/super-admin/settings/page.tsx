import { SettingsService } from "@/servers/services/settings.service";
import SuperAdminSettingsClient from "@/components/root/super-admin/SuperAdminSettingsClient";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";

export default async function SuperAdminSettingsPage() {
  const settings = await SettingsService.get();

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader
          title="Pengaturan Sistem"
          subtitle="Konfigurasi konversi gramasi dan poin"
        />
      </div>

      <SuperAdminSettingsClient settings={settings} />
    </main>
  );
}
