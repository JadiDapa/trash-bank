"use client";

type Props = {
  points: number;
  grammage: number;
};

export default function MyStats({ points, grammage }: Props) {
  return (
    <div className="bg-primary w-full max-w-md rounded-2xl border p-4">
      {/* Values */}
      <div className="flex items-center justify-between">
        {/* Points */}
        <div className="flex flex-col">
          <p className="text-xs font-medium">My Points</p>
          <span className="text-card text-lg font-semibold">
            {points.toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <div className="bg-card h-10 w-px" />

        {/* Grammage */}
        <div className="flex flex-col text-right">
          <p className="text-xs font-medium">Grammage </p>
          <span className="text-card text-lg font-semibold">
            {grammage.toLocaleString()} g
          </span>
        </div>
      </div>
    </div>
  );
}
