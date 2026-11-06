import { ExternalLink } from "lucide-react";

import { Button } from "@devmentor/ui/components/ui/button";

/** Link to the mentor's public work, which replaces ratings (R04, N02). Opens in a new tab and says so. */
export function PublicWorkLink({ href, title }: Readonly<{ href: string; title: string }>) {
  return (
    <Button asChild variant="link" className="whitespace-normal">
      <a href={href} target="_blank" rel="noreferrer">
        Publiczna praca: {title}
        <ExternalLink aria-hidden="true" data-icon="inline-end" />
        <span className="sr-only"> (otwiera się w nowej karcie)</span>
      </a>
    </Button>
  );
}
