import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ConnectStatus } from "@devmentor/ui/components/payments/ConnectStatus";
import { PayoutList, type PayoutRecord } from "@devmentor/ui/components/payments/PayoutList";

const payoutRows: PayoutRecord[] = [
  { id: "session-1", session: "Sesja tekstowa · TypeScript · 13 listopada", status: "pending", explanation: "Rozliczenie oczekuje na potwierdzenie realizacji i warunków wypłaty.", grossMinor: 12000, feeMinor: null, netMinor: null, canHold: true },
  { id: "session-2", session: "Sesja tekstowa · Python", status: "held", explanation: "Operator wstrzymał wypłatę do wyjaśnienia realizacji sesji.", grossMinor: 22000, feeMinor: null, netMinor: null, canHold: false },
];
const meta = { title: "Product/E05 Payouts (proposals)", parameters: { docs: { description: { component: "Proposed presentation vocabulary for E05-S01. Sources: brief R05, R28, R30, R35. Fee and net amounts stay unknown until supplied by the server; no fee default or payout deadline is implied. Connect adapter and payout transitions require the covering specification." } } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const retry = fn();
const continueSetup = fn();
export const ConnectIncomplete: Story = { render: () => <ConnectStatus state={{ status: "incomplete", starting: false, error: null }} onContinue={continueSetup} onRetry={retry} />, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole("button", { name: "Skonfiguruj wypłaty" })); await expect(continueSetup).toHaveBeenCalled(); } };
export const ConnectStarting: Story = { render: () => <ConnectStatus state={{ status: "incomplete", starting: true, error: null }} onContinue={continueSetup} onRetry={retry} /> };
export const ConnectStartFailure: Story = { render: () => <ConnectStatus state={{ status: "incomplete", starting: false, error: "Nie udało się otworzyć konfiguracji Stripe. Spróbuj ponownie." }} onContinue={continueSetup} onRetry={retry} /> };
export const ConnectLoading: Story = { render: () => <ConnectStatus state={{ status: "loading" }} onContinue={continueSetup} onRetry={retry} /> };
export const ConnectError: Story = { render: () => <ConnectStatus state={{ status: "error", message: "Nie udało się wczytać konfiguracji wypłat." }} onContinue={continueSetup} onRetry={retry} /> };
export const ConnectReady: Story = { render: () => <ConnectStatus state={{ status: "ready" }} onContinue={continueSetup} onRetry={retry} /> };
export const PayoutsReady: Story = { render: () => <PayoutList state={{ status: "ready", rows: payoutRows }} onRetry={retry} /> };
export const PayoutsLoading: Story = { render: () => <PayoutList state={{ status: "loading" }} onRetry={retry} /> };
export const PayoutsEmpty: Story = { render: () => <PayoutList state={{ status: "ready", rows: [] }} onRetry={retry} /> };
export const PayoutsError: Story = { render: () => <PayoutList state={{ status: "error", message: "Nie udało się wczytać rozliczeń." }} onRetry={retry} /> };
export const PayoutsStatusesAndPartial: Story = { render: () => <PayoutList state={{ status: "ready", rows: (["pending", "paid", "held", "failed", "not-payable"] as const).map((status, index) => ({ ...payoutRows[0]!, id: String(index), status, canHold: false, explanation: "Przykładowy opis z rozliczenia serwera; ostateczne mapowanie statusów wymaga specyfikacji E05." })) }} onRetry={retry} /> };
export const PayoutsLongAndMany: Story = { render: () => <PayoutList state={{ status: "ready", rows: Array.from({ length: 16 }, (_, index) => ({ ...payoutRows[index % 2]!, id: String(index), session: "Sesja tekstowa: analiza konfiguracji TypeScript w aplikacji z wieloma pakietami i zależnościami", explanation: "Rozliczenie wymaga wyjaśnienia. Operator potwierdzi warunki realizacji przed wypłatą. Kwoty prowizji i wypłaty nie zostały jeszcze dostarczone przez serwer." })) }} onRetry={retry} /> };
const hold = fn();
export const OperatorHold: Story = { render: () => <PayoutList state={{ status: "ready", rows: payoutRows }} onRetry={retry} onHold={hold} />, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole("button", { name: "Wstrzymaj wypłatę" })); await expect(hold).toHaveBeenCalledWith("session-1"); } };
export const OperatorHoldPending: Story = { render: () => <PayoutList state={{ status: "ready", rows: payoutRows }} onRetry={retry} onHold={hold} pendingHoldId="session-1" /> };
export const OperatorHoldError: Story = { render: () => <PayoutList state={{ status: "ready", rows: payoutRows }} onRetry={retry} onHold={hold} holdError="Nie udało się wstrzymać wypłaty. Stan rozliczenia nie został zmieniony." /> };
