import { EducationService } from "@/servers/services/education.service";
import SuperAdminEducationClient from "@/components/root/super-admin/SuperAdminEducationClient";
import CreateEducationButton from "@/components/root/super-admin/CreateEducationButton";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { BookOpen } from "lucide-react";

export default async function SuperAdminEdukasiPage() {
  const educations = await EducationService.getAll();

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <DynamicBreadcrumb />
          <PageHeader
            title="Edukasi Lingkungan"
            subtitle="Kelola artikel dan konten edukasi"
          />
        </div>
        <div className="flex items-center gap-2">
          <CreateEducationButton />
        </div>
      </div>

      <PageStats
        stats={[
          { title: "Total Artikel", value: educations.length, icon: BookOpen },
        ]}
      />

      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-medium tracking-tight">
          Daftar Artikel
        </h2>
        <SuperAdminEducationClient educations={educations} />
      </div>
    </main>
  );
}
