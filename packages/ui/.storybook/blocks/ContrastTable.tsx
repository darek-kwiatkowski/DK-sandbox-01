import { useEffect, useRef, useState } from "react";

import { blend, contrastRatio, readColor } from "./contrast";

type Kind = "text" | "ui" | "decorative";
type Pair = { fg: string; bg: string; kind: Kind; alpha?: number; use: string; source: string };

/** Every text/background and UI/background pair the product uses (tokeny.md). */
export const PAIRS: Pair[] = [
  { fg: "--foreground", bg: "--background", kind: "text", use: "Body text, names", source: "R01.4" },
  { fg: "--foreground", bg: "--popover", kind: "text", use: "Text in menus and dialogs", source: "tokeny.md" },
  { fg: "--muted-foreground", bg: "--background", kind: "text", use: "Metadata: time, stack, hints", source: "R02.3" },
  { fg: "--muted-foreground", bg: "--muted", kind: "text", use: "Metadata on quiet surfaces", source: "R02.3" },
  { fg: "--muted-foreground", bg: "--code", kind: "text", use: "Comments in code blocks", source: "R01.2" },
  { fg: "--primary-foreground", bg: "--primary", kind: "text", use: "Main action label", source: "R01.5, K3" },
  { fg: "--primary-foreground", bg: "--primary-hover", kind: "text", use: "Main action label, hovered or pressed", source: "WCAG 1.4.3" },
  { fg: "--secondary-foreground", bg: "--secondary", kind: "text", use: "Secondary action label", source: "R01.6" },
  { fg: "--secondary-foreground", bg: "--secondary-hover", kind: "text", use: "Secondary action label, hovered or pressed", source: "tokeny.md" },
  { fg: "--accent-foreground", bg: "--accent", kind: "text", use: "Hovered row, menu item", source: "R01.1" },
  { fg: "--highlight-foreground", bg: "--background", kind: "text", use: "Highlighted element (time left)", source: "R01.5, P02" },
  { fg: "--highlight-foreground", bg: "--accent", kind: "text", use: "Highlighted element in a hovered row", source: "R01.5" },
  { fg: "--code-foreground", bg: "--code", kind: "text", use: "Code, file names", source: "R01.2" },
  { fg: "--destructive", bg: "--background", kind: "text", use: "Error text", source: "WCAG 1.4.1" },
  { fg: "--destructive", bg: "--background", kind: "text", alpha: 0, use: "Error text on a tinted alert (10% light, 20% dark)", source: "WCAG 1.4.3" },
  { fg: "--primary", bg: "--background", kind: "ui", use: "Main button edge, links", source: "WCAG 1.4.11" },
  { fg: "--input", bg: "--background", kind: "ui", use: "Form field outline", source: "WCAG 1.4.11" },
  { fg: "--ring", bg: "--background", kind: "ui", use: "Focus outline", source: "WCAG 2.4.7" },
  { fg: "--ring", bg: "--background", kind: "ui", alpha: 0.5, use: "Focus halo (ring at 50%)", source: "WCAG 1.4.11" },
  { fg: "--ring", bg: "--primary", kind: "ui", use: "Focus outline touching the main button", source: "WCAG 1.4.11" },
  { fg: "--border", bg: "--background", kind: "decorative", use: "Row divider (decorative, no threshold)", source: "R01.3" },
];

const THRESHOLD: Record<Kind, number> = { text: 4.5, ui: 3, decorative: 0 };
const FIX: Record<string, string> = {
  "--ring/--primary":
    "Focus on a primary button uses ring-offset-2, so the outline touches the page background, not the button fill (tokeny.md rule 21).",
};

type Row = Pair & { light: number | null; dark: number | null };

function measure(element: Element, pair: Pair, dark: boolean): number | null {
  const fg = readColor(element, pair.fg);
  const bg = readColor(element, pair.bg);
  if (!fg || !bg) return null;
  if (pair.alpha === 0) {
    // Tinted alert: destructive text over destructive at 10% (light) or 20% (dark).
    const tint = blend(fg.rgb, bg.rgb, dark ? 0.2 : 0.1);
    return contrastRatio(fg.rgb, tint);
  }
  const top = pair.alpha ? blend(fg.rgb, bg.rgb, pair.alpha) : fg.rgb;
  return contrastRatio(top, bg.rgb);
}

/** Measures every pair in both themes from the live CSS variables. */
export function ContrastTable() {
  const lightRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!lightRef.current || !darkRef.current) return;
    const light = lightRef.current;
    const dark = darkRef.current;
    setRows(PAIRS.map((pair) => ({ ...pair, light: measure(light, pair, false), dark: measure(dark, pair, true) })));
  }, []);

  const cell = (value: number | null, kind: Kind) => {
    if (value === null) return "n/a";
    const pass = value >= THRESHOLD[kind];
    return `${value.toFixed(2)} : 1 ${kind === "decorative" ? "(no threshold)" : pass ? "✓ pass" : "✗ below"}`;
  };

  return (
    <div>
      <div ref={lightRef} className="light" hidden />
      <div ref={darkRef} className="dark" hidden />
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-list-row-y pr-list-row-x font-medium">Pair</th>
            <th className="py-list-row-y pr-list-row-x font-medium">Used for</th>
            <th className="py-list-row-y pr-list-row-x font-medium">Threshold</th>
            <th className="py-list-row-y pr-list-row-x font-medium">Light</th>
            <th className="py-list-row-y pr-list-row-x font-medium">Dark</th>
            <th className="py-list-row-y pr-list-row-x font-medium">Source / fix</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = `${row.fg}/${row.bg}`;
            const failing = [row.light, row.dark].some((v) => v !== null && v < THRESHOLD[row.kind]);
            return (
              <tr key={`${key}/${row.alpha ?? 1}`} className="border-b border-border">
                <td className="py-list-row-y pr-list-row-x font-mono">
                  {row.fg}
                  {row.alpha === 0.5 ? " at 50%" : ""} on {row.bg}
                </td>
                <td className="py-list-row-y pr-list-row-x">{row.use}</td>
                <td className="py-list-row-y pr-list-row-x tabular-nums">
                  {row.kind === "decorative" ? "—" : `${THRESHOLD[row.kind]} : 1 (${row.kind})`}
                </td>
                <td className="py-list-row-y pr-list-row-x tabular-nums">{cell(row.light, row.kind)}</td>
                <td className="py-list-row-y pr-list-row-x tabular-nums">{cell(row.dark, row.kind)}</td>
                <td className="py-list-row-y pr-list-row-x">
                  {row.source}
                  {failing && FIX[key] ? ` — Fix: ${FIX[key]}` : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
