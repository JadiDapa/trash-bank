import { notFound } from "next/navigation";
import { EducationService } from "@/servers/services/education.service";
import EducationFormClient from "@/components/root/super-admin/EducationFormClient";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const education = await EducationService.getById(Number(id));
  if (!education) notFound();

  return (
    <EducationFormClient
      mode="edit"
      initial={{
        id: education.id,
        title: education.title,
        description: education.description,
        imageUrl: education.imageUrl,
      }}
    />
  );
}
