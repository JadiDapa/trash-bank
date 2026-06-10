"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROOT_SEGMENTS = new Set(["admin", "super-admin"]);

const SEGMENT_LABELS: Record<string, string> = {
  "super-admin": "Beranda",
  admin: "Beranda",
  masyarakat: "Masyarakat",
  edukasi: "Edukasi",
  settings: "Pengaturan",
  tiket: "Tiket",
  scan: "Scan QR",
  deposit: "Deposit",
  voucher: "Voucher",
};

function label(segment: string) {
  return (
    SEGMENT_LABELS[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
  );
}

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const rootSegment = segments[0];
  const rootHref = "/" + rootSegment;
  const rest = segments.slice(1);

  return (
    <nav className="text-muted-foreground flex items-center gap-2 text-sm">
      <Link
        href={rootHref}
        className="hover:text-foreground transition-colors"
      >
        Beranda
      </Link>

      {rest.map((seg, idx) => {
        // skip pure-number dynamic segments (e.g. /tiket/deposit/[id])
        if (!isNaN(Number(seg))) return null;

        const href = rootHref + "/" + rest.slice(0, idx + 1).join("/");
        const isLast = idx === rest.length - 1;

        return (
          <span key={href} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? (
              <span className="text-foreground font-medium">{label(seg)}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label(seg)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
