import { EmptyState, ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { formatDateTime } from "@devmentor/ui/lib/format";

export interface SessionMessage {
  id: string;
  author: string;
  sentAt: string;
  text: string;
}

export type TranscriptState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; messages: readonly SessionMessage[]; partial?: boolean };

/** E04 proposal: linear text exchange, with author and timestamp on every message (R02.3, K4). */
export function SessionTranscript({ state, onRetry, timeZone = "Europe/Warsaw" }: Readonly<{
  state: TranscriptState;
  onRetry: () => void;
  timeZone?: string;
}>) {
  if (state.status === "loading") return <LoadingMessage label="Wczytywanie rozmowy…" />;
  if (state.status === "error") return <ErrorMessage message={state.message} onRetry={onRetry} />;
  return (
    <section aria-label="Rozmowa sesji tekstowej" className="flex min-w-0 flex-col gap-between-groups">
      {state.partial ? <ErrorMessage message="Nie udało się wczytać całej rozmowy. Widoczne wiadomości zostały zachowane." onRetry={onRetry} /> : null}
      {state.messages.length === 0 ? <EmptyState title="Nie ma jeszcze wiadomości." description="Napisz, z czym potrzebujesz pomocy." /> : (
        <ol aria-label="Wiadomości" className="flex max-w-reading flex-col gap-between-groups">
          {state.messages.map((message) => (
            <li key={message.id} className="min-w-0">
              <p className="flex flex-wrap gap-in-group text-sm text-muted-foreground">
                <span>{message.author}</span>
                <time dateTime={message.sentAt}>{formatDateTime(message.sentAt, { timeZone })}</time>
              </p>
              <p className="break-words whitespace-pre-wrap text-base leading-relaxed">{message.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
