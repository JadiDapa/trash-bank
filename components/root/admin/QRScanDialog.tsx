"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  trigger?: React.ReactNode;
};

export default function QRScanDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
      setError(null);
      setScanned(false);
      return;
    }

    let cancelled = false;

    async function startScanner() {
      if (cancelled) return;

      const el = document.getElementById("qr-reader-dialog");
      if (!el) {
        if (!cancelled) setError("Gagal menginisialisasi scanner. Coba lagi.");
        return;
      }

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        const scanner = new Html5Qrcode("qr-reader-dialog");

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 280 } },
          (decodedText: string) => {
            if (cancelled) return;
            scanner.stop().catch(() => {});
            setScanned(true);
            setOpen(false);
            try {
              const url = new URL(decodedText);
              router.push(url.pathname);
            } catch {
              router.push(decodedText);
            }
          },
          undefined,
        );

        if (!cancelled) {
          scannerRef.current = scanner;
        } else {
          scanner.stop().catch(() => {});
        }
      } catch {
        if (!cancelled)
          setError("Gagal membuka kamera. Pastikan izin kamera sudah diberikan.");
      }
    }

    const timeout = setTimeout(startScanner, 200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [open]);

  function retry() {
    setError(null);
    setOpen(false);
    setTimeout(() => setOpen(true), 150);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="shrink-0 gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5">
            <QrCode className="size-4 text-primary" />
            Scan QR
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary/5 border-b px-6 py-5 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-4 ring-primary/5">
            <QrCode className="size-7 text-primary" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-lg">Scan QR Tiket</DialogTitle>
            <DialogDescription className="text-center text-sm">
              Arahkan kamera ke QR code milik warga
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6">
          {error ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="size-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Kamera tidak dapat dibuka</p>
                <p className="text-muted-foreground text-xs">{error}</p>
              </div>
              <Button size="sm" variant="destructive" onClick={retry} className="gap-2 px-6">
                <RefreshCw className="size-3.5" />
                Coba Lagi
              </Button>
            </div>
          ) : scanned ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-green-50 px-6 py-8 text-center dark:bg-green-950/20">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                QR berhasil dibaca, mengalihkan...
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border-2 border-dashed border-primary/20 bg-black/5 dark:bg-white/5">
              <div id="qr-reader-dialog" className="w-full" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
