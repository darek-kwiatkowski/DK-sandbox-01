import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Field, FieldDescription, FieldError, FieldLabel } from "@devmentor/ui/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@devmentor/ui/components/ui/select";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

/** Start times every 30 minutes, 08:00–21:30: a slot editor list (E02-S03). */
const START_TIMES = Array.from({ length: 28 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${minutes % 60 === 0 ? "00" : "30"}`;
});

const StartTime = ({ id = "start", invalid = false, disabled = false, empty = false, ...trigger }: { id?: string; invalid?: boolean; disabled?: boolean; empty?: boolean; [k: string]: unknown }) => (
  <Select defaultValue={invalid || empty ? undefined : "18:00"} disabled={disabled}>
    <SelectTrigger id={id} className="w-40" aria-invalid={invalid || undefined} {...trigger}>
      <SelectValue placeholder="Wybierz godzinę" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Rano i po południu</SelectLabel>
        {START_TIMES.slice(0, 18).map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Wieczorem</SelectLabel>
        {START_TIMES.slice(18).map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

const meta = {
  title: "Primitives/Select",
  component: Select,
  args: { onValueChange: fn(), defaultValue: "18:00" },
  argTypes: { disabled: { control: "boolean" } },
  render: (args) => (
    <Field className="max-w-80">
      <FieldLabel htmlFor="pg-start">Godzina rozpoczęcia</FieldLabel>
      <Select {...args}>
        <SelectTrigger id="pg-start" className="w-40">
          <SelectValue placeholder="Wybierz godzinę" />
        </SelectTrigger>
        <SelectContent>
          {START_TIMES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const GroupsAndSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-between-groups">
      <Field className="w-auto">
        <FieldLabel htmlFor="gs-1">Godzina rozpoczęcia</FieldLabel>
        <StartTime id="gs-1" />
      </Field>
      <Field className="w-auto">
        <FieldLabel htmlFor="gs-2">Godzina (w wierszu tabeli)</FieldLabel>
        <StartTime id="gs-2" size="sm" />
      </Field>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Default", node: <StartTime id="s1" aria-label="Default" /> },
        { label: "Hover", node: <StartTime id="s2" aria-label="Hover" data-preview-state="hover" /> },
        { label: "Focus", node: <StartTime id="s3" aria-label="Focus" data-preview-state="focus-visible" /> },
        { label: "Placeholder", node: <StartTime id="s4" aria-label="Placeholder" empty /> },
        { label: "Disabled", node: <StartTime id="s5" aria-label="Disabled" disabled /> },
        { label: "Error", node: <StartTime id="s6" aria-label="Error" invalid /> },
      ]}
    />
  ),
};

export const ErrorWithMessage: Story = {
  render: () => (
    <Field data-invalid className="max-w-80">
      <FieldLabel htmlFor="err-start">Godzina rozpoczęcia</FieldLabel>
      <StartTime id="err-start" invalid aria-describedby="err-start-msg" />
      <FieldError id="err-start-msg">Wybierz godzinę rozpoczęcia.</FieldError>
    </Field>
  ),
};

export const DisabledWithReason: Story = {
  render: () => (
    <Field data-disabled className="max-w-80">
      <FieldLabel htmlFor="dis-start">Godzina rozpoczęcia</FieldLabel>
      <StartTime id="dis-start" disabled aria-describedby="dis-start-hint" />
      <FieldDescription id="dis-start-hint">Najpierw wybierz dzień.</FieldDescription>
    </Field>
  ),
};

export const LongOptionsNarrow: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="tz">Strefa czasowa</FieldLabel>
      <Select defaultValue="waw">
        <SelectTrigger id="tz" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="waw">Europe/Warsaw (CET, UTC+01:00, czas środkowoeuropejski)</SelectItem>
          <SelectItem value="lon">Europe/London (GMT, UTC+00:00)</SelectItem>
          <SelectItem value="ny">America/New_York (EST, UTC−05:00)</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  ),
};

export const ChooseWithKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", { name: "Godzina rozpoczęcia" });
    await expect(trigger).toHaveTextContent("18:00");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("listbox")).toBeVisible());
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(trigger).toHaveTextContent("18:30"));
    await expect(args.onValueChange).toHaveBeenCalledWith("18:30");
    await expect(trigger).toHaveFocus();
  },
};

export const EscapeCloses: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("combobox", { name: "Godzina rozpoczęcia" });
    await userEvent.click(trigger);
    await waitFor(() => expect(within(document.body).getByRole("listbox")).toBeVisible());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("listbox")).toBeNull());
    await expect(trigger).toHaveTextContent("18:00");
  },
};
