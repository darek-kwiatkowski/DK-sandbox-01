import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Separator } from "@devmentor/ui/components/ui/separator";

/** A thin line that separates groups (R01.3). Decorative by default. */
const meta = {
  title: "Primitives/Separator",
  component: Separator,
  args: { orientation: "horizontal", decorative: true },
  argTypes: { orientation: { control: "inline-radio", options: ["horizontal", "vertical"] }, decorative: { control: "boolean" } },
  render: (args) => (
    <div className="flex h-16 max-w-80 flex-col justify-center gap-in-group text-sm data-[o=vertical]:flex-row" data-o={args.orientation}>
      <span>Profil</span>
      <Separator {...args} />
      <span>Ceny</span>
    </div>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Orientations: Story = {
  render: () => (
    <div className="flex flex-col gap-between-groups text-sm">
      <div className="flex max-w-80 flex-col gap-in-group">
        <span>Konto</span>
        <Separator />
        <span>Panel mentora</span>
      </div>
      <div className="flex h-6 items-center gap-in-group">
        <span>Anna Kowalska</span>
        <Separator orientation="vertical" />
        <span className="text-muted-foreground">TypeScript, React</span>
      </div>
    </div>
  ),
};

export const NarrowWidth: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-in-group text-sm">
      <span>Najbliższy termin: pt., 13 lis, 18:00 CET</span>
      <Separator />
      <span>25 minut · 180,00 zł</span>
    </div>
  ),
};

export const DecorativeOrSemantic: Story = {
  render: () => (
    <div className="flex max-w-80 flex-col gap-in-group text-sm">
      <Separator />
      <Separator decorative={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("separator")).toHaveLength(1);
    await expect(canvasElement.querySelectorAll('[data-slot="separator"][role="none"]')).toHaveLength(1);
  },
};
