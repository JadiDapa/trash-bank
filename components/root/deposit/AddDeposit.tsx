"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

import { CreateDepositSchema } from "@/servers/validators/deposit.validator";
import { createDeposit } from "@/app/action/deposit.action";
import { TrashType } from "@/generated/prisma";

type DepositFormType = z.infer<typeof CreateDepositSchema>;

export default function AddDeposit({ userId }: { userId: number }) {
  const [isPending, startTransition] = useTransition();

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
          grammage: undefined,
          description: "",
          trashType: "PAPER",
        });
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <Card className="bg-primary text-card fixed right-0 bottom-0 left-0 w-full rounded-t-2xl border-t p-3 shadow-xl sm:left-1/2 sm:max-w-sm sm:-translate-x-1/2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex w-full items-end gap-2">
          {/* Trash Type */}
          <Controller
            name="trashType"
            control={form.control}
            render={({ field }) => (
              <div className="w-full flex-1">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-card border-muted text-foreground h-8 text-sm">
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
                <InputGroup className="bg-card border-muted">
                  <InputGroupInput
                    {...field}
                    type="number"
                    className="text-foreground h-8 text-sm"
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
            <div className="bg-card overflow-hidden rounded-md">
              <InputGroupTextarea
                {...field}
                className="bg-card border-muted text-foreground min-h-14 text-sm"
                placeholder="Tambahkan catatan..."
                id="block-end-textarea"
              />
              <InputGroupAddon align="block-end" className="justify-between">
                <InputGroupText>0/280</InputGroupText>
                <InputGroupButton
                  variant="default"
                  size="sm"
                  type="submit"
                  className="bg-card text-primary h-9 max-w-fit"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? <Spinner className="size-4" /> : "Tambah"}
                </InputGroupButton>
              </InputGroupAddon>
            </div>
          )}
        />
      </form>
    </Card>
  );
}
