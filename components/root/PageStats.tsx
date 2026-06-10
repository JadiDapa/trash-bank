import { LucideIcon } from "lucide-react";

interface Stat {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

export default function PageStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl border sm:flex-row">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex flex-1 items-center gap-4 px-6 py-4 ${
            i !== stats.length - 1 ? "border-b sm:border-b-0 sm:border-r" : ""
          }`}
        >
          <div className="bg-primary/10 rounded-lg p-2.5 shrink-0">
            <stat.icon className="text-primary size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-muted-foreground text-xs">{stat.title}</p>
            <p className="text-xl font-semibold tracking-tight">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString("id-ID")
                : stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
