import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Checkbox } from "@devmentor/ui/components/ui/checkbox";
import { Field, FieldError, FieldLabel, FieldLegend, FieldSet } from "@devmentor/ui/components/ui/field";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

const STACK_TAGS = ["TypeScript", "React", "Python", "AI agents"];

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  args: { onCheckedChange: fn(), "aria-label": "TypeScript" },
  argTypes: {
    checked: { control: "inline-radio", options: [false, true, "indeterminate"] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Stack tags of a mentor profile (R13): several can be on. */
export const StackTags: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Stack</FieldLegend>
      <div data-slot="checkbox-group" className="flex flex-col gap-3">
        {STACK_TAGS.map((tag) => (
          <Field key={tag} orientation="horizontal">
            <Checkbox id={`tag-${tag}`} defaultChecked={tag === "TypeScript"} />
            <FieldLabel htmlFor={`tag-${tag}`}>{tag}</FieldLabel>
          </Field>
        ))}
      </div>
    </FieldSet>
  ),
};

const box = (label: string, extra: Record<string, unknown> = {}) => (
  <Field orientation="horizontal">
    <Checkbox id={`s-${label}`} {...extra} />
    <FieldLabel htmlFor={`s-${label}`}>{label}</FieldLabel>
  </Field>
);

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Unchecked", node: box("Unchecked") },
        { label: "Checked", node: box("Checked", { defaultChecked: true }) },
        { label: "Hover", node: box("Hover", { "data-preview-state": "hover" }) },
        { label: "Focus", node: box("Focus", { "data-preview-state": "focus-visible" }) },
        { label: "Disabled", node: box("Disabled", { disabled: true }) },
        { label: "Disabled, checked", node: box("Disabled checked", { disabled: true, defaultChecked: true }) },
        { label: "Error", node: box("Error", { "aria-invalid": true }) },
      ]}
    />
  ),
};

export const RequiredSelection: Story = {
  render: () => (
    <FieldSet aria-describedby="tags-error">
      <FieldLegend variant="label">Stack</FieldLegend>
      <div data-slot="checkbox-group" className="flex flex-col gap-3">
        {STACK_TAGS.map((tag) => (
          <Field key={tag} orientation="horizontal" data-invalid>
            <Checkbox id={`req-${tag}`} aria-invalid />
            <FieldLabel htmlFor={`req-${tag}`}>{tag}</FieldLabel>
          </Field>
        ))}
      </div>
      <FieldError id="tags-error">Wybierz co najmniej jeden stack.</FieldError>
    </FieldSet>
  ),
};

export const LongLabelNarrow: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-80">
      <Checkbox id="long" />
      <FieldLabel htmlFor="long">Pokazuj tylko mentorów z terminem w tym tygodniu, także w późnych godzinach wieczornych</FieldLabel>
    </Field>
  ),
};

export const ToggleWithKeyboardAndLabel: Story = {
  render: (args) => (
    <Field orientation="horizontal">
      <Checkbox id="kb" onCheckedChange={args.onCheckedChange} />
      <FieldLabel htmlFor="kb">React</FieldLabel>
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", { name: "React" });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
    await userEvent.click(canvas.getByText("React"));
    await expect(box).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
  },
};
