import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLink } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@devmentor/ui/components/ui/button";

import { StateGrid } from "../../.storybook/blocks/StateGrid";

/** Link is the `link` variant of Button rendered as an anchor with `asChild`. */
const meta = {
  title: "Primitives/Link",
  component: Button,
  args: { variant: "link", asChild: true, children: <a href="/register">Załóż konto</a> },
  argTypes: { variant: { control: false }, size: { control: false }, asChild: { control: false } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InText: Story = {
  render: () => (
    <p className="max-w-reading text-sm">
      Nie masz konta?{" "}
      <Button asChild variant="link">
        <a href="/register">Załóż konto</a>
      </Button>
    </p>
  ),
};

export const External: Story = {
  render: () => (
    <Button asChild variant="link">
      <a href="https://github.com/annakowalska/ingress-upgrade-notes" target="_blank" rel="noreferrer">
        Publiczna praca: ingress-upgrade-notes
        <ExternalLink aria-hidden="true" data-icon="inline-end" />
        <span className="sr-only"> (otwiera się w nowej karcie)</span>
      </a>
    </Button>
  ),
};

const link = (state?: string) => (
  <Button asChild variant="link" data-preview-state={state}>
    <a href="/register">Załóż konto</a>
  </Button>
);

export const States: Story = {
  render: () => (
    <StateGrid
      items={[
        { label: "Default", node: link() },
        { label: "Hover", node: link("hover") },
        { label: "Focus", node: link("focus-visible") },
        { label: "Pressed", node: link("active") },
      ]}
    />
  ),
};

export const LongTextNarrow: Story = {
  render: () => (
    <p className="w-80 text-sm">
      Zanim zarezerwujesz, przeczytaj{" "}
      <Button asChild variant="link" className="whitespace-normal">
        <a href="/terms">warunki rezerwacji, w tym zasady anulowania bez zwrotu płatności</a>
      </Button>
      .
    </p>
  ),
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const anchor = within(canvasElement).getByRole("link", { name: "Załóż konto" });
    await expect(anchor).toHaveAttribute("href", "/register");
    await userEvent.tab();
    await expect(anchor).toHaveFocus();
  },
};
