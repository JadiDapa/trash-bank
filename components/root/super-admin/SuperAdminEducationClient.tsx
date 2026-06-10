"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Education } from "@/generated/prisma";
import { BookOpen, Trash2, Pencil, CalendarDays } from "lucide-react";
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

type Props = { educations: Education[] };

export default function SuperAdminEducationClient({ educations }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete(education: Education) {
    startTransition(async () => {
      try {
        const { deleteEducation } = await import("@/app/action/education.action");
        await deleteEducation(education.id);
        toast.success("Artikel dihapus");
        setDeleteTarget(null);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  if (educations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
          <BookOpen className="size-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-muted-foreground text-sm">Belum ada artikel edukasi</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {educations.map((e) => (
          <div
            key={e.id}
            className="bg-card flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
          >
            {/* Thumbnail */}
            {e.imageUrl ? (
              <div className="relative aspect-video w-full shrink-0">
                <Image src={e.imageUrl} alt={e.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
              </div>
            ) : (
              <div className="flex aspect-video w-full shrink-0 items-center justify-center bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                <BookOpen className="size-10 text-green-500 dark:text-green-400" />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <p className="line-clamp-2 text-sm font-semibold leading-snug">
                {e.title}
              </p>
              {e.description && (
                <p className="text-muted-foreground line-clamp-2 flex-1 text-xs">
                  {e.description.replace(/<[^>]+>/g, " ").trim()}
                </p>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CalendarDays className="size-3 shrink-0" />
                <span>
                  {format(new Date(e.createdAt), "d MMM yyyy", { locale: idLocale })}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Actions */}
            <div className="flex gap-2 p-4">
              <Button size="sm" variant="outline" className="flex-1 gap-1.5" asChild>
                <Link href={`/super-admin/edukasi/${e.id}/edit`}>
                  <Pencil className="size-3.5" /> Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 gap-1.5"
                onClick={() => setDeleteTarget(e)}
              >
                <Trash2 className="size-3.5" /> Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <AlertDialog open onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
              <AlertDialogDescription>
                Artikel &quot;{deleteTarget.title}&quot; akan dihapus permanen.
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
