"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { CreateDepositSchema } from "@/servers/validators/deposit.validator";
import { createDeposit } from "@/app/action/deposit.action";
import { TrashType } from "@/generated/prisma";

import { Plus } from "lucide-react";

type DepositFormType = z.infer<typeof CreateDepositSchema>;

export default function AddDeposit({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<DepositFormType>({
    resolver: zodResolver(CreateDepositSchema),
    defaultValues: {
      userId: userId,
      grammage: 0,
      description: "",
      trashType: "PAPER",
    },
    mode: "onChange",
  });

  async function onSubmit(values: DepositFormType) {
    startTransition(async () => {
      try {
        await createDeposit(values);

        toast.success("Setoran berhasil ditambahkan!");

        form.reset({
          userId: userId,
          grammage: 0,
          description: "",
          trashType: "PAPER",
        });

        setOpen(false); // ✅ close drawer after success
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* FLOATING BUTTON */}
      <DrawerTrigger
        asChild
        className="fixed bottom-0 left-1/2 z-50 max-w-sm -translate-x-1/2 overflow-hidden"
      >
        <div className="bg-primary w-full cursor-pointer p-2">
          <button className="bg-muted flex h-12 w-full items-center justify-center gap-2 rounded-full px-4 py-3 transition hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="size-5" />
            <span className="text-sm font-medium">Tambah Setoran</span>
          </button>
        </div>
      </DrawerTrigger>

      {/* DRAWER */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle>Tambah Setoran</DrawerTitle>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="flex w-full items-end gap-2">
              {/* Trash Type */}
              <Controller
                name="trashType"
                control={form.control}
                render={({ field }) => (
                  <div className="flex-1">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 w-full text-sm">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TrashType).map((type) => (
                          <SelectItem key={type} value={String(type)}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              {/* Grammage */}
              <Controller
                name="grammage"
                control={form.control}
                render={({ field }) => (
                  <div className="flex-1">
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="Gramasi Sampah"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </InputGroup>
                  </div>
                )}
              />
            </div>

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <div className="overflow-hidden rounded-md border">
                  <InputGroupTextarea
                    {...field}
                    className="min-h-14 text-sm"
                    placeholder="Tambahkan catatan..."
                  />
                  <InputGroupAddon align="block-end" className="justify-end">
                    <InputGroupText>
                      {field.value?.length || 0}/280
                    </InputGroupText>
                  </InputGroupAddon>
                </div>
              )}
            />
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? <Spinner className="size-4" /> : "Tambah Setoran"}
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
