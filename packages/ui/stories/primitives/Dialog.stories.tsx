import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "@devmentor/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@devmentor/ui/components/ui/dialog";
import { Field, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Input } from "@devmentor/ui/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@devmentor/ui/components/ui/radio-group";

/** A short task on top of the page: here, editing one published slot (E02-S03). */
const EditSlot = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
  <Dialog defaultOpen={defaultOpen}>
    <DialogTrigger asChild>
      <Button variant="outline">Edytuj termin</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edytuj termin</DialogTitle>
        <DialogDescription>Termin można zarezerwować najpóźniej 2 godziny przed rozpoczęciem.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-between-groups">
        <Field>
          <FieldLabel htmlFor="slot-date">Data i godzina</FieldLabel>
          <Input id="slot-date" type="datetime-local" defaultValue="2026-11-13T18:00" />
        </Field>
        <RadioGroup defaultValue="25" aria-label="Długość">
          <Field orientation="horizontal">
            <RadioGroupItem value="25" id="slot-25" />
            <FieldLabel htmlFor="slot-25">25 minut</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="50" id="slot-50" />
            <FieldLabel htmlFor="slot-50">50 minut</FieldLabel>
          </Field>
        </RadioGroup>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Anuluj</Button>
        </DialogClose>
        <Button>Zapisz termin</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  render: () => <EditSlot />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { render: () => <EditSlot defaultOpen /> };

export const WithoutFooter: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link do Twojego profilu</DialogTitle>
          <DialogDescription>Wyślij go osobom, którym chcesz pomóc.</DialogDescription>
        </DialogHeader>
        <p className="rounded-sm bg-code px-2 py-1 font-mono text-sm break-all text-code-foreground">https://devmentor.example/m/anna-kowalska</p>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContentNarrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zmień termin sesji z Anną Kowalską zaplanowanej na piątek, 13 listopada, 18:00 CET</DialogTitle>
          <DialogDescription>
            Nowy termin musi zaczynać się co najmniej 2 godziny od teraz. Mentee dostanie powiadomienie o zmianie, a sesja zostanie przeniesiona razem z pytaniem i notatką.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Zostaw obecny termin</Button>
          </DialogClose>
          <Button>Zapisz nowy termin</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OpenTrapAndReturnFocus: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Edytuj termin" });
    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole("dialog", { name: "Edytuj termin" });
    await expect(dialog).toHaveAccessibleDescription("Termin można zarezerwować najpóźniej 2 godziny przed rozpoczęciem.");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

export const CloseButtonIsPolish: Story = {
  render: () => <EditSlot defaultOpen />,
  play: async () => {
    const body = within(document.body);
    await userEvent.click(await body.findByRole("button", { name: "Zamknij" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
  },
};
