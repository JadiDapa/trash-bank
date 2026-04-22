"use client";

import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { EducationType } from "@/servers/validators/education.validator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EducationList({
  educations,
}: {
  educations: EducationType[];
}) {
  return (
    <main className="mt-2 space-y-3 py-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Edukasi Terakhir</p>

        <Link
          href="/edukasi-lingkungan"
          className="text-muted-foreground flex items-center gap-1 text-xs"
        >
          <p>Lihat</p>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* SWIPER */}
      <Swiper spaceBetween={12} slidesPerView={1.3} className="-mx-4 px-4">
        {educations.map((item) => (
          <SwiperSlide key={item.id} className="w-auto">
            <Link href={`/education/${item.id}`}>
              <Card className="flex flex-row gap-3 overflow-hidden rounded-2xl border p-3 shadow-sm transition hover:shadow-md">
                {/* IMAGE */}
                <div className="bg-muted relative size-20 overflow-hidden rounded-md">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full w-full items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                  {/* DATE */}
                  <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <Calendar className="size-3" />
                    {format(new Date(item.createdAt), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </div>

                  {/* TITLE */}
                  <p className="line-clamp-2 text-sm leading-tight font-semibold">
                    {item.title}
                  </p>
                </div>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
