import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ErrorMessage } from "@devmentor/ui/backend/feedback";
import { Button } from "@devmentor/ui/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@devmentor/ui/components/ui/alert-dialog";

type Response = "success" | "error" | "waiting";

/** A composition of package exports, not a new package component or cancellation API. */
function CancellationExample({ response }: Readonly<{ response: Response }>) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "pending" | "error" | "success">("idle");
  const pending = state === "pending";

  async function confirm() {
    if (pending) return;
    setState("pending");
    // Simulated server boundary: no request URL, authorization or payment transition is defined here.
    const result = await (response === "waiting"
      ? new Promise<"success" | "error">(() => undefined)
      : Promise.resolve(response));
    setState(result);
    if (result === "success") setOpen(false);
  }

  return (
    <div className="flex max-w-reading flex-col items-start gap-between-groups">
      {state === "success" ? <p role="status">Serwer potwierdził anulowanie rezerwacji. Płatność nie zostanie zwrócona.</p> : null}
      <AlertDialog open={open} onOpenChange={(next) => { if (!pending) setOpen(next); }}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={state === "success"}>Anuluj rezerwację</Button>
        </AlertDialogTrigger>
        {state === "success" ? <p className="text-sm text-muted-foreground">Rezerwacja jest już anulowana.</p> : null}
        <AlertDialogContent onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} aria-busy={pending}>
          <AlertDialogHeader>
            <AlertDialogTitle>Anulować sesję z Anną Kowalską, pt., 13 lis, 18:00 CET?</AlertDialogTitle>
            <AlertDialogDescription>Płatność 120,00 zł nie zostanie zwrócona. Tej operacji nie można cofnąć.</AlertDialogDescription>
          </AlertDialogHeader>
          {state === "error" ? <ErrorMessage message="Nie udało się potwierdzić anulowania. Sprawdź stan rezerwacji przed ponowieniem." /> : null}
          {pending ? <p role="status" className="text-sm text-muted-foreground">Czekamy na potwierdzenie serwera. Anulowanie nie jest jeszcze potwierdzone; przyciski są chwilowo niedostępne.</p> : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Zostaw rezerwację</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={(event) => { event.preventDefault(); void confirm(); }}>
              {pending ? "Anulowanie…" : "Anuluj rezerwację"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const meta = {
  title: "Patterns/Delete confirmation",
  parameters: { docs: { description: { component: "Cancellation is DevMentor's destructive-action example (brief R27/D39, WCAG 3.3.4). Composition and asynchronous presentation are proposals pending E03-S02 specification. This simulates a response boundary, not an API or payment contract." } } },
  render: () => <CancellationExample response="success" />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

async function openConfirmation(canvasElement: HTMLElement) {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Anuluj rezerwację" }));
  return within(await within(document.body).findByRole("alertdialog"));
}

export const Confirmation: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await openConfirmation(canvasElement);
    await expect(dialog.getByRole("heading")).toHaveTextContent("Anną Kowalską");
    await waitFor(() => expect(dialog.getByRole("button", { name: "Zostaw rezerwację" })).toHaveFocus());
  },
};
export const SafeCancelAndFocusReturn: Story = {
  play: async ({ canvasElement }) => {
    await openConfirmation(canvasElement);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("alertdialog")).toBeNull());
    await expect(within(canvasElement).getByRole("button", { name: "Anuluj rezerwację" })).toHaveFocus();
    await expect(within(canvasElement).queryByRole("status")).toBeNull();
  },
};
export const WaitingForServer: Story = {
  render: () => <CancellationExample response="waiting" />,
  play: async ({ canvasElement }) => {
    const dialog = await openConfirmation(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Anuluj rezerwację" }));
    await expect(dialog.getByRole("button", { name: "Anulowanie…" })).toBeDisabled();
    await expect(dialog.getByRole("status")).toHaveTextContent("nie jest jeszcze potwierdzone");
  },
};
export const ServerError: Story = {
  render: () => <CancellationExample response="error" />,
  play: async ({ canvasElement }) => {
    const dialog = await openConfirmation(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Anuluj rezerwację" }));
    await expect(await dialog.findByRole("alert")).toHaveTextContent("Sprawdź stan rezerwacji przed ponowieniem.");
    await expect(dialog.getByRole("button", { name: "Zostaw rezerwację" })).toBeEnabled();
  },
};
export const ServerConfirmedSuccess: Story = {
  play: async ({ canvasElement }) => {
    const dialog = await openConfirmation(canvasElement);
    await userEvent.click(dialog.getByRole("button", { name: "Anuluj rezerwację" }));
    await expect(await within(canvasElement).findByRole("status")).toHaveTextContent("Serwer potwierdził anulowanie");
    await waitFor(() => expect(within(document.body).queryByRole("alertdialog")).toBeNull());
  },
};
export const NarrowConfirmation: Story = { ...Confirmation, globals: { viewport: { value: "narrow" } } };
