import { Avatar, AvatarFallback, AvatarImage } from "@devmentor/ui/components/ui/avatar";
import { Button } from "@devmentor/ui/components/ui/button";
import { formatDateTime, formatPln } from "@devmentor/ui/lib/format";

import { StackTags } from "./StackTags";
import { initials, type MentorSummary } from "./types";

export interface MentorListRowProps {
  mentor: MentorSummary;
  /** The mentor page; the whole row is not a link, only the name and „Zobacz profil” (WCAG 2.4.4). */
  href: string;
  timeZone?: string;
}

/**
 * One mentor in the list (E03-S01): name, stack, the nearest slot as the one highlighted element of the row
 * (by weight, R01.5, P02) and prices. No ratings (N02). Proposal until the E03-S01 spec.
 */
export function MentorListRow({ mentor, href, timeZone }: Readonly<MentorListRowProps>) {
  const prices = [
    mentor.price25Minor === null ? null : `25 min · ${formatPln(mentor.price25Minor)}`,
    mentor.price50Minor === null ? null : `50 min · ${formatPln(mentor.price50Minor)}`,
  ].filter(Boolean);
  return (
    <li className="flex flex-col gap-in-group px-list-row-x py-list-row-y md:flex-row md:items-center md:gap-between-groups">
      <div className="flex min-w-0 items-center gap-in-group md:w-64">
        <Avatar>
          {mentor.avatarUrl ? <AvatarImage src={mentor.avatarUrl} alt="" /> : null}
          <AvatarFallback>{initials(mentor.name)}</AvatarFallback>
        </Avatar>
        <a href={href} className="min-w-0 font-medium break-words underline-offset-4 hover:underline">
          {mentor.name}
        </a>
      </div>
      <div className="md:w-56">
        <StackTags tags={mentor.stack} />
      </div>
      <p className="text-sm tabular-nums md:flex-1">
        {mentor.nextSlotAt ? (
          <>
            <span className="sr-only">Najbliższy termin: </span>
            <span className="font-semibold">{formatDateTime(mentor.nextSlotAt, { timeZone })}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Brak wolnych terminów</span>
        )}
      </p>
      <p className="text-sm text-muted-foreground tabular-nums">{prices.length > 0 ? prices.join(" · ") : "Cena wkrótce"}</p>
      <Button asChild variant="link">
        <a href={href} aria-label={`Zobacz profil: ${mentor.name}`}>
          Zobacz profil
        </a>
      </Button>
    </li>
  );
}
