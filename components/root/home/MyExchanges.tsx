"use client";

import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { PointExchangeType } from "@/servers/validators/point-exchange.validator";
import { format } from "date-fns";
import { Calendar, ChevronRight, Recycle } from "lucide-react";
import Link from "next/link";

export default function MyExchanges({
  exchanges,
}: {
  exchanges: PointExchangeType[];
}) {
  return (
    <main className="mt-2 space-y-3 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Penukaran Terakhir</p>
        <Link
          href={"/tukar-poin"}
          className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs"
        >
          <p>Lihat</p>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Horizontal scroll — plain div, no Radix quirks */}
      <Swiper spaceBetween={12} slidesPerView={2} className="-mx-4 px-4">
        {exchanges.map((ex) => (
          <SwiperSlide key={ex.id} className="w-24">
            <Card className="gap-1 rounded-2xl border p-3 shadow-sm transition hover:shadow-md">
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                  <Calendar className="size-3" />
                  <span>{format(ex.createdAt, "dd MMM yyyy")}</span>
                </div>
                <div className="rounded-full bg-purple-100 p-1 text-purple-600">
                  <Recycle className="size-3" />
                </div>
              </div>

              {/* Conversion */}
              <div className="bg-muted/50 mt-1 flex items-center justify-between rounded-lg px-2 py-2">
                <div className="text-center">
                  <p className="text-muted-foreground text-[10px]">Gram</p>
                  <p className="text-sm font-semibold">{ex.grammage}g</p>
                </div>
                <span className="text-muted-foreground text-xs">→</span>
                <div className="text-center">
                  <p className="text-muted-foreground text-[10px]">Poin</p>
                  <p className="text-primary text-sm font-semibold">
                    +{ex.points}
                  </p>
                </div>
              </div>

              {/* Description */}
              {ex.description && (
                <p className="text-muted-foreground mt-2 line-clamp-2 text-[10px]">
                  {ex.description}
                </p>
              )}
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
