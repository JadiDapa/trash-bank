"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { Card } from "@/components/ui/card";
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
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExchangeFormType>({
    resolver: zodResolver(CreatePointExchangeSchema),
    defaultValues: {
      userId: userId,
      grammage: 0,
      points: 0,
    },
  });

  async function onSubmit(values: ExchangeFormType) {
    startTransition(async () => {
      try {
        await createPointExchange({
          ...values,
        });
        toast.success("Ticket created!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  const lastChanged = useRef<"grammage" | "points" | null>(null);

  const grammage = useWatch({ control: form.control, name: "grammage" });
  const points = useWatch({ control: form.control, name: "points" });

  useEffect(() => {
    if (lastChanged.current === "grammage") {
      const converted = grammage / 100;
      form.setValue("points", Number.isNaN(converted) ? 0 : converted, {
        shouldValidate: true,
      });
    }
  }, [grammage]);

  // Update grammage kalau points berubah
  useEffect(() => {
    if (lastChanged.current === "points") {
      const converted = points * 100;
      form.setValue("grammage", Number.isNaN(converted) ? 0 : converted, {
        shouldValidate: true,
      });
    }
  }, [points]);

  return (
    <Card className="bg-primary text-card fixed right-0 bottom-0 left-0 w-full rounded-t-2xl border-t p-3 shadow-xl sm:left-1/2 sm:max-w-sm sm:-translate-x-1/2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-semibold">Tukar Poin</p>
            <p className="text-secondary text-xs">
              Gramasi : <span className="font-semibold">{myGrammage}</span>
            </p>
          </div>
          <p className="text-card font-medium">100g = 1 poin</p>
        </div>

        {/* Inputs */}
        <div className="flex items-end gap-2">
          {/* Grammage */}
          <Controller
            name="grammage"
            control={form.control}
            render={({ field }) => (
              <div className="flex-1">
                <FieldLabel className="text-xs">Gram</FieldLabel>
                <InputGroup className="bg-card border-muted">
                  <InputGroupInput
                    {...field}
                    type="number"
                    className="text-foreground h-8 text-sm"
                    onChange={(e) => {
                      lastChanged.current = "grammage";
                      field.onChange(Number(e.target.value));
                    }}
                    placeholder="0"
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
              <div className="w-20">
                <FieldLabel className="text-xs">Poin</FieldLabel>
                <InputGroup className="bg-card border-muted">
                  <InputGroupInput
                    {...field}
                    type="number"
                    className="text-foreground h-8 text-sm"
                    onChange={(e) => {
                      lastChanged.current = "points";
                      field.onChange(Number(e.target.value));
                    }}
                    placeholder="0"
                  />
                </InputGroup>
              </div>
            )}
          />

          {/* Button */}
          <Button
            type="submit"
            size="sm"
            className="bg-card h-9 px-3"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <Spinner className="text-primary size-4" />
            ) : (
              <Plus className="text-primary size-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
