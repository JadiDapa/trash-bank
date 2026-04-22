import { getCurrentUser } from "@/app/action/user.actions";
import AddDeposit from "@/components/root/deposit/AddDeposit";
import AddDepositDialog from "@/components/root/deposit/AddDepositDialog";
import DepositCard from "@/components/root/deposit/DepositCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepositService } from "@/servers/services/deposit.service";
import { ChevronLeft, Search, Settings2, Upload } from "lucide-react";
import Link from "next/link";

export default async function DepositPage() {
  const user = await getCurrentUser();
  const deposits = await DepositService.getByUserId(user.id);
  return (
    <ScrollArea className="bg-background h-screen w-full space-y-4 md:rounded-2xl md:border">
      <div className="w-full space-y-2">
        <div className="bg-primary flex flex-col gap-4 px-3 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <ChevronLeft className="size-5" />
              </Link>
              <h1 className="text-center font-medium">Setor Sampah</h1>
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
            <p className="text-sm font-medium">Total Setoran:</p>
            <p className="font-semibold">{user.grammage} g</p>
          </div>
          {deposits.map((dp) => (
            <DepositCard key={dp.id} deposit={dp} />
          ))}

          <AddDeposit userId={user.id} />
        </div>
      </div>
    </ScrollArea>
  );
}
