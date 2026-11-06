import type { ReactNode } from "react";

/**
 * Rendered by a page whose `pageScope` refused the actor (platform primitives P3). The page decides the
 * explanation, e.g. „Mentorzy dołączają tylko z zaproszenia.” (R07).
 */
export function AccessDenied({ description, action }: Readonly<{ description?: string; action?: ReactNode }>) {
  return (
    <section aria-labelledby="access-denied-title" className="flex flex-col items-start gap-in-group py-section">
      <h1 id="access-denied-title" className="text-xl leading-tight font-semibold">
        Nie masz dostępu do tej strony.
      </h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </section>
  );
}
