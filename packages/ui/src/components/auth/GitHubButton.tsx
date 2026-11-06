import type { ReactNode } from "react";

import { Button } from "@devmentor/ui/components/ui/button";

/** The GitHub mark (Octicons `mark-github`, MIT), drawn in the text colour. Local asset, no download (F6). */
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" data-icon="inline-start" fill="currentColor">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

export interface GitHubButtonProps {
  /** The OAuth start route, e.g. `/api/auth/github/start?next=%2Faccount`. */
  href: string;
  children?: ReactNode;
  /** `default` on /login and /register (the main action); `outline` for „Połącz konto GitHub” on /account. */
  variant?: "default" | "outline";
}

/** A real link to the OAuth start route, so it works without JavaScript (E01-S01 spec). */
export function GitHubButton({ href, children = "Zaloguj się przez GitHub", variant = "default" }: Readonly<GitHubButtonProps>) {
  return (
    <Button asChild variant={variant} className="w-full">
      <a href={href}>
        <GitHubMark />
        {children}
      </a>
    </Button>
  );
}
