"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type EducationType = {
  id: number;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  createdAt: Date;
};

export default function EducationCard({
  education,
}: {
  education: EducationType;
}) {
  return (
    <Link href={`/edukasi-lingkungan/${education.id}`} className="w-full">
      <div className="bg-card hover:bg-muted/50 flex gap-3 rounded-xl border p-3 transition active:scale-[0.99]">
        {/* IMAGE */}
        <div className="bg-muted relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
          {education.imageUrl ? (
            <Image
              src={education.imageUrl}
              alt={education.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center text-[10px]">
              No Image
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Title */}
          <p className="line-clamp-2 leading-tight font-semibold">
            {education.title}
          </p>

          {/* Date */}
          <p className="text-muted-foreground mt-1 text-[10px]">
            {format(new Date(education.createdAt), "dd MMM yyyy", {
              locale: id,
            })}
          </p>

          {/* Description */}
          {education.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
              {education.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
