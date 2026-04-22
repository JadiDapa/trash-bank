"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { CreatePointExchangeSchema } from "@/servers/validators/point-exchange.validator";
import { createPointExchange } from "@/app/action/point-exchage";

import { Plus } from "lucide-react";

type ExchangeFormType = z.infer<typeof CreatePointExchangeSchema>;

export default function ExchangePoint({
  userId,
  myGrammage,
}: {
  userId: number;
  myGrammage: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<ExchangeFormType>({
    resolver: zodResolver(CreatePointExchangeSchema),
    defaultValues: {
      userId: userId,
      grammage: 0,
      points: 0,
    },
    mode: "onChange",
  });

  async function onSubmit(values: ExchangeFormType) {
    startTransition(async () => {
      try {
        await createPointExchange(values);
        toast.success("Ticket created!");

        form.reset({
          userId,
          grammage: 0,
          points: 0,
        });

        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const lastChanged = useRef<"grammage" | "points" | null>(null);

  const grammage = useWatch({ control: form.control, name: "grammage" });
  const points = useWatch({ control: form.control, name: "points" });

  // Grammage → Points
  useEffect(() => {
    if (lastChanged.current === "grammage") {
      const converted = grammage / 100;
      form.setValue("points", Number.isNaN(converted) ? 0 : converted, {
        shouldValidate: true,
      });
    }
  }, [grammage]);

  // Points → Grammage
  useEffect(() => {
    if (lastChanged.current === "points") {
      const converted = points * 100;
      form.setValue("grammage", Number.isNaN(converted) ? 0 : converted, {
        shouldValidate: true,
      });
    }
  }, [points]);

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
            <span className="text-sm font-medium">Tukar</span>
          </button>
        </div>
      </DrawerTrigger>

      {/* DRAWER */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle>Tukar Poin</DrawerTitle>
            <p className="text-muted-foreground text-xs">
              Gramasi: <span className="font-semibold">{myGrammage}</span>
            </p>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-right text-xs">100g = 1 poin</p>

            {/* INPUTS */}
            <div className="flex items-end gap-2">
              {/* Grammage */}
              <Controller
                name="grammage"
                control={form.control}
                render={({ field }) => (
                  <div className="flex-1">
                    <FieldLabel className="text-xs">Gram</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          lastChanged.current = "grammage";
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </InputGroup>
                  </div>
                )}
              />

              {/* Points */}
              <Controller
                name="points"
                control={form.control}
                render={({ field }) => (
                  <div className="w-24">
                    <FieldLabel className="text-xs">Poin</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          lastChanged.current = "points";
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </InputGroup>
                  </div>
                )}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <Plus className="size-4" />
                    Tukar Poin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
