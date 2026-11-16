import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { z } from "zod";
import { useState } from "react";

import { CrudForm } from "@devmentor/ui/backend/forms";

const schema = z.object({
  question: z.string().min(12, "Opisz problem w co najmniej 12 znakach."),
  duration: z.enum(["25", "50"], { error: "Wybierz długość sesji." }),
});
const fields = [
  { name: "question", label: "Z czym potrzebujesz pomocy?", type: "textarea" as const, description: "Opisz problem, komunikat błędu i to, co już sprawdziłeś." },
  { name: "duration", label: "Długość sesji", type: "select" as const, options: [{ value: "25", label: "25 minut" }, { value: "50", label: "50 minut" }] },
];
const meta = { title: "Patterns/Form", component: CrudForm, parameters: { docs: { description: { component: "Proposed form composition (brief R14, backlog E03-S02). These callbacks simulate ApiResult responses, not a checkout API contract. CrudForm owns blur/submit validation, retained values and focus (WCAG 3.3.1, 3.3.2). Payment and booking success require server confirmation." } } }, args: { schema, fields, onSubmit: async () => ({ ok: true as const, data: null }) } } satisfies Meta<typeof CrudForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { render: () => <CrudForm schema={schema} fields={fields} submitLabel="Dalej do ceny" onSubmit={async () => ({ ok: true, data: null })} /> };
export const ValidationAndFirstErrorFocus: Story = {
  render: () => <CrudForm schema={schema} fields={fields} submitLabel="Dalej do ceny" onSubmit={async () => ({ ok: true, data: null })} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Dalej do ceny" }));
    await expect(canvas.getByText("Opisz problem w co najmniej 12 znakach.")).toBeInTheDocument();
    await expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toHaveFocus();
  },
};
export const ServerWaiting: Story = { render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={() => new Promise((resolve) => setTimeout(() => resolve({ ok: true as const, data: { bookingId: "booking-demo" } }), 1200))} submitLabel="Potwierdź rezerwację" /> };
export const ServerFieldError: Story = { render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={async () => ({ ok: false, error: { code: "validation_error", message: "Sprawdź opis problemu.", fieldErrors: { question: ["Dodaj komunikat błędu, aby mentor mógł przygotować odpowiedź."] } } })} submitLabel="Potwierdź rezerwację" /> };
export const ServerError: Story = { render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={async () => ({ ok: false, error: { code: "server_error", message: "Nie udało się utworzyć rezerwacji. Spróbuj ponownie." } })} submitLabel="Potwierdź rezerwację" /> };
export const NetworkUnavailable: Story = { render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={async () => ({ ok: false, error: { code: "network_unavailable", message: "Brak połączenia. Wpisane dane zostały zachowane; sprawdź połączenie i spróbuj ponownie." } })} submitLabel="Potwierdź rezerwację" /> };
export const ServerConfirmedSuccess: Story = { render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={async () => ({ ok: true, data: { bookingId: "booking-demo" } })} onSuccess={fn()} submitLabel="Potwierdź rezerwację" /> };

ServerWaiting.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Potwierdź rezerwację" }));
  await expect(canvas.getByRole("button", { name: "Zapisywanie…" })).toBeDisabled();
  await expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toBeDisabled();
  await waitFor(() => expect(canvas.getByRole("button", { name: "Potwierdź rezerwację" })).toBeEnabled(), { timeout: 3000 });
};

function ConfirmedForm() {
  const [confirmed, setConfirmed] = useState(false);
  return confirmed ? <p role="status">Serwer potwierdził zapis. To symulacja, nie opłacona rezerwacja.</p> : <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={async () => ({ ok: true, data: null })} onSuccess={() => setConfirmed(true)} />;
}

export const VisibleServerConfirmation: Story = {
  render: () => <ConfirmedForm />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz" }));
    await expect(await canvas.findByRole("status")).toHaveTextContent("Serwer potwierdził zapis");
  },
};

export const PersistentPending: Story = {
  render: () => <CrudForm schema={schema} fields={fields} defaultValues={{ question: "Problem z konfiguracją TypeScript", duration: "25" }} onSubmit={() => new Promise(() => undefined)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz" }));
    await expect(canvas.getByRole("button", { name: "Zapisywanie…" })).toBeDisabled();
    await expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toHaveValue("Problem z konfiguracją TypeScript");
  },
};
ServerFieldError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Potwierdź rezerwację" }));
  await expect(await canvas.findByText("Dodaj komunikat błędu, aby mentor mógł przygotować odpowiedź.")).toBeInTheDocument();
  await waitFor(() => expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toHaveFocus());
  await expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toHaveValue("Problem z konfiguracją TypeScript");
};
ServerError.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Potwierdź rezerwację" }));
  await expect(await canvas.findByRole("alert")).toHaveTextContent("Nie udało się utworzyć rezerwacji.");
  await waitFor(() => expect(canvas.getByRole("alert")).toHaveFocus());
};
NetworkUnavailable.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Potwierdź rezerwację" }));
  await expect(await canvas.findByRole("alert")).toHaveTextContent("Brak połączenia.");
  await expect(canvas.getByLabelText("Z czym potrzebujesz pomocy?")).toHaveValue("Problem z konfiguracją TypeScript");
};

