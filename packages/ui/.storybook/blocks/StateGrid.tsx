import type { ReactNode } from "react";

/** Labelled grid for state matrices in stories. Docs only. */
export function StateGrid({ items }: { items: { label: string; node: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-between-groups md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-start gap-in-group">
          <span className="text-sm text-muted-foreground">{item.label}</span>
          {item.node}
        </div>
      ))}
    </div>
  );
}
