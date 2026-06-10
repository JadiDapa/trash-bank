"use client";

import QRCode from "react-qr-code";

type Props = { value: string; size?: number };

export default function QRCodeDisplay({ value, size = 200 }: Props) {
  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${value}`
    : value;

  return (
    <div className="flex items-center justify-center rounded-xl bg-white p-4">
      <QRCode value={fullUrl} size={size} />
    </div>
  );
}
