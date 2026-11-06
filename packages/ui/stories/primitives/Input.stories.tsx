import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Field, FieldDescription, FieldError, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Input } from "@devmentor/ui/components/ui/input";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { type: "email", placeholder: "anna@example.com", "aria-label": "E-mail" },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "email", "password", "url", "number"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Types: Story = {
  render: () => (
    <div className="flex max-w-80 flex-col gap-between-groups">
      <Field>
        <FieldLabel htmlFor="t-name">Imię i nazwisko</FieldLabel>
        <Input id="t-name" autoComplete="name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="t-email">E-mail</FieldLabel>
        <Input id="t-email" type="email" autoComplete="email" placeholder="anna@example.com" />
      </Field>
      <Field>
        <FieldLabel htmlFor="t-pass">Hasło</FieldLabel>
        <Input id="t-pass" type="password" autoComplete="new-password" aria-describedby="t-pass-hint" />
        <FieldDescription id="t-pass-hint">Co najmniej 12 znaków.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="t-url">Link do publicznej pracy</FieldLabel>
        <Input id="t-url" type="url" placeholder="https://github.com/…" />
      </Field>
    </div>
  ),
};

const input = (label: string, extra: Record<string, unknown> = {}) => (
  <Input aria-label={label} defaultValue="anna@example.com" {...extra} />
);

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Default", node: input("Default") },
        { label: "Hover", node: input("Hover", { "data-preview-state": "hover" }) },
        { label: "Focus", node: input("Focus", { "data-preview-state": "focus-visible" }) },
        { label: "Disabled", node: input("Disabled", { disabled: true }) },
        { label: "Read-only", node: input("Read-only", { readOnly: true }) },
        { label: "Error", node: input("Error", { "aria-invalid": true }) },
        { label: "Empty", node: <Input aria-label="Empty" placeholder="anna@example.com" /> },
      ]}
    />
  ),
};

export const ErrorWithMessage: Story = {
  render: () => (
    <Field data-invalid className="max-w-80">
      <FieldLabel htmlFor="e-email">E-mail</FieldLabel>
      <Input id="e-email" type="email" defaultValue="anna@example.com" aria-invalid aria-describedby="e-email-error" />
      <FieldError id="e-email-error">Konto z tym adresem już istnieje. Zaloguj się.</FieldError>
    </Field>
  ),
};

export const LongValueNarrow: Story = {
  render: () => (
    <div className="w-80">
      <Input aria-label="Link do publicznej pracy" type="url" defaultValue="https://github.com/annakowalska/platform-notes/blob/main/kubernetes/ingress-nginx-1.28-upgrade.md" />
    </div>
  ),
};

export const Typing: Story = {
  args: { type: "text", "aria-label": "Imię i nazwisko", placeholder: undefined },
  play: async ({ canvasElement }) => {
    const field = within(canvasElement).getByRole("textbox", { name: "Imię i nazwisko" });
    await userEvent.click(field);
    await userEvent.type(field, "Anna Kowalska");
    await expect(field).toHaveValue("Anna Kowalska");
    await userEvent.clear(field);
    await expect(field).toHaveValue("");
  },
};
