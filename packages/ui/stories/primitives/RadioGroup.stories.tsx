import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@devmentor/ui/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@devmentor/ui/components/ui/radio-group";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

const DURATIONS = [
  { value: "25", label: "25 minut", price: "180,00 zł" },
  { value: "50", label: "50 minut", price: "320,00 zł" },
];

const Duration = ({ invalid = false, disabledValue }: { invalid?: boolean; disabledValue?: string }) => (
  <>
    {DURATIONS.map((d) => (
      <Field key={d.value} orientation="horizontal" data-invalid={invalid || undefined}>
        <RadioGroupItem value={d.value} id={`d-${d.value}`} aria-invalid={invalid || undefined} disabled={d.value === disabledValue} />
        <FieldLabel htmlFor={`d-${d.value}`}>
          {d.label} <span className="font-normal text-muted-foreground tabular-nums">· {d.price}</span>
        </FieldLabel>
      </Field>
    ))}
  </>
);

/** Choose exactly one of a few options visible at once: session length (R01). */
const meta = {
  title: "Primitives/Radio group",
  component: RadioGroup,
  args: { defaultValue: "25", onValueChange: fn(), "aria-label": "Długość sesji" },
  argTypes: { disabled: { control: "boolean" }, orientation: { control: "inline-radio", options: ["vertical", "horizontal"] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Duration />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithLegend: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Długość sesji</FieldLegend>
      <FieldDescription>Sesja jest tekstowa, w DevMentor.</FieldDescription>
      <RadioGroup defaultValue="25">
        <Duration />
      </RadioGroup>
    </FieldSet>
  ),
};

const item = (label: string, extra: Record<string, unknown> = {}) => (
  <RadioGroup defaultValue={extra.checked ? label : undefined} aria-label={label}>
    <Field orientation="horizontal">
      <RadioGroupItem value={label} id={`rs-${label}`} {...extra} />
      <FieldLabel htmlFor={`rs-${label}`}>{label}</FieldLabel>
    </Field>
  </RadioGroup>
);

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Unselected", node: item("Unselected") },
        { label: "Selected", node: item("Selected", { checked: true }) },
        { label: "Hover", node: item("Hover", { "data-preview-state": "hover" }) },
        { label: "Focus", node: item("Focus", { "data-preview-state": "focus-visible" }) },
        { label: "Disabled", node: item("Disabled", { disabled: true }) },
        { label: "Error", node: item("Error", { "aria-invalid": true }) },
      ]}
    />
  ),
};

export const DisabledOption: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Długość sesji</FieldLegend>
      <RadioGroup defaultValue="25" aria-describedby="dur-hint">
        <Duration disabledValue="50" />
      </RadioGroup>
      <FieldDescription id="dur-hint">Ten mentor nie ma wolnych 50 minut w wybranym dniu.</FieldDescription>
    </FieldSet>
  ),
};

export const NothingChosen: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Długość sesji</FieldLegend>
      <RadioGroup aria-describedby="dur-err" aria-invalid>
        <Duration invalid />
      </RadioGroup>
      <FieldError id="dur-err">Wybierz długość sesji.</FieldError>
    </FieldSet>
  ),
};

export const HorizontalNarrow: Story = {
  render: () => (
    <div className="w-80">
      <RadioGroup defaultValue="25" orientation="horizontal" aria-label="Długość sesji" className="grid-cols-2">
        <Duration />
      </RadioGroup>
    </div>
  ),
};

export const ArrowKeys: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("radio", { name: /25 minut/ });
    const second = canvas.getByRole("radio", { name: /50 minut/ });
    await userEvent.tab();
    await expect(first).toHaveFocus();
    // Hold the key like a person does: Radix moves focus on a timer and checks the item only while an arrow is down.
    await userEvent.keyboard("{ArrowDown>}");
    await waitFor(() => expect(second).toHaveFocus());
    await userEvent.keyboard("{/ArrowDown}");
    await expect(second).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith("50");
  },
};
