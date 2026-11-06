import { cn } from "cn";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * App-shell navigation. Items come from the page (`navFor(actor)`), so ui knows nothing about roles
 * (platform primitives P3). The current page is marked with aria-current and weight, not colour (WCAG 1.4.1).
 */
export function NavLinks({ items, currentPath }: Readonly<{ items: readonly NavItem[]; currentPath: string }>) {
  return (
    <nav aria-label="Główna">
      <ul className="flex flex-wrap items-center gap-1">
        {items.map((item) => {
          const current = item.href === currentPath;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-sm text-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  current && "bg-accent font-semibold",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
