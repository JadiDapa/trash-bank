import { getCurrentUser } from "@/app/action/user.actions";
import ExchangePoint from "@/components/root/exchange/ExchangePoint";
import ExchangePointCard from "@/components/root/history/ExchangePointCard";
import { PointExchangeService } from "@/servers/services/point-exchange.service";

export default async function ExchangeHistoryPage() {
  const exchanges = await PointExchangeService.getAll();
  const user = await getCurrentUser();
  return (
    <main className="bg-card min-h-screen w-full space-y-8 border p-4 md:rounded-2xl lg:p-6">
      <h1 className="text-center text-3xl font-semibold">RIWAYAT TRANSAKSI</h1>
      <div className="">
        {exchanges.map((ex) => (
          <ExchangePointCard key={ex.id} exchange={ex} />
        ))}
      </div>
      <ExchangePoint userId={user.id} />
    </main>
  );
}
