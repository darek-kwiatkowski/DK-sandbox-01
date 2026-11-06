import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@devmentor/ui/components/ui/avatar";
import { formatPln } from "@devmentor/ui/lib/format";

import { PublicWorkLink } from "./PublicWorkLink";
import { StackTags } from "./StackTags";
import { initials, type MentorProfileData } from "./types";

/**
 * The public mentor page content (E02-S01, E03-S01): name, stack, a plain description, public work instead
 * of ratings (R04, N02) and prices (R08). `children` holds the booking part (slot picker and main action).
 * Proposal until the E02-S01 spec.
 */
export function MentorProfile({ mentor, children }: Readonly<{ mentor: MentorProfileData; children?: ReactNode }>) {
  return (
    <article aria-labelledby={`mentor-${mentor.id}`} className="grid gap-section md:grid-cols-2">
      <div className="flex flex-col gap-between-groups">
        <header className="flex items-center gap-between-groups">
          <Avatar>
            {mentor.avatarUrl ? <AvatarImage src={mentor.avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials(mentor.name)}</AvatarFallback>
          </Avatar>
          <h1 id={`mentor-${mentor.id}`} className="text-xl leading-tight font-semibold break-words">
            {mentor.name}
          </h1>
        </header>
        <StackTags tags={mentor.stack} />
        <p className="max-w-reading text-base leading-relaxed whitespace-pre-line">{mentor.description}</p>
        {mentor.publicWork ? <PublicWorkLink href={mentor.publicWork.href} title={mentor.publicWork.title} /> : null}
        <dl className="grid max-w-80 grid-cols-2 gap-in-group text-sm">
          <dt className="text-muted-foreground">25 minut</dt>
          <dd className="text-right tabular-nums">{mentor.price25Minor === null ? "—" : formatPln(mentor.price25Minor)}</dd>
          <dt className="text-muted-foreground">50 minut</dt>
          <dd className="text-right tabular-nums">{mentor.price50Minor === null ? "—" : formatPln(mentor.price50Minor)}</dd>
        </dl>
      </div>
      {children ? <div className="flex flex-col gap-between-groups">{children}</div> : null}
    </article>
  );
}
