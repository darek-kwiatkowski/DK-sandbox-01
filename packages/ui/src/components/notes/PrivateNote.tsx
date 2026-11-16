"use client";

import { useId } from "react";
import { EmptyState, ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { Button } from "@devmentor/ui/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Textarea } from "@devmentor/ui/components/ui/textarea";

export interface PrivateNoteProps {
  value: string;
  status: "loading" | "ready" | "saving" | "approving" | "error" | "conflict" | "approved";
  /** True only for the mentee and the latest persisted revision. Server must enforce this too. */
  canApprove: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onApprove: () => void;
  onRetry: () => void;
}

/** E04 proposal: controlled server state; never marks approval locally (brief R26). */
export function PrivateNote({ value, status, canApprove, onChange, onSave, onApprove, onRetry }: Readonly<PrivateNoteProps>) {
  const id = useId();
  if (status === "loading") return <LoadingMessage label="Wczytywanie prywatnej notatki…" />;
  const pending = status === "saving" || status === "approving";
  const approved = status === "approved";
  const conflict = status === "conflict";
  return (
    <section aria-label="Prywatna notatka" aria-busy={pending} className="flex min-w-0 max-w-reading flex-col gap-between-groups">
      <p className="text-sm text-muted-foreground">Notatka jest prywatna dla Ciebie i drugiej osoby w tej sesji. Ostateczną wersję zatwierdza mentee.</p>
      {status === "error" ? <ErrorMessage message="Nie udało się zapisać notatki. Twój tekst został zachowany." onRetry={onRetry} /> : null}
      {conflict ? <ErrorMessage message="Notatka została zmieniona przez drugą osobę. Zachowaliśmy Twój tekst; porównaj wersje przed ponownym zapisem." onRetry={onRetry} /> : null}
      {!value && !approved ? <EmptyState title="Notatka jest jeszcze pusta." description="Zapisz ustalenia i kolejne kroki z sesji." /> : null}
      <Field>
        <FieldLabel htmlFor={id}>{approved ? "Zatwierdzona notatka" : "Treść notatki"}</FieldLabel>
        <Textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} readOnly={pending || approved} aria-describedby={`${id}-hint`} className="text-base leading-relaxed" />
        <FieldDescription id={`${id}-hint`}>{approved ? "Mentee zatwierdził tę wersję." : "Zapis dotyczy wspólnej notatki. Zatwierdź dopiero zapisaną, aktualną wersję. Pusta notatka nie może zostać zapisana ani zatwierdzona."}</FieldDescription>
      </Field>
      {approved ? <p role="status" className="text-sm">Notatka zatwierdzona.</p> : (
        <div className="flex flex-wrap gap-in-group">
          <Button variant="outline" disabled={pending || conflict || !value.trim()} onClick={onSave}>{status === "saving" ? "Zapisywanie…" : "Zapisz notatkę"}</Button>
          {canApprove ? <Button variant="outline" disabled={pending || conflict || !value.trim()} onClick={onApprove}>{status === "approving" ? "Zatwierdzanie…" : "Zatwierdź notatkę"}</Button> : null}
        </div>
      )}
    </section>
  );
}
