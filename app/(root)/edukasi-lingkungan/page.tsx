import { EducationService } from "@/servers/services/education.service";
import EducationListClient from "@/components/root/citizen/EducationListClient";

export default async function EdukasiPage() {
  const educations = await EducationService.getAll();
  return <EducationListClient educations={educations} />;
}
