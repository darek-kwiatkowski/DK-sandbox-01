import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, LogOut } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "@devmentor/ui/components/ui/button";
import { FieldDescription } from "@devmentor/ui/components/ui/field";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Zarezerwuj termin", onClick: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "outline", "secondary", "ghost", "destructive", "link"] },
    size: { control: "inline-radio", options: ["default", "sm", "icon", "icon-sm"] },
    disabled: { control: "boolean" },
    asChild: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-between-groups">
      <Button>Zarezerwuj termin</Button>
      <Button variant="outline">Anuluj</Button>
      <Button variant="secondary">Zapisz szkic</Button>
      <Button variant="ghost">Pokaż wszystkie terminy</Button>
      <Button variant="destructive">Anuluj rezerwację</Button>
      <Button variant="link">Załóż konto</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-between-groups">
      <Button>Zapisz profil</Button>
      <Button size="sm" variant="outline">
        Następna
      </Button>
      <Button size="icon" variant="outline" aria-label="Kopiuj link do profilu">
        <Copy aria-hidden="true" />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Kopiuj link do profilu">
        <Copy aria-hidden="true" />
      </Button>
      <Button variant="outline">
        <LogOut aria-hidden="true" data-icon="inline-start" />
        Wyloguj się
      </Button>
    </div>
  ),
};

const states = (variant: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link", label: string) => [
  { label: "Default", node: <Button variant={variant}>{label}</Button> },
  { label: "Hover", node: <Button variant={variant} data-preview-state="hover">{label}</Button> },
  { label: "Focus", node: <Button variant={variant} data-preview-state="focus-visible">{label}</Button> },
  { label: "Pressed", node: <Button variant={variant} data-preview-state="active">{label}</Button> },
  { label: "Disabled", node: <Button variant={variant} disabled>{label}</Button> },
  { label: "Loading", node: <Button variant={variant} disabled aria-busy="true">Zapisywanie…</Button> },
];

/** Hover, focus and pressed are frozen previews (`data-preview-state`) of the real :hover, :focus-visible and :active styles. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <StateGrid items={states("default", "Zarezerwuj termin")} />
      <StateGrid items={states("outline", "Anuluj")} />
      <StateGrid items={states("secondary", "Zapisz szkic")} />
      <StateGrid items={states("ghost", "Pokaż terminy")} />
      <StateGrid items={states("destructive", "Anuluj rezerwację")} />
      <StateGrid items={states("link", "Załóż konto")} />
    </div>
  ),
};

/** A disabled action always says why next to it. */
export const DisabledWithReason: Story = {
  render: () => (
    <div className="flex max-w-80 flex-col gap-in-group">
      <Button disabled aria-describedby="why-disabled">
        Zarezerwuj termin
      </Button>
      <FieldDescription id="why-disabled">Najpierw wybierz termin i długość sesji.</FieldDescription>
    </div>
  ),
};

export const LongLabelNarrow: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-in-group">
      <Button className="w-full whitespace-normal">Zarezerwuj 50 minut z Anną Kowalską, pt., 13 lis, 18:00 CET</Button>
      <Button variant="outline" className="w-full">
        Anuluj
      </Button>
    </div>
  ),
};

export const ClickAndKeyboard: Story = {
  args: { children: "Zapisz profil" },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Zapisz profil" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const DisabledDoesNothing: Story = {
  args: { children: "Zarezerwuj termin", disabled: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Zarezerwuj termin" });
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
