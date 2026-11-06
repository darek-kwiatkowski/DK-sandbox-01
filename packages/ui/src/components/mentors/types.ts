// Shapes the mentor components render. ui declares them itself; it does not import core (AGENTS.md).

export interface MentorSummary {
  id: string;
  name: string;
  avatarUrl?: string | null;
  /** Stack tags from the beachhead pool: TypeScript, React, Python, AI agents (R13). */
  stack: readonly string[];
  /** ISO start of the nearest published slot; null when none is published (R13 orders by it). */
  nextSlotAt: string | null;
  /** Prices in grosze (P7); null until the mentor sets them (R08). */
  price25Minor: number | null;
  price50Minor: number | null;
}

export interface MentorProfileData extends MentorSummary {
  description: string;
  /** Public work instead of ratings (R04, N02). */
  publicWork: { href: string; title: string } | null;
}

/** Initials for the avatar fallback: first letters of the first and last word. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  return `${words[0]?.[0] ?? ""}${words.length > 1 ? words[words.length - 1][0] : ""}`.toUpperCase();
}
