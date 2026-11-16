import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
import { z } from "zod";

import { AppShell } from "@devmentor/ui/backend/layout";
import { CrudForm } from "@devmentor/ui/backend/forms";
import { DataTable } from "@devmentor/ui/backend/tables";
import { ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { Alert, AlertDescription } from "@devmentor/ui/components/ui/alert";
import { Button } from "@devmentor/ui/components/ui/button";

const meta = { title: "Screens/E02 Offer management proposals", parameters: { layout: "fullscreen", docs: { description: { component: "Presentation proposals under approved Q2/H4, grounded in brief R04/R08/R13/R14/R28/R29/R35 and backlog E02-S01/S02/S03. Local callbacks simulate responses and do not publish a profile, price, fee or slot. Field grouping, required-field checks, decimal parsing and publication UI are proposals, not an API schema. No initial price bounds or platform fee are assumed. H1 approved a checkbox group for stack tags on 2026-11-16; no minimum number of tags is inferred." } } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const nav = [{ href: "/mentor/profile", label: "Profil" }, { href: "/mentor/prices", label: "Ceny" }, { href: "/mentor/availability", label: "Dostępność" }];
const required = z.string().trim().min(1, "Uzupełnij pole.");
const money = required.refine((value) => /^\d+(?:[.,]\d{1,2})?$/.test(value), "Wpisz kwotę PLN z najwyżej dwoma miejscami po przecinku.");
const stackTags = ["TypeScript", "React", "Python", "AI agents"] as const;
type Outcome = "ready" | "waiting" | "error" | "field" | "stack-field" | "network" | "confirmed";
type OfferKind = "profile" | "prices" | "bounds" | "fee" | "slots";
function OfferForm({ kind, outcome = "ready", dataState = "ready" }: Readonly<{ kind: OfferKind; outcome?: Outcome; dataState?: "ready" | "loading" | "error" | "partial" | "long" }>) {
  const [confirmed, setConfirmed] = useState(false);
  const configurations = {
    profile: { title: "Edytuj profil mentora", schema: z.object({ description: required, publicWork: z.url("Podaj pełny adres publicznej pracy."), stack: z.array(z.enum(stackTags)) }), fields: [{ name: "description", label: "Opis", type: "textarea" as const }, { name: "publicWork", label: "Link do publicznej pracy", type: "url" as const }, { name: "stack", label: "Stack", type: "checkboxes" as const, description: "Wybierz technologie, w których prowadzisz sesje.", options: stackTags.map((value) => ({ value, label: value })) }], defaults: { description: "Pomagam z aplikacjami TypeScript i React.", publicWork: "https://example.com/anna", stack: ["TypeScript", "React"] }, submit: "Opublikuj profil" },
    prices: { title: "Ceny sesji", schema: z.object({ price25: money, price50: money }), fields: [{ name: "price25", label: "Cena za 25 minut", type: "money" as const }, { name: "price50", label: "Cena za 50 minut", type: "money" as const }], defaults: { price25: "120", price50: "220" }, submit: "Zapisz ceny" },
    bounds: { title: "Limity cen w PLN", schema: z.object({ minimum25: money, maximum25: money, minimum50: money, maximum50: money }), fields: [{ name: "minimum25", label: "Minimum za 25 minut", type: "money" as const }, { name: "maximum25", label: "Maksimum za 25 minut", type: "money" as const }, { name: "minimum50", label: "Minimum za 50 minut", type: "money" as const }, { name: "maximum50", label: "Maksimum za 50 minut", type: "money" as const }], defaults: {}, submit: "Zapisz limity cen" },
    fee: { title: "Prowizja platformy", schema: z.object({ fee: required }), fields: [{ name: "fee", label: "Prowizja platformy", description: "Nie ma domyślnej prowizji. Jednostka i walidacja wymagają specyfikacji rozliczeń." }], defaults: {}, submit: "Zapisz prowizję" },
    slots: { title: "Opublikuj termin", schema: z.object({ start: required, duration: z.enum(["25", "50"], { error: "Wybierz długość sesji." }) }), fields: [{ name: "start", label: "Początek terminu", description: "Data i godzina w strefie Europe/Warsaw. Rezerwacja jest możliwa najpóźniej dwie godziny przed początkiem." }, { name: "duration", label: "Długość sesji", type: "select" as const, options: [{ value: "25", label: "25 minut" }, { value: "50", label: "50 minut" }] }], defaults: { start: "20.11.2026, 18:00", duration: "25" }, submit: "Opublikuj termin" },
  };
  const config = configurations[kind];
  const defaults = dataState === "partial" ? kind === "profile" ? { stack: [] } : {} : dataState === "long" && kind === "profile" ? { description: "Pomagam zespołom rozwijać aplikacje TypeScript i React, diagnozować problemy w produkcji oraz przygotowywać powtarzalne procedury.\n\nPodczas sesji pracujemy nad jednym konkretnym problemem. ".repeat(8), publicWork: "https://example.com/anna/publiczne-przyklady-pracy-z-aplikacjami-typescript-i-react", stack: [...stackTags] } : config.defaults;
  return <AppShell items={kind === "bounds" || kind === "fee" ? [{ href: "/backend", label: "Panel operatora" }] : nav} currentPath={kind === "profile" ? "/mentor/profile" : kind === "prices" ? "/mentor/prices" : "/mentor/availability"}><div className="flex max-w-reading flex-col gap-between-groups"><h1 className="text-xl font-semibold">{config.title}</h1>
    {kind === "profile" ? <p>Opis i publiczna praca pomagają wybrać mentora. Profil nie zawiera ocen ani opinii.</p> : null}
    {kind === "prices" ? <p>Kwoty są przykładowe. Serwer sprawdza obie ceny według aktualnych limitów operatora.</p> : null}
    {kind === "bounds" || kind === "fee" ? <Alert role="status"><AlertDescription>Konfiguracja wymaga decyzji operatora. Nie stosujemy wartości domyślnych.</AlertDescription></Alert> : null}
    {dataState === "loading" ? <LoadingMessage /> : dataState === "error" ? <ErrorMessage message="Nie udało się wczytać danych oferty. Odśwież stronę i spróbuj ponownie." /> : confirmed ? <p role="status">Zapis potwierdzony w symulacji. Dane produktu nie zostały zmienione.</p> : <CrudForm schema={config.schema} fields={config.fields} defaultValues={defaults} submitLabel={config.submit}
      onSubmit={async () => {
        if (outcome === "waiting") return new Promise(() => undefined);
        if (outcome === "network") return { ok: false, error: { code: "network_error", message: "Brak połączenia. Sprawdź połączenie i spróbuj ponownie." } };
        if (outcome === "field" || outcome === "stack-field") {
          const field = outcome === "stack-field" ? "stack" : config.fields[0].name;
          return { ok: false, error: { code: "validation_error", message: "Sprawdź zaznaczone pole.", fieldErrors: { [field]: ["Serwer odrzucił tę wartość. Sprawdź aktualne wymagania i popraw pole."] } } };
        }
        if (outcome === "error") return { ok: false, error: { code: "conflict", message: kind === "prices" ? "Nie udało się zapisać cen. Sprawdź aktualne limity operatora." : "Nie udało się zapisać zmian. Sprawdź dane i spróbuj ponownie." } };
        return { ok: true, data: null };
      }} onSuccess={() => setConfirmed(true)} />}
  </div></AppShell>;
}
export const ProfileEditAndPublish: Story = { render: () => <OfferForm kind="profile" />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("button", { name: "Opublikuj profil" })); await expect(await canvas.findByRole("status")).toHaveTextContent("Zapis potwierdzony w symulacji"); } };
export const ProfilePublishing: Story = { render: () => <OfferForm kind="profile" outcome="waiting" />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("button", { name: "Opublikuj profil" })); await expect(canvas.getByRole("button", { name: "Zapisywanie…" })).toBeDisabled(); } };
export const ProfilePublishError: Story = { render: () => <OfferForm kind="profile" outcome="error" />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole("button", { name: "Opublikuj profil" })); await expect(await canvas.findByRole("alert")).toHaveTextContent("Nie udało się zapisać zmian"); await expect(canvas.getByLabelText("Opis")).toHaveValue("Pomagam z aplikacjami TypeScript i React."); } };
export const MentorPriceForm: Story = { render: () => <OfferForm kind="prices" /> };
export const MentorPriceLimitsChanged: Story = { render: () => <OfferForm kind="prices" outcome="error" />, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole("button", { name: "Zapisz ceny" })); } };
export const OperatorPriceBounds: Story = { render: () => <OfferForm kind="bounds" /> };
export const OperatorFeeNotConfigured: Story = { render: () => <OfferForm kind="fee" /> };
export const PricesAwaitOperatorBounds: Story = { render: () => <AppShell items={nav} currentPath="/mentor/prices"><div className="flex max-w-reading flex-col gap-between-groups"><h1 className="text-xl font-semibold">Ceny sesji</h1><p id="bounds-hint">Operator nie ustawił jeszcze limitów cen. Poproś operatora o konfigurację przed zapisaniem cen.</p><Button disabled aria-describedby="bounds-hint">Zapisz ceny</Button></div></AppShell> };
export const AvailabilityPublish: Story = { render: () => <OfferForm kind="slots" /> };
export const AvailabilityPublishError: Story = { render: () => <OfferForm kind="slots" outcome="error" />, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole("button", { name: "Opublikuj termin" })); } };
export const AvailabilityEmpty: Story = { render: () => <AppShell items={nav} currentPath="/mentor/availability"><h1 className="text-xl font-semibold">Dostępność</h1><DataTable label="Opublikowane terminy" rows={[]} getRowId={(row: { id: string }) => row.id} columns={[{ id: "start", header: "Początek", cell: () => null }]} emptyTitle="Nie ma jeszcze terminów." emptyDescription="Opublikuj termin sesji 25 lub 50 minut." emptyAction={<Button asChild><a href="#new-slot">Dodaj termin</a></Button>} /><section id="new-slot"><h2 className="text-base font-semibold">Nowy termin</h2><p>Formularz pokazuje story AvailabilityPublish.</p></section></AppShell> };

// These are local application-response fixtures, not endpoint schemas. Bounds below are
// fictional values entered by the operator during the test, never initial platform defaults (R29).
function responseStory(kind: Exclude<OfferKind, "fee">, outcome: Exclude<Outcome, "ready" | "stack-field">): Story {
  return {
    render: () => <OfferForm kind={kind} outcome={outcome} />,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      if (kind === "bounds") {
        for (const [label, value] of [["Minimum za 25 minut", "80"], ["Maksimum za 25 minut", "200"], ["Minimum za 50 minut", "160"], ["Maksimum za 50 minut", "400"]]) {
          await userEvent.type(canvas.getByLabelText(label), value);
        }
      }
      const labels = { profile: "Opublikuj profil", prices: "Zapisz ceny", bounds: "Zapisz limity cen", slots: "Opublikuj termin" };
      const firstLabels = { profile: "Opis", prices: "Cena za 25 minut", bounds: "Minimum za 25 minut", slots: "Początek terminu" };
      const first = canvas.getByLabelText(firstLabels[kind]);
      const original = (first as HTMLInputElement).value;
      await userEvent.click(canvas.getByRole("button", { name: labels[kind] }));
      if (outcome === "waiting") {
        await expect(canvas.getByRole("button", { name: "Zapisywanie…" })).toBeDisabled();
        await expect(first).toBeDisabled();
      } else if (outcome === "confirmed") {
        await expect(await canvas.findByText("Zapis potwierdzony w symulacji. Dane produktu nie zostały zmienione.")).toBeVisible();
      } else {
        if (outcome === "field") {
          await expect(await canvas.findByText("Sprawdź zaznaczone pole.")).toBeVisible();
        } else {
          await expect(await canvas.findByRole("alert")).toHaveTextContent(outcome === "network" ? "Brak połączenia" : "Nie udało się zapisać");
        }
        await expect(first).toHaveValue(original);
        await expect(canvas.getByRole("button", { name: labels[kind] })).toBeEnabled();
        if (outcome === "field") {
          await waitFor(() => expect(first).toHaveFocus());
          await expect(first).toHaveAttribute("aria-invalid", "true");
        }
      }
    },
  };
}

export const ProfileDataLoading: Story = { render: () => <OfferForm kind="profile" dataState="loading" /> };
export const ProfileDataError: Story = { render: () => <OfferForm kind="profile" dataState="error" /> };
export const ProfilePartialData: Story = { render: () => <OfferForm kind="profile" dataState="partial" /> };
export const ProfileLongDescriptionAndLink: Story = { render: () => <OfferForm kind="profile" dataState="long" /> };
export const ProfileFieldRejected: Story = responseStory("profile", "field");
export const ProfileNetworkFailure: Story = responseStory("profile", "network");
export const ProfileServerConfirmed: Story = responseStory("profile", "confirmed");
export const ProfileStackKeyboardSelection: Story = {
  render: () => <OfferForm kind="profile" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const python = canvas.getByRole("checkbox", { name: "Python" });
    await expect(canvas.getByRole("checkbox", { name: "TypeScript" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "React" })).toBeChecked();
    python.focus();
    await userEvent.keyboard(" ");
    await expect(python).toBeChecked();
    await userEvent.keyboard(" ");
    await expect(python).not.toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Opublikuj profil" }));
    await expect(await canvas.findByText("Zapis potwierdzony w symulacji. Dane produktu nie zostały zmienione.")).toBeVisible();
  },
};
export const ProfileStackServerError: Story = {
  render: () => <OfferForm kind="profile" outcome="stack-field" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Python" }));
    await userEvent.click(canvas.getByRole("button", { name: "Opublikuj profil" }));
    await expect(await canvas.findByText("Serwer odrzucił tę wartość. Sprawdź aktualne wymagania i popraw pole.")).toBeVisible();
    await expect(canvas.getByRole("checkbox", { name: "Python" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "TypeScript" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "React" })).toBeChecked();
    await expect(canvas.getByLabelText("Opis")).toHaveValue("Pomagam z aplikacjami TypeScript i React.");
  },
};

export const PriceDataLoading: Story = { render: () => <OfferForm kind="prices" dataState="loading" /> };
export const PriceDataError: Story = { render: () => <OfferForm kind="prices" dataState="error" /> };
export const PricesNotSet: Story = { render: () => <OfferForm kind="prices" dataState="partial" /> };
export const PriceSaving: Story = responseStory("prices", "waiting");
export const PriceFieldRejected: Story = responseStory("prices", "field");
export const PriceNetworkFailure: Story = responseStory("prices", "network");
export const PriceServerConfirmed: Story = responseStory("prices", "confirmed");

export const BoundsDataLoading: Story = { render: () => <OfferForm kind="bounds" dataState="loading" /> };
export const BoundsDataError: Story = { render: () => <OfferForm kind="bounds" dataState="error" /> };
export const BoundsSaving: Story = responseStory("bounds", "waiting");
export const BoundsFieldRejected: Story = responseStory("bounds", "field");
export const BoundsServerFailure: Story = responseStory("bounds", "error");
export const BoundsNetworkFailure: Story = responseStory("bounds", "network");
export const BoundsServerConfirmed: Story = responseStory("bounds", "confirmed");

export const AvailabilityDataLoading: Story = { render: () => <OfferForm kind="slots" dataState="loading" /> };
export const AvailabilityDataError: Story = { render: () => <OfferForm kind="slots" dataState="error" /> };
export const AvailabilityPartialData: Story = { render: () => <OfferForm kind="slots" dataState="partial" /> };
export const AvailabilityPublishing: Story = responseStory("slots", "waiting");
export const AvailabilityFieldRejected: Story = responseStory("slots", "field");
export const AvailabilityNetworkFailure: Story = responseStory("slots", "network");
export const AvailabilityServerConfirmed: Story = responseStory("slots", "confirmed");
