"use client";

import Link from "next/link";
import Image from "next/image";
import { Education } from "@/generated/prisma";
import { ChevronLeft, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = { educations: Education[] };

export default function EducationListClient({ educations }: Props) {
  return (
    <ScrollArea className="bg-background h-screen w-full md:rounded-2xl md:border">
      <div className="space-y-4 pb-8">
        {/* Header */}
        <div className="bg-primary px-4 pt-6 pb-4 space-y-2">
          <div className="flex items-center gap-3">
            <Link href="/"><ChevronLeft className="size-5" /></Link>
            <h1 className="font-semibold">Edukasi Lingkungan</h1>
          </div>
          <p className="text-primary-foreground/70 text-sm">Artikel dan panduan ramah lingkungan</p>
        </div>

        <div className="space-y-3 px-4">
          {educations.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <BookOpen className="text-muted-foreground size-10" />
              <p className="text-muted-foreground text-sm">Belum ada konten edukasi</p>
            </div>
          )}
          {educations.map((e) => (
            <Link
              key={e.id}
              href={`/edukasi-lingkungan/${e.id}`}
              className="bg-card flex gap-4 rounded-xl border overflow-hidden transition active:scale-[0.99]"
            >
              {e.imageUrl ? (
                <div className="relative size-24 shrink-0 overflow-hidden">
                  <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="bg-muted flex size-24 shrink-0 items-center justify-center">
                  <BookOpen className="text-muted-foreground size-8" />
                </div>
              )}
              <div className="flex-1 py-3 pr-4 space-y-1">
                <p className="font-semibold text-sm line-clamp-2">{e.title}</p>
                {e.description && (
                  <p className="text-muted-foreground text-xs line-clamp-2">{e.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
