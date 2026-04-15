import { getCurrentUser } from "@/app/action/user.actions";
import AddEducationDialog from "@/components/root/education/AddEducationDialog";
import EducationCard from "@/components/root/education/EducationCard";
import { EducationService } from "@/servers/services/education.service";

export default async function EducationPage() {
  const educations = await EducationService.getAll();
  const user = await getCurrentUser();
  return (
    <main className="bg-card min-h-screen w-full space-y-8 border p-4 md:rounded-2xl lg:p-6">
      <h1 className="text-center text-3xl font-semibold">EDUKASI LINGKUNGAN</h1>
      <div className="">
        {educations.map((dp) => (
          <EducationCard key={dp.id} education={dp} />
        ))}
      </div>
      {user.role === "ADMIN" && <AddEducationDialog userId={user.id} />}
    </main>
  );
}
