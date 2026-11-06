import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@devmentor/ui/components/ui/field";
import { Input } from "@devmentor/ui/components/ui/input";
import { Label } from "@devmentor/ui/components/ui/label";
import { Textarea } from "@devmentor/ui/components/ui/textarea";
import { Checkbox } from "@devmentor/ui/components/ui/checkbox";

/** Field wires a label, a hint and an error to one control. Label is the bare primitive under it. */
const meta = {
  title: "Primitives/Field",
  component: Field,
  args: { orientation: "vertical" },
  argTypes: { orientation: { control: "inline-radio", options: ["vertical", "horizontal", "responsive"] } },
  render: (args) => (
    <Field {...args} className="max-w-80">
      <FieldLabel htmlFor="pg-pass">Hasło</FieldLabel>
      <Input id="pg-pass" type="password" aria-describedby="pg-pass-hint" />
      <FieldDescription id="pg-pass-hint">Co najmniej 12 znaków.</FieldDescription>
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every field shows its label; optional fields say so in the label. */
export const RequiredAndOptional: Story = {
  render: () => (
    <FieldGroup className="max-w-80">
      <Field>
        <FieldLabel htmlFor="ro-name">Imię i nazwisko</FieldLabel>
        <Input id="ro-name" required autoComplete="name" />
      </Field>
      <Field>
        <FieldLabel htmlFor="ro-work">Link do publicznej pracy</FieldLabel>
        <Input id="ro-work" type="url" required aria-describedby="ro-work-hint" />
        <FieldDescription id="ro-work-hint">Repozytorium, wpis lub prezentacja, w której widać, co robisz.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="ro-more">Dodatkowy link (opcjonalnie)</FieldLabel>
        <Input id="ro-more" type="url" />
      </Field>
    </FieldGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field data-invalid className="max-w-80">
      <FieldLabel htmlFor="we-email">E-mail</FieldLabel>
      <Input id="we-email" type="email" defaultValue="anna@example.com" aria-invalid aria-describedby="we-email-error" />
      <FieldError id="we-email-error">Konto z tym adresem już istnieje. Zaloguj się.</FieldError>
    </Field>
  ),
};

export const MultipleErrors: Story = {
  render: () => (
    <Field data-invalid className="max-w-80">
      <FieldLabel htmlFor="me-pass">Hasło</FieldLabel>
      <Input id="me-pass" type="password" aria-invalid aria-describedby="me-pass-error" />
      <FieldError
        id="me-pass-error"
        errors={[{ message: "Hasło musi mieć co najmniej 12 znaków." }, { message: "Hasło może mieć najwyżej 72 bajty." }]}
      />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field data-disabled className="max-w-80">
      <FieldLabel htmlFor="d-email">E-mail</FieldLabel>
      <Input id="d-email" disabled defaultValue="anna@example.com" aria-describedby="d-email-hint" />
      <FieldDescription id="d-email-hint">Adres pochodzi z konta GitHub i zmienisz go tylko tam.</FieldDescription>
    </Field>
  ),
};

export const HorizontalWithCheckbox: Story = {
  render: () => (
    <Field orientation="horizontal" className="max-w-80">
      <Checkbox id="h-ts" />
      <FieldContent>
        <FieldLabel htmlFor="h-ts">TypeScript</FieldLabel>
        <FieldDescription>Typy generyczne, migracje do strict.</FieldDescription>
      </FieldContent>
    </Field>
  ),
};

export const FieldSetWithLegend: Story = {
  render: () => (
    <FieldSet className="max-w-80">
      <FieldLegend>Profil mentora</FieldLegend>
      <FieldDescription>Mentee widzą te dane na Twojej stronie.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fs-name">Imię i nazwisko</FieldLabel>
          <Input id="fs-name" defaultValue="Anna Kowalska" />
        </Field>
        <Field>
          <FieldLabel htmlFor="fs-desc">Opis</FieldLabel>
          <Textarea id="fs-desc" rows={3} />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const SeparatorWithText: Story = {
  render: () => (
    <div className="flex max-w-80 flex-col gap-between-groups">
      <p className="text-sm">Zaloguj się przez GitHub</p>
      <FieldSeparator>lub</FieldSeparator>
      <p className="text-sm">E-mail i hasło</p>
    </div>
  ),
};

export const BareLabel: Story = {
  render: () => (
    <div className="flex items-center gap-in-group">
      <Checkbox id="bl-terms" />
      <Label htmlFor="bl-terms">Znam zasady anulowania bez zwrotu płatności</Label>
    </div>
  ),
};

export const LongLabelNarrow: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="ll">Link do repozytorium lub wpisu, w którym opisujesz migrację, w której brałaś lub brałeś udział</FieldLabel>
      <Input id="ll" type="url" />
    </Field>
  ),
};

export const LabelFocusesControl: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Hasło"));
    const input = canvas.getByLabelText("Hasło");
    await expect(input).toHaveFocus();
    await expect(input).toHaveAccessibleDescription("Co najmniej 12 znaków.");
  },
};

export const ErrorIsAnnounced: Story = {
  ...WithError,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("E-mail");
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Konto z tym adresem już istnieje. Zaloguj się.");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Konto z tym adresem już istnieje.");
  },
};
