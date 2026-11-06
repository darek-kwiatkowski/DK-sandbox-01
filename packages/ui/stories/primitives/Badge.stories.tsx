import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { Badge } from "@devmentor/ui/components/ui/badge";

/** Status and tag labels. Proposal: booking and payout status names wait for the E03 and E05 specs. */
const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Mentor", variant: "secondary" },
  argTypes: { variant: { control: "inline-radio", options: ["secondary", "outline", "destructive"] }, asChild: { control: false } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-in-group">
      <Badge>Mentor</Badge>
      <Badge variant="outline">TypeScript</Badge>
      <Badge variant="destructive">
        <CircleAlert aria-hidden="true" data-icon="inline-start" />
        Wypłata wstrzymana
      </Badge>
    </div>
  ),
};

/** Roles on /account (E01-S01 spec), stack tags (R13) and statuses (proposal). */
export const InProduct: Story = {
  render: () => (
    <div className="flex flex-col gap-between-groups text-sm">
      <div className="flex items-center gap-in-group">
        <span className="text-muted-foreground">Role:</span>
        <Badge>Mentor</Badge>
        <Badge>Operator</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-in-group">
        <span className="text-muted-foreground">Stack:</span>
        {["TypeScript", "React", "Python", "AI agents"].map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-in-group">
        <span className="text-muted-foreground">Status:</span>
        <Badge>Opłacona</Badge>
        <Badge variant="outline">Zakończona</Badge>
        <Badge variant="destructive">Anulowana</Badge>
      </div>
    </div>
  ),
};

/** A badge has no interactive states; as a filter link it gets hover and focus. */
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-in-group">
      <Badge variant="outline">Static</Badge>
      <Badge asChild variant="outline">
        <a href="/mentors?stack=react">React (link)</a>
      </Badge>
      <Badge asChild variant="outline" data-preview-state="hover">
        <a href="/mentors?stack=python">Python (hover)</a>
      </Badge>
      <Badge asChild variant="outline" data-preview-state="focus-visible">
        <a href="/mentors?stack=typescript">TypeScript (focus)</a>
      </Badge>
    </div>
  ),
};

export const LongTextNarrow: Story = {
  render: () => (
    <div className="flex w-80 flex-wrap gap-in-group">
      <Badge variant="destructive" className="h-auto whitespace-normal">
        Wypłata wstrzymana do rozstrzygnięcia zgłoszenia
      </Badge>
      <Badge variant="outline">AI agents</Badge>
    </div>
  ),
};

export const NotFocusableUnlessLink: Story = {
  render: () => (
    <div className="flex gap-in-group">
      <Badge>Mentor</Badge>
      <Badge asChild variant="outline">
        <a href="/mentors?stack=react">React</a>
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "React" })).toHaveFocus();
    await expect(canvas.getByText("Mentor")).not.toHaveAttribute("tabindex");
  },
};
