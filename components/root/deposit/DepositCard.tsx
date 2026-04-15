"use client";

import { Card } from "@/components/ui/card";
import { Deposit } from "@/generated/prisma";
import { Recycle } from "lucide-react";

const trashStyles = {
  PLASTIC: "bg-blue-100 text-blue-600",
  PAPER: "bg-yellow-100 text-yellow-700",
  GLASS: "bg-green-100 text-green-600",
  METAL: "bg-gray-200 text-gray-700",
};

export default function DepositCard({ deposit }: { deposit: Deposit }) {
  return (
    <Card className="w-full gap-2 rounded-2xl p-4 shadow-sm transition active:scale-[0.98]">
      <div className="flex items-center justify-between">
        {/* Left: Icon + Type */}
        <div className="flex items-center gap-2">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${trashStyles[deposit.trashType]}`}
          >
            <Recycle className="size-6" />
          </div>

          <div className="flex flex-col">
            <p className="text-lg font-medium">{deposit.trashType}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(deposit.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Right: Grammage */}
        <div className="text-right">
          <p className="text-lg leading-tight font-semibold">
            {deposit.grammage}
            <span className="text-muted-foreground ml-1 text-xs font-normal">
              g
            </span>
          </p>
        </div>
      </div>

      {/* Description */}
      {deposit.description && (
        <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
          {deposit.description}
        </p>
      )}
    </Card>
  );
}
