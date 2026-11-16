"use client";

import { Alert, AlertDescription, AlertTitle } from "@devmentor/ui/components/ui/alert";
import { Button } from "@devmentor/ui/components/ui/button";
import { ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";

/** Proposed presentation states for E05-S01; the server owns the Connect account state (brief R05). */
export type ConnectState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready" }
  | { status: "incomplete"; starting: boolean; error: string | null };

export interface ConnectStatusProps {
  state: ConnectState;
  /** Start/resume onboarding through the application's payment adapter. No provider URL is constructed here. */
  onContinue: () => void;
  onRetry: () => void;
}

export function ConnectStatus({ state, onContinue, onRetry }: Readonly<ConnectStatusProps>) {
  if (state.status === "loading") return <LoadingMessage label="Wczytywanie ustawień wypłat…" />;
  if (state.status === "error") return <ErrorMessage message={state.message} onRetry={onRetry} />;
  if (state.status === "ready") {
    return <Alert role="status"><AlertTitle>Konto wypłat jest gotowe.</AlertTitle><AlertDescription>Wypłaty zależą od realizacji sesji i ewentualnego wstrzymania przez operatora.</AlertDescription></Alert>;
  }
  return (
    <section aria-label="Konfiguracja wypłat" className="flex flex-col items-start gap-between-groups">
      <Alert role="note"><AlertTitle>Dokończ konfigurację wypłat.</AlertTitle><AlertDescription>Przed pierwszą wypłatą wymagane jest ukończenie konfiguracji Stripe Connect.</AlertDescription></Alert>
      <Button onClick={onContinue} disabled={state.starting} aria-busy={state.starting}>
        {state.starting ? "Otwieranie konfiguracji…" : "Skonfiguruj wypłaty"}
      </Button>
      {state.starting ? <p role="status" className="text-sm text-muted-foreground">Czekamy na odpowiedź serwera. Nie zamykaj tej strony.</p> : null}
      {state.error ? <ErrorMessage message={state.error} onRetry={onContinue} /> : null}
    </section>
  );
}
