import { Card } from "@/components/ui/card";
import { PointExchange } from "@/generated/prisma";
import { ArrowRight } from "lucide-react";

export default function ExchangePointCard({
  exchange,
}: {
  exchange: PointExchange;
}) {
  return (
    <Card className="w-full gap-2 space-y-2 p-3">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Penukaran Poin</p>
        <p className="text-muted-foreground text-xs">
          {exchange.createdAt.toLocaleDateString()}
        </p>
      </div>

      {/* Conversion Row */}
      <div className="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2">
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Gram</p>
          <p className="font-semibold">{exchange.grammage}g</p>
        </div>

        <ArrowRight className="text-muted-foreground size-4" />

        <div className="text-center">
          <p className="text-muted-foreground text-xs">Poin</p>
          <p className="text-primary font-semibold">+{exchange.points}</p>
        </div>
      </div>

      {/* Conversion Info */}
      <p className="text-muted-foreground text-center text-[10px]">
        100 gram = 1 poin
      </p>

      {/* Optional Description */}
      {exchange.description && (
        <p className="text-muted-foreground text-xs">{exchange.description}</p>
      )}
    </Card>
  );
}
