"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Settings } from "@/generated/prisma";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type Props = { settings: Settings };

export default function SuperAdminSettingsClient({ settings }: Props) {
  const [grammageRate, setGrammageRate] = useState(String(settings.grammageToPointRate));
  const [voucherRate, setVoucherRate] = useState(String(settings.pointsToVoucherRate));
  const [isPending, startTransition] = useTransition();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const parsedGrammage = Number(grammageRate);
    const parsedVoucher = Number(voucherRate);

    if (!parsedGrammage || parsedGrammage <= 0 || !parsedVoucher || parsedVoucher <= 0) {
      toast.error("Nilai harus lebih dari 0");
      return;
    }

    startTransition(async () => {
      try {
        const { updateSettings } = await import("@/app/action/settings.action");
        await updateSettings({
          grammageToPointRate: parsedGrammage,
          pointsToVoucherRate: parsedVoucher,
        });
        toast.success("Pengaturan berhasil disimpan!");
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-5">
      {/* Grammage to Point */}
      <div className="bg-card space-y-3 rounded-xl border p-4">
        <div>
          <p className="text-sm font-semibold">Konversi Gramasi ke Poin</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Berapa gram sampah yang dibutuhkan untuk mendapatkan 1 poin
          </p>
        </div>
        <div className="space-y-1">
          <Label>Gram per 1 poin</Label>
          <Input
            type="number"
            min={1}
            step={0.1}
            value={grammageRate}
            onChange={(e) => setGrammageRate(e.target.value)}
          />
        </div>
        {grammageRate && Number(grammageRate) > 0 && (
          <p className="text-muted-foreground text-xs">
            Contoh: 500g sampah = {Math.floor(500 / Number(grammageRate))} poin
          </p>
        )}
      </div>

      {/* Points to Voucher */}
      <div className="bg-card space-y-3 rounded-xl border p-4">
        <div>
          <p className="text-sm font-semibold">Konversi Poin ke Voucher</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Berapa poin yang dibutuhkan untuk mendapatkan 1 voucher
          </p>
        </div>
        <div className="space-y-1">
          <Label>Poin per voucher</Label>
          <Input
            type="number"
            min={1}
            value={voucherRate}
            onChange={(e) => setVoucherRate(e.target.value)}
          />
        </div>
        {voucherRate && Number(voucherRate) > 0 && (
          <p className="text-muted-foreground text-xs">
            Contoh: 1 voucher membutuhkan {Number(voucherRate).toLocaleString()} poin
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="h-11 gap-2">
        {isPending ? <Spinner /> : <><Save className="size-4" /> Simpan Pengaturan</>}
      </Button>
    </form>
  );
}
