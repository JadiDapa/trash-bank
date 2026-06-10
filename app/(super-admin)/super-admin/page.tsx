import { MasyarakatService } from "@/servers/services/masyarakat.service";
import { AdminService } from "@/servers/services/admin.service";
import { EducationService } from "@/servers/services/education.service";
import SuperAdminDashboard from "@/components/root/super-admin/SuperAdminDashboard";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import PageHeader from "@/components/root/PageHeader";
import PageStats from "@/components/root/PageStats";
import { Users, UserCheck, UserX, Clock, Building2, BookOpen } from "lucide-react";

export default async function SuperAdminPage() {
  const [allMasyarakat, admins, educations] = await Promise.all([
    MasyarakatService.getAll(),
    AdminService.getAll(),
    EducationService.getAll(),
  ]);

  const waitingCount = allMasyarakat.filter(
    (m) => m.status === "WAITING",
  ).length;
  const approvedCount = allMasyarakat.filter(
    (m) => m.status === "APPROVED",
  ).length;
  const rejectedCount = allMasyarakat.filter(
    (m) => m.status === "REJECTED",
  ).length;

  return (
    <main className="min-h-screen w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="Beranda" subtitle="Ringkasan sistem Trash Bank" />
      </div>

      <PageStats
        stats={[
          { title: "Total Masyarakat", value: allMasyarakat.length, icon: Users },
          { title: "Menunggu Approval", value: waitingCount, icon: Clock },
          { title: "Disetujui", value: approvedCount, icon: UserCheck },
          { title: "Ditolak", value: rejectedCount, icon: UserX },
          { title: "Bank Sampah", value: admins.length, icon: Building2 },
          { title: "Artikel Edukasi", value: educations.length, icon: BookOpen },
        ]}
      />

      <SuperAdminDashboard
        allMasyarakat={allMasyarakat}
        adminCount={admins.length}
        educationCount={educations.length}
      />
    </main>
  );
}
