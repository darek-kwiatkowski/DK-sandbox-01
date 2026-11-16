"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { ApiResult } from "@devmentor/ui/backend/api";
import { Button } from "@devmentor/ui/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Textarea } from "@devmentor/ui/components/ui/textarea";

export interface MessageComposerProps {
  onSend: (text: string) => Promise<ApiResult<unknown>>;
  /** Required explanation when the session does not allow sending. */
  disabledReason?: string;
}

/** R02.2: Enter sends, Shift+Enter inserts a line. Confirmed send alone clears the local draft. */
export function MessageComposer({ onSend, disabledReason }: Readonly<MessageComposerProps>) {
  const id = useId();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const inFlight = useRef(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || disabledReason || !text.trim()) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    setSent(false);
    try {
      const result = await onSend(text.trim());
      if (result.ok) {
        setText("");
        setSent(true);
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("Nie udało się wysłać wiadomości. Tekst został zachowany. Spróbuj ponownie.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      // The composer always renders this textarea inside its own form.
      event.currentTarget.form!.requestSubmit();
    }
  }

  return (
    <form onSubmit={send} aria-busy={pending} className="flex max-w-reading flex-col gap-in-group border-t border-border bg-background py-panel">
      <Field>
        <FieldLabel htmlFor={id}>Wiadomość</FieldLabel>
        <Textarea id={id} value={text} onChange={(event) => setText(event.target.value)} onKeyDown={keyDown}
          readOnly={pending} disabled={Boolean(disabledReason)} aria-describedby={`${id}-hint`} />
        <FieldDescription id={`${id}-hint`}>{disabledReason ?? "Wpisz wiadomość, aby odblokować wysyłanie. Enter wysyła wiadomość. Shift+Enter dodaje nową linię."}</FieldDescription>
      </Field>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
      {sent ? <p role="status" className="text-sm text-muted-foreground">Wiadomość wysłana.</p> : null}
      <Button type="submit" variant="outline" disabled={pending || Boolean(disabledReason) || !text.trim()}>
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </Button>
    </form>
  );
}
