import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";

import { AppShell } from "@devmentor/ui/backend/layout";
import { AccessDenied, ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { DataTable } from "@devmentor/ui/backend/tables";
import { Alert, AlertDescription } from "@devmentor/ui/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@devmentor/ui/components/ui/alert-dialog";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";
import { Label } from "@devmentor/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@devmentor/ui/components/ui/radio-group";

const meta = { title: "Screens/E03 Booking proposals", parameters: { layout: "fullscreen", docs: { description: { component: "Presentation proposals under approved Q2/H4, not a checkout API or Stripe state contract. Sources: brief R01/R05/R08/R14/R27/R28/R29/R32/R33/R34, E03-S02/S03 and G5 approved status labels. The sample reference time is 20 November 2026 at 12:00 Europe/Warsaw; displayed slots are at least two hours ahead. Prices are fictional mentor prices, not platform defaults. Payment states are application-level fixtures; a redirect or return from Stripe never alone establishes payment. Real payments remain blocked until approved terms and an operator-set fee exist. No simulated action takes money, reserves a slot, cancels a booking or sends notifications." } } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const nav = [{ href: "/mentors", label: "Znajdź mentora" }, { href: "/bookings", label: "Rezerwacje" }];
type CheckoutState = "ready" | "waiting" | "failed" | "network" | "confirmed" | "unavailable" | "unconfigured";
function Checkout({ state = "ready" }: Readonly<{ state?: CheckoutState }>) {
  const [duration, setDuration] = useState("25");
  const [slot, setSlot] = useState("18:00");
  const [started, setStarted] = useState(false);
  const price = duration === "25" ? "120,00 zł" : "220,00 zł";
  return <AppShell items={nav} currentPath="/mentors/anna/book"><div className="flex max-w-reading flex-col gap-between-groups"><h1 className="text-xl font-semibold">Sesja tekstowa z Anną Kowalską</h1>
    <p>TypeScript · React · 20 listopada 2026 · Europe/Warsaw</p>
    <fieldset className="flex flex-col gap-in-group"><legend className="text-sm font-medium">Długość sesji</legend><RadioGroup value={duration} onValueChange={setDuration} disabled={state === "waiting" || state === "confirmed"} aria-label="Długość sesji"><div className="flex items-center gap-3"><RadioGroupItem id="duration25" value="25" /><Label htmlFor="duration25">25 minut · 120,00 zł</Label></div><div className="flex items-center gap-3"><RadioGroupItem id="duration50" value="50" /><Label htmlFor="duration50">50 minut · 220,00 zł</Label></div></RadioGroup></fieldset>
    <fieldset className="flex flex-col gap-in-group"><legend className="text-sm font-medium">Termin</legend><RadioGroup value={slot} onValueChange={setSlot} disabled={state === "waiting" || state === "confirmed"} aria-label="Termin"><div className="flex items-center gap-3"><RadioGroupItem id="slot18" value="18:00" /><Label htmlFor="slot18">18:00</Label></div><div className="flex items-center gap-3"><RadioGroupItem id="slot19" value="19:00" /><Label htmlFor="slot19">19:00</Label></div></RadioGroup></fieldset>
    <p className="font-semibold tabular-nums">Do zapłaty: {price}</p><p>Wybrano: {duration} minut, godzina {slot}.</p>
    <p>Płatność jest ostateczna. Anulowanie sesji i nieobecność nie uprawniają do zwrotu pieniędzy. Gdy mentor anuluje sesję, nie otrzymasz zwrotu; płatność pozostaje na platformie. Spory rozpatruje operator.</p>
    <p className="text-sm text-muted-foreground">To podgląd zasad R27/R32, nie zatwierdzony regulamin. Pełne warunki mentee i mentora wymagają zatwierdzenia przed rzeczywistymi płatnościami (R33).</p>
    {state === "confirmed" ? <><Badge variant="outline">Opłacona</Badge><p role="status">Płatność i rezerwacja potwierdzone przez serwer. Potwierdzenie jest przeznaczone dla mentee i mentora.</p></> : <>
      {state === "failed" ? <Alert variant="destructive"><AlertDescription>Płatność nie została potwierdzona. Rezerwacja nie jest opłacona. Sprawdź status przed ponowną próbą.</AlertDescription></Alert> : null}
      {state === "network" ? <Alert variant="destructive"><AlertDescription>Brak połączenia. Nie możemy potwierdzić płatności. Sprawdź połączenie i status rezerwacji.</AlertDescription></Alert> : null}
      {state === "waiting" ? <p role="status">Oczekujemy na potwierdzenie płatności z serwera. Powrót ze Stripe nie oznacza opłaconej rezerwacji.</p> : null}
      {state === "unavailable" ? <p id="checkout-blocked" role="alert">Wybrany termin nie jest już dostępny. Wybierz inny termin przed przejściem do płatności.</p> : null}
      {state === "unconfigured" ? <p id="checkout-blocked" role="alert">Płatności są niedostępne do czasu ustawienia prowizji przez operatora i zatwierdzenia warunków.</p> : null}
      <Button disabled={state === "waiting" || state === "unavailable" || state === "unconfigured"} aria-busy={state === "waiting" || undefined} aria-describedby={state === "unavailable" || state === "unconfigured" ? "checkout-blocked" : undefined} onClick={() => setStarted(true)}>{state === "waiting" ? "Potwierdzanie płatności…" : `Przejdź do Stripe · ${price}`}</Button>
      {started ? <p role="status">Symulacja przejścia do Stripe. Nie utworzono płatności ani rezerwacji.</p> : null}
    </>}
  </div></AppShell>;
}
export const SlotSelectionAndCheckout: Story = { render: () => <Checkout />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("radio", { name: "50 minut · 220,00 zł" })); await expect(canvas.getByText("Do zapłaty: 220,00 zł")).toBeVisible(); await userEvent.click(canvas.getByRole("radio", { name: "19:00" })); await expect(canvas.getByText("Wybrano: 50 minut, godzina 19:00.")).toBeVisible(); await userEvent.click(canvas.getByRole("button", { name: "Przejdź do Stripe · 220,00 zł" })); await expect(canvas.getByRole("status")).toHaveTextContent("Nie utworzono płatności ani rezerwacji"); } };
export const PaymentAwaitingServer: Story = { render: () => <Checkout state="waiting" /> };
export const PaymentFailed: Story = { render: () => <Checkout state="failed" /> };
export const PaymentNetworkUnknown: Story = { render: () => <Checkout state="network" /> };
export const PaymentServerConfirmed: Story = { render: () => <Checkout state="confirmed" /> };
export const SlotBecameUnavailable: Story = { render: () => <Checkout state="unavailable" /> };
export const PaymentConfigurationMissing: Story = { render: () => <Checkout state="unconfigured" /> };

type BookingState = "ready" | "loading" | "error" | "empty" | "cancelled" | "missing";
function Bookings({ state, detail = false }: Readonly<{ state: BookingState; detail?: boolean }>) {
  return <AppShell items={nav} currentPath="/bookings"><div className="flex flex-col gap-between-groups"><h1 className="text-xl font-semibold">{detail ? "Rezerwacja sesji z Anną Kowalską" : "Rezerwacje"}</h1>
    {detail ? state === "loading" ? <LoadingMessage /> : state === "error" ? <ErrorMessage message="Nie udało się wczytać rezerwacji. Odśwież stronę i spróbuj ponownie." /> : state === "missing" ? <AccessDenied description="Rezerwacja nie istnieje albo nie masz do niej dostępu." /> : <>
      <p>20 listopada 2026, 18:00 · Europe/Warsaw · 25 minut · 120,00 zł</p><Badge variant="outline">{state === "cancelled" ? "Anulowana" : "Opłacona"}</Badge>
      <p>Płatność nie podlega zwrotowi. Przy anulowaniu przez mentee płatność trafia do mentora po odjęciu prowizji. Przy anulowaniu przez mentora płatność pozostaje na platformie.</p>
      {state === "cancelled" ? <p role="status">Przykład anulowania potwierdzonego przez serwer.</p> : <><Button asChild variant="outline"><a href="#cancel-booking">Warunki anulowania rezerwacji</a></Button><section id="cancel-booking" className="max-w-reading"><h2 className="text-base font-semibold">Anulowanie rezerwacji</h2><p>Dialog z nazwą sesji i bezpieczną rezygnacją pokazuje Patterns/Delete confirmation. Ten podgląd nie anuluje rezerwacji.</p></section></>}
    </> : <DataTable label="Twoje rezerwacje" getRowId={(row: { id: string; mentor: string }) => row.id} rows={state === "empty" ? [] : [{ id: "booking-demo", mentor: "Anna Kowalska" }]} isLoading={state === "loading"} error={state === "error" ? "Nie udało się wczytać rezerwacji. Odśwież stronę i spróbuj ponownie." : null}
      columns={[{ id: "mentor", header: "Mentor", cell: (row) => row.mentor }, { id: "time", header: "Termin", cell: () => "20.11.2026, 18:00 Europe/Warsaw" }, { id: "price", header: "Cena", cell: () => "120,00 zł" }, { id: "status", header: "Status", cell: () => <Badge variant="outline">Opłacona</Badge> }]}
      emptyTitle="Nie masz jeszcze rezerwacji." emptyDescription="Znajdź mentora i wybierz termin sesji." emptyAction={<Button asChild><a href="/mentors">Znajdź mentora</a></Button>} />}
  </div></AppShell>;
}
export const BookingsReady: Story = { render: () => <Bookings state="ready" /> };
export const BookingsLoading: Story = { render: () => <Bookings state="loading" /> };
export const BookingsError: Story = { render: () => <Bookings state="error" /> };
export const BookingsEmpty: Story = { render: () => <Bookings state="empty" /> };
export const BookingDetailReady: Story = { render: () => <Bookings state="ready" detail /> };
export const BookingDetailLoading: Story = { render: () => <Bookings state="loading" detail /> };
export const BookingDetailError: Story = { render: () => <Bookings state="error" detail /> };
export const BookingDetailNotFoundOrDenied: Story = { render: () => <Bookings state="missing" detail /> };
export const BookingDetailCancelled: Story = { render: () => <Bookings state="cancelled" detail /> };

type MenteeCancellationState = "ready" | "waiting" | "error" | "cancelled";
function MenteeCancellation({ state }: Readonly<{ state: MenteeCancellationState }>) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(state === "cancelled");
  const pending = state === "waiting" && !confirmed;

  return <AppShell items={nav} currentPath="/bookings"><div className="flex max-w-reading flex-col gap-between-groups">
    <h1 className="text-xl font-semibold">Rezerwacja sesji z Anną Kowalską</h1>
    <p>20 listopada 2026, 18:00 · Europe/Warsaw · 25 minut · 120,00 zł</p>
    <Badge variant={confirmed ? "destructive" : "outline"}>{confirmed ? "Anulowana" : "Opłacona"}</Badge>
    <section className="flex flex-col gap-in-group" aria-labelledby="cancellation-policy-title">
      <h2 id="cancellation-policy-title" className="text-base font-semibold">Zasady anulowania</h2>
      <p>Płatność nie podlega zwrotowi. Jeśli anulujesz jako mentee, mentor otrzyma płatność pomniejszoną o prowizję operatora po zakończeniu okresu wstrzymania wypłaty.</p>
      <p>To zasada dla anulowania przez mentee. Gdy anuluje mentor, płatność pozostaje na platformie, a mentor nie otrzymuje wypłaty.</p>
      <p className="text-sm text-muted-foreground">Ta demonstracja pokazuje zasady R27 i R34. Nie wysyła żądania ani nie zmienia płatności.</p>
    </section>
    {confirmed ? <p role="status">Przykład: serwer potwierdziłby anulowanie rezerwacji. Płatność nie zostanie zwrócona.</p> : <>
      <AlertDialog open={open} onOpenChange={(next) => { if (!pending) setOpen(next); }}>
        <AlertDialogTrigger asChild><Button variant="destructive">Anuluj rezerwację</Button></AlertDialogTrigger>
        <AlertDialogContent aria-busy={pending} onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Anulować sesję z Anną Kowalską, 20 listopada o 18:00?</AlertDialogTitle>
            <AlertDialogDescription>Płatność 120,00 zł nie zostanie zwrócona. Mentor otrzyma ją pomniejszoną o prowizję operatora po okresie wstrzymania wypłaty.</AlertDialogDescription>
          </AlertDialogHeader>
          {state === "error" ? <ErrorMessage message="Nie udało się potwierdzić anulowania. Sprawdź stan rezerwacji przed ponowieniem." /> : null}
          {pending ? <p role="status" className="text-sm text-muted-foreground">Oczekujemy na potwierdzenie serwera. Anulowanie nie jest jeszcze potwierdzone.</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Zostaw rezerwację</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={(event) => { event.preventDefault(); if (state === "ready") { setConfirmed(true); setOpen(false); } }}>
              {pending ? "Oczekiwanie na serwer…" : "Anuluj rezerwację"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>}
  </div></AppShell>;
}
export const MenteeCancelsPaidBooking: Story = {
  render: () => <MenteeCancellation state="ready" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj rezerwację" }));
    const dialog = within(await within(document.body).findByRole("alertdialog"));
    await expect(dialog.getByRole("heading")).toHaveTextContent("Anną Kowalską");
    await expect(dialog.getByText(/nie zostanie zwrócona/)).toBeVisible();
    await userEvent.click(dialog.getByRole("button", { name: "Zostaw rezerwację" }));
    await expect(canvas.getByText("Opłacona")).toBeVisible();
  },
};
export const MenteeCancellationDemoConfirmation: Story = {
  render: () => <MenteeCancellation state="ready" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Anuluj rezerwację" }));
    const dialog = within(await within(document.body).findByRole("alertdialog"));
    await userEvent.click(dialog.getByRole("button", { name: "Anuluj rezerwację" }));
    await expect(await canvas.findByRole("status")).toHaveTextContent("Przykład: serwer potwierdziłby anulowanie");
    await expect(canvas.getByText("Anulowana")).toBeVisible();
  },
};
export const MenteeCancellationWaiting: Story = { render: () => <MenteeCancellation state="waiting" /> };
export const MenteeCancellationError: Story = { render: () => <MenteeCancellation state="error" /> };
export const MenteeCancellationConfirmed: Story = { render: () => <MenteeCancellation state="cancelled" /> };
