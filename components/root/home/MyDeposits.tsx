import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepositType } from "@/servers/validators/deposit.validator";
import { ChevronRight, Recycle } from "lucide-react";
import Link from "next/link";

const trashStyles = {
  PLASTIC: "bg-blue-100 text-blue-600",
  PAPER: "bg-yellow-100 text-yellow-700",
  GLASS: "bg-green-100 text-green-600",
  METAL: "bg-gray-200 text-gray-700",
};

export default function MyDeposits({ deposits }: { deposits: DepositType[] }) {
  return (
    <main className="mt-2 space-y-3 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Setoran Terbaru</p>
        <Link
          href={"/setor-sampah"}
          className="text-muted-foreground flex cursor-pointer items-center gap-1 text-xs"
        >
          <p>Lihat</p>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Scroll */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max gap-3">
          {deposits.map((dp) => (
            <Card
              key={dp.id}
              className="w-56 gap-1 rounded-2xl border p-3 shadow-sm transition hover:shadow-md"
            >
              {/* Top: Type */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${trashStyles[dp.trashType]}`}
                >
                  <Recycle className="size-3" />
                  {dp.trashType}
                </div>

                <span className="text-muted-foreground text-xs">
                  {new Date(dp.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Grammage */}
              <div className="mt-3">
                <p className="text-2xl font-semibold">
                  {dp.grammage} <span className="text-sm font-normal">g</span>
                </p>
                <p className="text-muted-foreground text-xs">Grammage</p>
              </div>

              {/* Description */}
              {dp.description && (
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {dp.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}
