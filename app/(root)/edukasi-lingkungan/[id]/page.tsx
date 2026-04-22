import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { EducationService } from "@/servers/services/education.service";
import { format } from "date-fns";

export default async function EducationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const education = await EducationService.getById(Number(id));

  if (!education) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Edukasi tidak ditemukan</p>
      </div>
    );
  }

  return (
    <ScrollArea className="bg-background h-screen w-full md:rounded-2xl md:border">
      <div className="w-full">
        {/* HEADER */}
        <div className="bg-primary flex items-center gap-4 px-3 pt-6 pb-3">
          <Link href="/edukasi-lingkungan">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-medium">Edukasi</h1>
        </div>

        {/* CONTENT */}
        <div className="mx-auto max-w-md space-y-4 p-4">
          {/* IMAGE */}
          {education.imageUrl && (
            <div className="relative h-52 w-full overflow-hidden rounded-xl">
              <Image
                src={education.imageUrl}
                alt={education.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* TITLE */}
          <h1 className="text-xl leading-tight font-semibold">
            {education.title}
          </h1>

          {/* DATE */}
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <p className="text-muted-foreground text-xs">
              {format(new Date(education.createdAt), "dd MMM yyyy")}
            </p>
          </div>

          {/* DIVIDER */}
          <div className="bg-muted h-px w-full" />

          {/* DESCRIPTION */}
          <div className="prose prose-sm text-foreground max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {education.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
