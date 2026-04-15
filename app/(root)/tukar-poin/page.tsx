import { getCurrentUser } from "@/app/action/user.actions";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Search, Settings2, Upload } from "lucide-react";
import { PointExchangeService } from "@/servers/services/point-exchange.service";
import ExchangePointCard from "@/components/root/history/ExchangePointCard";
import ExchangePoint from "@/components/root/exchange/ExchangePoint";
import Link from "next/link";

export default async function ExchangePage() {
  const user = await getCurrentUser();
  const exchanges = await PointExchangeService.getByUserId(user.id);
  return (
    <ScrollArea className="bg-background relative h-[98vh] w-full space-y-4 border md:rounded-2xl">
      <div className="w-full space-y-2">
        <div className="bg-primary flex flex-col gap-4 px-3 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <ChevronLeft className="size-5" />
              </Link>
              <h1 className="text-center font-medium">Penukaran Poin</h1>
            </div>
            <Upload className="size-5" />
          </div>
          <div className="bg-card sitems-center flex items-center justify-between rounded-lg border">
            <div className="flex items-center gap-2 px-3 py-1">
              <Search className="size-6" />
              <Input className="h-7 border-0 shadow-none" />
            </div>
            <div className="border-s px-3 py-1">
              <Settings2 />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-3">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm font-medium">Total Poin:</p>
            <p className="font-semibold">{user.points} Poin</p>
          </div>
          {exchanges.map((ex) => (
            <ExchangePointCard key={ex.id} exchange={ex} />
          ))}

          <ExchangePoint userId={user.id} myGrammage={user.grammage} />
        </div>
      </div>
    </ScrollArea>
  );
}
