import type { ReactNode } from "react";

/** Product surface for previews in MDX, so they follow the theme instead of the docs page. */
export function Surface({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-border bg-background p-panel text-foreground">{children}</div>;
}
