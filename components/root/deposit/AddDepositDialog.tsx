"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateDepositSchema } from "@/servers/validators/deposit.validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDeposit } from "@/app/action/deposit.action";
import { TrashType } from "@/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

type DepositFormType = z.infer<typeof CreateDepositSchema>;

export default function AddDepositDialog({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<DepositFormType>({
    resolver: zodResolver(CreateDepositSchema),
    defaultValues: {
      userId: userId,
      grammage: 0,
      description: "",
      trashType: "PAPER",
    },
  });

  async function onSubmit(values: DepositFormType) {
    startTransition(async () => {
      try {
        await createDeposit({
          ...values,
        });
        toast.success("Setoran berhasil ditambahkan!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover:bg-primary inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-95">
          <Plus />
          Tambah Setoran
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Deposit</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data deposit
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex flex-col gap-4">
              <Controller
                name="trashType"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Jenis Sampah</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih EOS..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TrashType).map((u) => (
                          <SelectItem key={u} value={String(u)}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              {/* Full Name */}
              <Controller
                name="grammage"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Gramasi</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <InputGroup>
                      <Textarea {...field} placeholder="Description" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? <Spinner /> : "Tambahkan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
