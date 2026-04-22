import { getCurrentUser } from "@/app/action/user.actions";
import UserCard from "@/components/root/user/UserCard";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserService } from "@/servers/services/user.service";
import { ChevronLeft, Search, Settings2, Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") return redirect("/");
  const users = await UserService.getAll();
  return (
    <ScrollArea className="bg-background h-screen w-full space-y-4 md:rounded-2xl md:border">
      <div className="w-full space-y-2">
        <div className="bg-primary flex flex-col gap-4 px-3 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <ChevronLeft className="size-5" />
              </Link>
              <h1 className="text-center font-medium">Daftar Pengguna</h1>
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
            <p className="text-sm font-medium">Total Pengguna:</p>
            <p className="font-semibold">{users.length}</p>
          </div>
          {users.map((dp) => (
            <UserCard key={dp.id} user={dp} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
