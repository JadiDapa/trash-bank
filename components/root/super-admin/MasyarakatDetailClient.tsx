"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle, ShieldAlert } from "lucide-react";
import { Masyarakat } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Props = { masyarakat: Masyarakat };

export default function MasyarakatDetailClient({ masyarakat: m }: Props) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleApprove() {
    startTransition(async () => {
      try {
        const { reviewMasyarakat } = await import("@/app/action/masyarakat.action");
        await reviewMasyarakat({ masyarakatId: m.id, action: "APPROVE" });
        toast.success(`${m.name} berhasil disetujui`);
        router.push("/super-admin/masyarakat");
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      try {
        const { reviewMasyarakat } = await import("@/app/action/masyarakat.action");
        await reviewMasyarakat({
          masyarakatId: m.id,
          action: "REJECT",
          rejectedReason: rejectReason.trim() || undefined,
        });
        toast.success(`${m.name} telah ditolak`);
        router.push("/super-admin/masyarakat");
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <div className="bg-card rounded-2xl border p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <ShieldAlert className="text-primary size-5" />
        </div>
        <div>
          <h2 className="font-semibold">Tinjau Pendaftaran</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Setujui untuk memberikan akses ke platform, atau tolak dengan alasan yang jelas.
          </p>
        </div>
      </div>

      {!showReject ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleApprove}
            disabled={isPending}
            className="h-11 flex-1 gap-2 rounded-xl font-semibold"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <>
                <CheckCircle className="size-4" />
                Setujui Pendaftaran
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowReject(true)}
            disabled={isPending}
            className="h-11 flex-1 gap-2 rounded-xl font-semibold"
          >
            <XCircle className="size-4" />
            Tolak Pendaftaran
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Alasan Penolakan{" "}
              <span className="text-muted-foreground font-normal">(opsional)</span>
            </Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan agar pendaftar dapat memperbaiki data..."
              rows={3}
              className="resize-none rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowReject(false);
                setRejectReason("");
              }}
              disabled={isPending}
              className="h-11 flex-1 rounded-xl"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isPending}
              className="h-11 flex-1 gap-2 rounded-xl font-semibold"
            >
              {isPending ? <Spinner /> : "Konfirmasi Penolakan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
