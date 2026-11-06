import { EmptyState, ErrorMessage } from "@devmentor/ui/backend/feedback";
import { Button } from "@devmentor/ui/components/ui/button";
import { Skeleton } from "@devmentor/ui/components/ui/skeleton";

import { MentorListRow } from "./MentorListRow";
import type { MentorSummary } from "./types";

export type MentorListState =
  | { status: "loading" }
  | { status: "error"; message?: string }
  | { status: "ready"; mentors: readonly MentorSummary[] };

export interface MentorListProps {
  state: MentorListState;
  hrefFor: (mentor: MentorSummary) => string;
  /** True when a stack filter is on: an empty result then means "no match", not "nothing yet". */
  filtered?: boolean;
  onClearFilters?: () => void;
  onRetry?: () => void;
  timeZone?: string;
}

const LOADING_ROWS = 3;

/** The mentor list with every data state (E03-S01, R13: order comes from the server, never a score). */
export function MentorList({ state, hrefFor, filtered = false, onClearFilters, onRetry, timeZone }: Readonly<MentorListProps>) {
  if (state.status === "loading") {
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          Wczytywanie mentorów…
        </p>
        <ul className="divide-y divide-border border-y border-border">
          {Array.from({ length: LOADING_ROWS }, (_, index) => (
            <li key={index} className="flex items-center gap-between-groups px-list-row-x py-list-row-y">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (state.status === "error") {
    return <ErrorMessage message={state.message ?? "Nie udało się wczytać mentorów."} onRetry={onRetry} />;
  }
  if (state.mentors.length === 0) {
    return filtered ? (
      <EmptyState
        title="Żaden mentor nie pasuje do wybranych filtrów."
        description="Wyczyść filtry albo wybierz inny stack."
        action={
          onClearFilters ? (
            <Button variant="outline" onClick={onClearFilters}>
              Wyczyść filtry
            </Button>
          ) : undefined
        }
      />
    ) : (
      <EmptyState title="Nie ma jeszcze opublikowanych mentorów." description="Mentorzy dołączają z zaproszenia. Zajrzyj tu wkrótce." />
    );
  }
  return (
    <ul aria-label="Mentorzy" className="divide-y divide-border border-y border-border">
      {state.mentors.map((mentor) => (
        <MentorListRow key={mentor.id} mentor={mentor} href={hrefFor(mentor)} timeZone={timeZone} />
      ))}
    </ul>
  );
}
