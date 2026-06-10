import { EducationService } from "@/servers/services/education.service";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EdukasiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const education = await EducationService.getById(Number(id));
  if (!education) notFound();

  return (
    <main className="bg-background min-h-screen w-full">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b">
        <Link href="/edukasi-lingkungan">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-semibold line-clamp-1">{education.title}</h1>
      </div>
      <div className="space-y-4 pb-8">
        {education.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={education.imageUrl}
              alt={education.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="px-4 space-y-3">
          <h2 className="text-xl font-bold">{education.title}</h2>
          {education.description && (
            <div
              className="prose-content text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: education.description }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
