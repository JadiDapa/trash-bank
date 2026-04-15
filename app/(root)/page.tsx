import { getCurrentUser } from "../action/user.actions";
import Link from "next/link";
import {
  Coins,
  MoreHorizontal,
  Plus,
  Receipt,
  Trash,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepositService } from "@/servers/services/deposit.service";
import MainPageHeader from "@/components/root/home/MainPageHeader";
import MyDeposits from "@/components/root/home/MyDeposits";
import MyStats from "@/components/root/home/MyStats";
import { PointExchangeService } from "@/servers/services/point-exchange.service";
import MyExchanges from "@/components/root/home/MyExchanges";

export default async function HomePage() {
  const user = await getCurrentUser();
  const myDeposits = await DepositService.getByUserId(user.id);
  const myExchanges = await PointExchangeService.getByUserId(user.id);

  const menu = [
    {
      title: "Setor Sampah",
      href: "/setor-sampah",
      Icon: Trash,
    },
    {
      title: "Tukar Poin",
      href: "/tukar-poin",
      Icon: Coins,
    },

    {
      title: "Edukasi Lingkungan",
      href: "/edukasi-lingkungan",
      Icon: Users,
    },

    {
      title: "Selengkapnya",
      href: "#",
      Icon: MoreHorizontal,
    },
  ];

  return (
    <ScrollArea className="bg-background h-[98vh] w-full space-y-4 border md:rounded-2xl">
      <div className="relative w-full px-4 py-6">
        <MainPageHeader user={user} />

        <div className="bg-card space-y-4 rounded-lg p-2 shadow-md">
          <MyStats grammage={user.grammage} points={user.points} />
          <div className="grid grid-cols-4">
            {menu.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex flex-col items-center gap-1"
              >
                <div className="bg-muted-foreground text-primary-foreground hover:bg-primary/90 max-w-fit rounded-md p-2.5">
                  <item.Icon className="size-6" />
                </div>
                <p className="text-center text-[10px] font-medium">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <MyDeposits deposits={myDeposits} />
        <MyExchanges exchanges={myExchanges} />

        {/* ✅ FAB inside relative container */}
        <div className="sticky bottom-4 flex justify-end">
          <Link href="/setor-sampah">
            <div className="bg-primary text-card rounded-full p-4 shadow-lg">
              <Plus className="size-6" />
            </div>
          </Link>
        </div>
      </div>
    </ScrollArea>
  );
}
