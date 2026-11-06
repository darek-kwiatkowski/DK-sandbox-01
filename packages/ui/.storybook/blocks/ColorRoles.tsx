type Role = { token: string; utility: string; purpose: string; avoid: string; source: string; text?: string };

/** Semantic colour roles (layer 2 of tokens.css). Swatches read the live variables. */
export const ROLES: Role[] = [
  { token: "--background", utility: "bg-background", purpose: "Page, list and session surface", avoid: "—", source: "R01.4, P01" },
  { token: "--foreground", utility: "text-foreground", purpose: "Body text, mentor names", avoid: "—", source: "R01.4" },
  { token: "--popover", utility: "bg-popover", purpose: "Menus, dialogs, dropdowns", avoid: "Static panels", source: "tokeny.md" },
  { token: "--primary", utility: "bg-primary", text: "--primary-foreground", purpose: "The one main action on a screen", avoid: "Several buttons per screen; errors", source: "R01.4, R01.5, K3" },
  { token: "--primary-hover", utility: "hover:bg-primary-hover", text: "--primary-foreground", purpose: "Main action, hovered or pressed", avoid: "Opacity (primary/80 drops text to 3.59 : 1)", source: "WCAG 1.4.3" },
  { token: "--highlight-foreground", utility: "text-highlight-foreground", purpose: "The one highlighted element when highlighted by colour: time left in a session", avoid: "With font-semibold; in every list row", source: "R01.5, K3, P02" },
  { token: "--secondary", utility: "bg-secondary", text: "--secondary-foreground", purpose: "Secondary actions", avoid: "The main action", source: "R01.6" },
  { token: "--secondary-hover", utility: "hover:bg-secondary-hover", text: "--secondary-foreground", purpose: "Secondary action, hovered or pressed", avoid: "Arbitrary color-mix values", source: "tokeny.md" },
  { token: "--muted", utility: "bg-muted", purpose: "Quiet surfaces", avoid: "Highlighting", source: "R02.3" },
  { token: "--muted-foreground", utility: "text-muted-foreground", purpose: "Metadata: time, stack, hints", avoid: "Message text, prices, the slot time", source: "R02.3, R01.1" },
  { token: "--accent", utility: "bg-accent", text: "--accent-foreground", purpose: "Hovered or active row, menu item (shadcn name)", avoid: "As the brand colour: that is --primary", source: "R01.1" },
  { token: "--destructive", utility: "text-destructive", purpose: "Errors, cancellations", avoid: "Without a text label or icon", source: "WCAG 1.4.1" },
  { token: "--border", utility: "border-border, divide-border", purpose: "Thin lines between rows, separators", avoid: "Form field outlines", source: "R01.3" },
  { token: "--input", utility: "border-input", purpose: "Form field outlines", avoid: "Row dividers", source: "WCAG 1.4.11" },
  { token: "--ring", utility: "ring-ring, outline-ring", purpose: "Focus outline", avoid: "Decoration", source: "WCAG 2.4.7" },
  { token: "--code", utility: "bg-code", text: "--code-foreground", purpose: "Inline code and code blocks in session and note", avoid: "Plain text", source: "R01.2" },
];

function Swatch({ role, theme }: { role: Role; theme: "light" | "dark" }) {
  const isText = role.token.endsWith("foreground") && !role.text;
  return (
    <div className={`${theme} rounded-md border border-border bg-background px-2 py-1 text-sm`}>
      {isText ? (
        <span style={{ color: `var(${role.token})` }}>Aa {theme}</span>
      ) : (
        <span
          className="block rounded-sm px-2 py-1"
          style={{ background: `var(${role.token})`, color: `var(${role.text ?? "--foreground"})` }}
        >
          Aa {theme}
        </span>
      )}
    </div>
  );
}

export function ColorRoles() {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-border">
          {["Token", "Utility", "Light", "Dark", "Use for", "Not for", "Source"].map((h) => (
            <th key={h} className="py-list-row-y pr-list-row-x font-medium">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROLES.map((role) => (
          <tr key={role.token} className="border-b border-border align-top">
            <td className="py-list-row-y pr-list-row-x font-mono">{role.token}</td>
            <td className="py-list-row-y pr-list-row-x font-mono">{role.utility}</td>
            <td className="py-list-row-y pr-list-row-x">
              <Swatch role={role} theme="light" />
            </td>
            <td className="py-list-row-y pr-list-row-x">
              <Swatch role={role} theme="dark" />
            </td>
            <td className="py-list-row-y pr-list-row-x">{role.purpose}</td>
            <td className="py-list-row-y pr-list-row-x">{role.avoid}</td>
            <td className="py-list-row-y pr-list-row-x">{role.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
