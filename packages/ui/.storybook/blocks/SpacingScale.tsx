/** Relation-based spacing: one scale, one token per relation (tokeny.md). */
export const RELATIONS = [
  { relation: "Inside a group", token: "--spacing-in-group", utility: "gap-in-group", px: "8", example: "Author and time of a message; icon and label; label and value", source: "R02.3" },
  { relation: "Between groups", token: "--spacing-between-groups", utility: "gap-between-groups", px: "16", example: "Between messages; between form fields", source: "K1" },
  { relation: "Inside a panel", token: "--spacing-panel", utility: "p-panel", px: "16", example: "Padding of list panels and operator screens", source: "K1" },
  { relation: "Inside the session and note", token: "--spacing-session", utility: "p-session", px: "24", example: "Session screen and note padding (calmer reading)", source: "K1, R02.1" },
  { relation: "List row", token: "--spacing-list-row-y / -x", utility: "py-list-row-y px-list-row-x", px: "8 / 12", example: "Rows of mentor, session and operator lists (≈ 36 px with text-sm)", source: "R01.1, K1" },
  { relation: "Between sections", token: "--spacing-section", utility: "gap-section", px: "32", example: "Between page sections", source: "tokeny.md" },
];

export const SCALE = [1, 2, 3, 4, 6, 8, 12];

export function SpacingScale() {
  return (
    <div className="flex flex-col gap-in-group">
      {SCALE.map((step) => (
        <div key={step} className="flex items-center gap-between-groups text-sm">
          <span className="w-24 font-mono">--space-{step}</span>
          <span className="w-16 tabular-nums">{step * 4} px</span>
          <span className="block h-4 bg-primary" style={{ width: `var(--space-${step})` }} />
        </div>
      ))}
    </div>
  );
}

export function RelationTable() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border">
          {["Relation", "Token", "Utility", "Value", "Example in DevMentor", "Source"].map((h) => (
            <th key={h} className="py-list-row-y pr-list-row-x font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {RELATIONS.map((r) => (
          <tr key={r.relation} className="border-b border-border align-top">
            <td className="py-list-row-y pr-list-row-x">{r.relation}</td>
            <td className="py-list-row-y pr-list-row-x font-mono">{r.token}</td>
            <td className="py-list-row-y pr-list-row-x font-mono">{r.utility}</td>
            <td className="py-list-row-y pr-list-row-x tabular-nums">{r.px} px</td>
            <td className="py-list-row-y pr-list-row-x">{r.example}</td>
            <td className="py-list-row-y pr-list-row-x">{r.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
