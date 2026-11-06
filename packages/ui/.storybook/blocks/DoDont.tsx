import type { ReactNode } from "react";

import { Surface } from "./Surface";

export type DoDontPair = { do: ReactNode; doWhy: string; dont: ReactNode; dontWhy: string };

/** Side-by-side "Do" and "Don't" examples rendered with real components. Docs only. */
export function DoDont({ pairs }: { pairs: DoDontPair[] }) {
  return (
    <div className="flex flex-col gap-between-groups">
      {pairs.map((pair, index) => (
        <div key={index} className="grid gap-between-groups md:grid-cols-2">
          <Surface>
            <p className="mb-2 text-sm font-semibold">Do</p>
            <div className="mb-3">{pair.do}</div>
            <p className="text-sm text-muted-foreground">{pair.doWhy}</p>
          </Surface>
          <Surface>
            <p className="mb-2 text-sm font-semibold">Don&apos;t</p>
            <div className="mb-3">{pair.dont}</div>
            <p className="text-sm text-muted-foreground">{pair.dontWhy}</p>
          </Surface>
        </div>
      ))}
    </div>
  );
}
