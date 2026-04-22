import { getCurrentUser } from "../action/user.actions";
import Link from "next/link";
import { Coins, MessageCircleQuestion, Trash, Users } from "lucide-react";
import { DepositService } from "@/servers/services/deposit.service";
import MainPageHeader from "@/components/root/home/MainPageHeader";
import MyDeposits from "@/components/root/home/MyDeposits";
import MyStats from "@/components/root/home/MyStats";
import { PointExchangeService } from "@/servers/services/point-exchange.service";
import MyExchanges from "@/components/root/home/MyExchanges";
import { UserService } from "@/servers/services/user.service";
import UserList from "@/components/root/home/UserList";
import { EducationService } from "@/servers/services/education.service";
import EducationList from "@/components/root/home/EducationList";
import Image from "next/image";

export default async function HomePage() {
  const user = await getCurrentUser();
  const userRole = user.role;
  const myDeposits = await DepositService.getByUserId(user.id);
  const myExchanges = await PointExchangeService.getByUserId(user.id);
  const educations = await EducationService.getAll();
  const users = await UserService.getAll();

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
      Icon: MessageCircleQuestion,
    },

    {
      title: "Pengguna",
      href: "/pengguna",
      Icon: Users,
      role: ["ADMIN"],
    },
  ];

  const filteredMenu = menu.filter((item) => {
    if (!item.role) return true;
    return item.role.includes(userRole);
  });

  return (
    <main className="bg-background h-screen w-full overflow-y-auto md:rounded-2xl md:border">
      <div className="relative w-full min-w-0 space-y-4 px-4 py-6">
        <MainPageHeader user={user} />

        <div className="bg-card space-y-4 rounded-lg p-2 shadow-md">
          <MyStats grammage={user.grammage} points={user.points} />
          <div className="grid grid-cols-4">
            {filteredMenu.map((item) => (
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
        <div className="flex items-center justify-between">
          <p className="tepi text-sm font-semibold">Presented by:</p>

          <div className="flex gap-2">
            <figure>
              <Image
                className="drop-shadow-md"
                src="https://logo.uajy.ac.id/wp-content/uploads/2025/05/Logo-Tersier-Diktisaintek-Berdampak-1.png"
                alt="Hero"
                width={32}
                height={32}
              />
            </figure>
            <figure>
              <Image
                className="drop-shadow-md"
                src="https://iconlogovector.com/uploads/images/2024/03/lg-65eaafee8ca44-TUT-WURI-HANDAYANI.webp"
                alt="Hero"
                width={32}
                height={32}
              />
            </figure>

            <figure>
              <Image
                className="drop-shadow-md"
                src="/logo-polsri.png"
                alt="Hero"
                width={32}
                height={32}
              />
            </figure>
            <figure>
              <Image
                className="drop-shadow-md"
                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Logo_resmi_LPDP.png"
                alt="Hero"
                width={64}
                height={32}
              />
            </figure>
          </div>
        </div>

        <MyDeposits deposits={myDeposits} />
        <MyExchanges exchanges={myExchanges} />
        <EducationList educations={educations} />
        <UserList users={users} />
      </div>
    </main>
  );
}
