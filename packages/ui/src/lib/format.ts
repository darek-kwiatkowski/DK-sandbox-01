// Display formats shared by every screen (platform primitives P7 and P16).

const PLN = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });

/** Money travels as integer grosze (P7); ui declares its own type instead of importing core. */
export function formatPln(minor: number): string {
  return PLN.format(minor / 100);
}

export interface FormatDateTimeOptions {
  /** IANA zone. Signed-in screens pass the browser zone; server-rendered public pages use Europe/Warsaw (P16). */
  timeZone?: string;
}

/** "pt., 13 lis, 18:00 CET": weekday, day, month, 24-hour time and always the zone label (P16). */
export function formatDateTime(iso: string, { timeZone }: FormatDateTimeOptions = {}): string {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  }).format(new Date(iso));
}
