"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Admin } from "@/generated/prisma";
import { Building2, Trash2, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = { admins: (Admin & { user: any })[] };

export default function SuperAdminAdminClient({ admins }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete(admin: Admin) {
    startTransition(async () => {
      try {
        const { deleteAdmin } = await import("@/app/action/admin.action");
        await deleteAdmin(admin.id);
        toast.success("Admin berhasil dihapus");
        setDeleteTarget(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  if (admins.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
          <Building2 className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-muted-foreground text-sm">
          Belum ada bank sampah terdaftar
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {admins.map((a) => (
          <div
            key={a.id}
            className="bg-card flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
          >
            {/* Header — icon + label + delete */}
            <div className="flex items-center justify-between p-4 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Building2 className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-muted-foreground text-xs font-medium">
                  Bank Sampah
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8 shrink-0"
                onClick={() => setDeleteTarget(a)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {/* Bank name — main title */}
            <div className="px-4 pb-3">
              <p className="line-clamp-1 text-base font-bold leading-tight">
                {a.bankName}
              </p>

              {/* Chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
                  {a.bankArea}
                </span>
                <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
                  {a.operatingHours}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Footer — address + phone */}
            <div className="flex-1 space-y-1.5 p-4 pt-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span className="line-clamp-2">{a.bankAddress}</span>
              </div>
              {a.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3.5 shrink-0" />
                  <span>{a.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <AlertDialog open onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Bank Sampah?</AlertDialogTitle>
              <AlertDialogDescription>
                Akun admin dan semua data {deleteTarget.bankName} akan dihapus
                permanen. Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDelete(deleteTarget)}
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
