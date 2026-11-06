import type { ReactNode } from "react";

import { NavLinks, type NavItem } from "./NavLinks";

export interface AppShellProps {
  items: readonly NavItem[];
  currentPath: string;
  /** Right side of the header, e.g. the signed-in person's name or SignOutButton. */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Page-rendered shell of the signed-in areas (platform primitives P3): product name, navigation and the
 * page content within max-w-page. A skip link goes straight to the content (WCAG 2.4.1).
 */
export function AppShell({ items, currentPath, actions, children }: Readonly<AppShellProps>) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only rounded-md bg-popover px-3 py-2 text-sm focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-ring"
      >
        Przejdź do treści
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-page flex-wrap items-center gap-between-groups px-panel py-2">
          <a href="/" className="text-base font-semibold">
            DevMentor
          </a>
          <NavLinks items={items} currentPath={currentPath} />
          {actions ? <div className="ml-auto flex items-center gap-in-group">{actions}</div> : null}
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-page px-panel py-section">
        {children}
      </main>
    </div>
  );
}
