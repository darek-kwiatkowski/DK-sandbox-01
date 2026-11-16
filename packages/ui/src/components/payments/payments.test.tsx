// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { ConnectStatus } from "./ConnectStatus";
import { PayoutList, type PayoutRecord } from "./PayoutList";

afterEach(cleanup);
const payout: PayoutRecord = { id: "session-one", session: "TypeScript · 25 min", status: "pending", explanation: "Sesja wymaga rozliczenia.", grossMinor: 12000, feeMinor: null, netMinor: null, canHold: true };

it("shows Connect loading, retryable failure and confirmed readiness", async () => {
  const onRetry = vi.fn();
  const onContinue = vi.fn();
  const { rerender } = render(<ConnectStatus state={{ status: "loading" }} onRetry={onRetry} onContinue={onContinue} />);
  expect(screen.getByRole("status").textContent).toContain("Wczytywanie ustawień wypłat");
  rerender(<ConnectStatus state={{ status: "error", message: "Nie udało się pobrać konfiguracji." }} onRetry={onRetry} onContinue={onContinue} />);
  expect(screen.getByRole("alert").textContent).toContain("Nie udało się pobrać konfiguracji.");
  await userEvent.click(screen.getByRole("button"));
  expect(onRetry).toHaveBeenCalledOnce();
  rerender(<ConnectStatus state={{ status: "ready" }} onRetry={onRetry} onContinue={onContinue} />);
  expect(screen.getByRole("status").textContent).toContain("Konto wypłat jest gotowe.");
  expect(screen.queryByRole("button")).toBeNull();
});

it("requests onboarding, prevents repeated requests while starting and exposes its server error", async () => {
  const onContinue = vi.fn();
  const input = { onContinue, onRetry: vi.fn() };
  const { rerender } = render(<ConnectStatus {...input} state={{ status: "incomplete", starting: false, error: null }} />);
  await userEvent.click(screen.getByRole("button", { name: "Skonfiguruj wypłaty" }));
  expect(onContinue).toHaveBeenCalledOnce();
  rerender(<ConnectStatus {...input} state={{ status: "incomplete", starting: true, error: null }} />);
  expect((screen.getByRole("button", { name: "Otwieranie konfiguracji…" }) as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByRole("status").textContent).toContain("Czekamy na odpowiedź serwera");
  rerender(<ConnectStatus {...input} state={{ status: "incomplete", starting: false, error: "Konfiguracja niedostępna." }} />);
  expect(screen.getByRole("alert").textContent).toContain("Konfiguracja niedostępna.");
  await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
  expect(onContinue).toHaveBeenCalledTimes(2);
});

it("distinguishes payout loading, failure and no settlements", async () => {
  const onRetry = vi.fn();
  const { rerender } = render(<PayoutList state={{ status: "loading" }} onRetry={onRetry} />);
  expect(screen.getByRole("status")).toBeTruthy();
  rerender(<PayoutList state={{ status: "error", message: "Rozliczenia niedostępne." }} onRetry={onRetry} />);
  expect(screen.getByRole("alert").textContent).toContain("Rozliczenia niedostępne.");
  await userEvent.click(screen.getByRole("button"));
  expect(onRetry).toHaveBeenCalledOnce();
  rerender(<PayoutList state={{ status: "ready", rows: [] }} onRetry={onRetry} />);
  expect(screen.getByText("Nie ma jeszcze rozliczeń sesji.")).toBeTruthy();
  expect(screen.queryByRole("table")).toBeNull();
});

it("renders server amounts, honest missing data, each status and no operator action on mentor screens", () => {
  const statuses = ["pending", "paid", "held", "failed", "not-payable"] as const;
  render(<PayoutList state={{ status: "ready", rows: statuses.map((status) => ({ ...payout, id: status, status })) }} onRetry={vi.fn()} />);
  const table = screen.getByRole("table", { name: "Rozliczenia sesji" });
  expect(within(table).getAllByText(/120,00/)).toHaveLength(5);
  expect(within(table).getAllByText("Brak danych")).toHaveLength(10);
  for (const label of ["Oczekuje na wypłatę", "Wypłacona", "Wypłata wstrzymana", "Wypłata nie powiodła się", "Bez wypłaty dla mentora"]) expect(within(table).getByText(label)).toBeTruthy();
  expect(screen.queryByRole("button")).toBeNull();
  expect(screen.queryByRole("columnheader", { name: "Akcje" })).toBeNull();
});

it("requests a hold only for eligible records and waits for server confirmation across all rows", async () => {
  const onHold = vi.fn();
  const rows = [payout, { ...payout, id: "two", session: "React · 50 min" }, { ...payout, id: "three", session: "Python · 25 min", canHold: false }];
  const { rerender } = render(<PayoutList state={{ status: "ready", rows }} onRetry={vi.fn()} onHold={onHold} />);
  expect(screen.getByText("Wstrzymanie niedostępne dla tego rozliczenia.")).toBeTruthy();
  await userEvent.click(screen.getAllByRole("button", { name: "Wstrzymaj wypłatę" })[0]);
  expect(onHold).toHaveBeenCalledExactlyOnceWith(payout.id);
  expect(screen.queryByRole("status")).toBeNull();
  rerender(<PayoutList state={{ status: "ready", rows }} onRetry={vi.fn()} onHold={onHold} pendingHoldId={payout.id} holdError="Nie udało się potwierdzić wstrzymania." />);
  expect(screen.getByRole("button", { name: "Wstrzymywanie…" })).toBeTruthy();
  expect(screen.getAllByRole("button").every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  expect(screen.getAllByRole("status")).toHaveLength(2);
  expect(screen.getByRole("alert").textContent).toContain("Nie udało się potwierdzić wstrzymania.");
});
