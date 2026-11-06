import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Field, FieldDescription, FieldError, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Textarea } from "@devmentor/ui/components/ui/textarea";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  args: { "aria-label": "Opis", placeholder: "Np. robię upgrade'y ingress-nginx i migracje Helm 3 na produkcji." },
  argTypes: { disabled: { control: "boolean" }, rows: { control: "number" } },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ProfileDescription: Story = {
  render: () => (
    <Field className="max-w-reading">
      <FieldLabel htmlFor="opis">Opis</FieldLabel>
      <Textarea id="opis" aria-describedby="opis-hint" rows={4} />
      <FieldDescription id="opis-hint">Napisz, co robiłaś lub robiłeś, np. „upgrade ingress-nginx do 1.28”, a nie „10 lat doświadczenia”.</FieldDescription>
    </Field>
  ),
};

const area = (label: string, extra: Record<string, unknown> = {}) => (
  <Textarea aria-label={label} defaultValue="Migracja na server components w Next.js 16" {...extra} />
);

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Default", node: area("Default") },
        { label: "Hover", node: area("Hover", { "data-preview-state": "hover" }) },
        { label: "Focus", node: area("Focus", { "data-preview-state": "focus-visible" }) },
        { label: "Disabled", node: area("Disabled", { disabled: true }) },
        { label: "Error", node: area("Error", { "aria-invalid": true }) },
        { label: "Empty", node: <Textarea aria-label="Empty" /> },
      ]}
    />
  ),
};

export const ErrorWithMessage: Story = {
  render: () => (
    <Field data-invalid className="max-w-reading">
      <FieldLabel htmlFor="opis-err">Opis</FieldLabel>
      <Textarea id="opis-err" aria-invalid aria-describedby="opis-err-msg" />
      <FieldError id="opis-err-msg">Dodaj opis, żeby mentee wiedzieli, w czym pomagasz.</FieldError>
    </Field>
  ),
};

export const LongTextNarrow: Story = {
  render: () => (
    <div className="w-80">
      <Textarea
        aria-label="Wiadomość"
        defaultValue={"Po upgrade do ingress-nginx 1.28 reguły z adnotacji przestały działać.\nW values.yaml mamy allow-snippet-annotations: false.\nCzy trzeba to włączyć jawnie, czy przenieść reguły do ConfigMap?"}
      />
    </div>
  ),
};

export const TypingMultiline: Story = {
  play: async ({ canvasElement }) => {
    const area = within(canvasElement).getByRole("textbox", { name: "Opis" });
    await userEvent.click(area);
    await userEvent.type(area, "Helm 3{Shift>}{Enter}{/Shift}Kubernetes");
    await expect(area).toHaveValue("Helm 3\nKubernetes");
  },
};
