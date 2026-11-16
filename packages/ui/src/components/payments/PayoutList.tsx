"use client";

import { DataTable, type DataTableColumn } from "@devmentor/ui/backend/tables";
import { Button } from "@devmentor/ui/components/ui/button";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { ErrorMessage } from "@devmentor/ui/backend/feedback";
import { formatPln } from "@devmentor/ui/lib/format";

/** Proposed status vocabulary. E05 specification and payment adapter must confirm the final mapping. */
export type PayoutStatus = "pending" | "paid" | "held" | "failed" | "not-payable";
export interface PayoutRecord {
  id: string;
  session: string;
  status: PayoutStatus;
  /** A server-supplied explanation, including cancellation or hold reasons. */
  explanation: string;
  /** Integer grosze; null means not yet supplied, never zero and never a default fee. */
  grossMinor: number | null;
  feeMinor: number | null;
  netMinor: number | null;
  /** Server authorization and current state determine eligibility; the UI does not infer it from status. */
  canHold: boolean;
}
export type PayoutListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; rows: readonly PayoutRecord[] };

export interface PayoutListProps {
  state: PayoutListState;
  onRetry: () => void;
  /** Omit on mentor screens. This callback only requests a hold; success must come back from the server. */
  onHold?: (id: string) => void;
  pendingHoldId?: string | null;
  holdError?: string | null;
}

const labels: Record<PayoutStatus, string> = {
  pending: "Oczekuje na wypłatę", paid: "Wypłacona", held: "Wypłata wstrzymana", failed: "Wypłata nie powiodła się", "not-payable": "Bez wypłaty dla mentora",
};
const amount = (minor: number | null) => minor === null ? "Brak danych" : formatPln(minor);
const columns: DataTableColumn<PayoutRecord>[] = [
  { id: "session", header: "Sesja", cell: (row) => <span className="whitespace-normal break-words">{row.session}</span> },
  { id: "gross", header: "Wpłata", className: "text-right tabular-nums", cell: (row) => amount(row.grossMinor) },
  { id: "fee", header: "Prowizja", className: "text-right tabular-nums", cell: (row) => amount(row.feeMinor) },
  { id: "net", header: "Dla mentora", className: "text-right tabular-nums", cell: (row) => amount(row.netMinor) },
  { id: "status", header: "Status i wyjaśnienie", cell: (row) => <div className="flex flex-col items-start gap-in-group"><Badge variant="outline" className="h-auto whitespace-normal">{labels[row.status]}</Badge><p className="max-w-reading whitespace-normal text-sm text-muted-foreground">{row.explanation}</p></div> },
];

export function PayoutList({ state, onRetry, onHold, pendingHoldId = null, holdError = null }: Readonly<PayoutListProps>) {
  return (
    <div className="flex flex-col gap-between-groups">
      <p className="max-w-reading text-sm text-muted-foreground">Kwoty w PLN pochodzą z rozliczenia sesji. Brak danych nie oznacza zerowej prowizji ani obietnicy wypłaty.</p>
      {holdError ? <ErrorMessage message={holdError} /> : null}
      <DataTable
        label="Rozliczenia sesji"
        columns={columns}
        rows={state.status === "ready" ? state.rows : []}
        getRowId={(row) => row.id}
        isLoading={state.status === "loading"}
        error={state.status === "error" ? state.message : null}
        onRetry={onRetry}
        emptyTitle="Nie ma jeszcze rozliczeń sesji."
        emptyDescription="Rozliczenia pojawią się po rezerwacjach."
        rowActions={onHold ? (row) => row.canHold ? (
          <div className="flex flex-col items-end gap-in-group">
            <Button variant="outline" size="sm" disabled={pendingHoldId !== null} onClick={() => onHold(row.id)}>
              {pendingHoldId === row.id ? "Wstrzymywanie…" : "Wstrzymaj wypłatę"}
            </Button>
            {pendingHoldId !== null ? <span role="status" className="text-sm text-muted-foreground">Czekamy na potwierdzenie serwera.</span> : null}
          </div>
        ) : <span className="text-sm text-muted-foreground">Wstrzymanie niedostępne dla tego rozliczenia.</span> : undefined}
      />
    </div>
  );
}
