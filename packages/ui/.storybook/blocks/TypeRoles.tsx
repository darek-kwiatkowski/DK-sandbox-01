import { useEffect, useRef, useState } from "react";

type TypeRole = { role: string; classes: string; sample: string; use: string; source: string };

/** Typography roles. Sizes come from Tailwind's existing scale (tokeny.md). */
export const TYPE_ROLES: TypeRole[] = [
  { role: "Page title", classes: "text-xl font-semibold leading-tight", sample: "Panel mentora", use: "One per page, the h1", source: "F2, approved 2026-11-06" },
  { role: "Section title", classes: "text-base font-semibold", sample: "Terminy w tym tygodniu", use: "h2 inside a page", source: "F2, approved 2026-11-06" },
  { role: "Body, lists", classes: "text-sm", sample: "Anna Kowalska · TypeScript, React", use: "Rows of lists and tables", source: "R01.1, K1" },
  { role: "Body, reading", classes: "text-base leading-relaxed", sample: "Problem jest w kolejności middleware: auth wykonuje się po cache, więc…", use: "Session messages, written answer, note", source: "K1, R02.1" },
  { role: "Label", classes: "text-sm font-medium", sample: "Adres e-mail", use: "Form labels, column headers", source: "F2, approved 2026-11-06" },
  { role: "Metadata", classes: "text-sm text-muted-foreground", sample: "Anna Kowalska · 14:05", use: "Author and time, hints, stack", source: "R02.3" },
  { role: "Highlight, lists", classes: "text-sm font-semibold tabular-nums", sample: "pt., 13 lis, 18:00 CET", use: "The one highlighted element in a list: the next slot or the session date", source: "R01.5, K3, P02" },
  { role: "Highlight, session", classes: "text-base text-highlight-foreground tabular-nums", sample: "Zostało 18 min", use: "Time left in a running session", source: "R01.5, K3, P02" },
  { role: "Numbers", classes: "tabular-nums", sample: "180,00 zł · 25 min", use: "Prices, durations, counts; digits align", source: "F2, approved 2026-11-06" },
  { role: "Code", classes: "font-mono text-sm bg-code text-code-foreground rounded-sm px-1", sample: "values.yaml · feature/ingress-1.28", use: "Code, file names, branches, versions", source: "R01.2" },
];

export function TypeRoles() {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-border text-sm">
          {["Role", "Sample", "Classes", "Use for", "Source"].map((h) => (
            <th key={h} className="py-list-row-y pr-list-row-x font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TYPE_ROLES.map((t) => (
          <tr key={t.role} className="border-b border-border align-top">
            <td className="py-list-row-y pr-list-row-x text-sm">{t.role}</td>
            <td className="py-list-row-y pr-list-row-x">
              <span className={t.classes}>{t.sample}</span>
            </td>
            <td className="py-list-row-y pr-list-row-x font-mono text-sm">{t.classes}</td>
            <td className="py-list-row-y pr-list-row-x text-sm">{t.use}</td>
            <td className="py-list-row-y pr-list-row-x text-sm">{t.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const SAMPLE =
  "Upgrade ingress-nginx do 1.28 zmienia domyślną wartość allow-snippet-annotations, dlatego reguły z adnotacji przestały działać po wdrożeniu na staging. Sprawdź wartości w values.yaml i dodaj ten klucz jawnie, zanim zrobisz rollback całego release'u.";

/** Measures the characters on each line of reading text inside max-w-reading. */
export function LineLength() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [perLine, setPerLine] = useState<number[] | null>(null);

  useEffect(() => {
    const text = ref.current?.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE) return;
    const counts = new Map<number, number>();
    const range = document.createRange();
    for (let i = 0; i < (text.textContent ?? "").length; i += 1) {
      range.setStart(text, i);
      range.setEnd(text, i + 1);
      const top = Math.round(range.getBoundingClientRect().top);
      counts.set(top, (counts.get(top) ?? 0) + 1);
    }
    setPerLine([...counts.values()]);
  }, []);

  return (
    <div className="flex flex-col gap-in-group">
      <p ref={ref} className="max-w-reading text-base leading-relaxed">
        {SAMPLE}
      </p>
      <p className="text-sm text-muted-foreground" role="status">
        {perLine ? `Measured characters per line: ${perLine.join(" / ")}.` : "Measuring…"}
      </p>
    </div>
  );
}
