import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button } from "@devmentor/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@devmentor/ui/components/ui/tooltip";

const CopyLink = ({ open }: { open?: boolean }) => (
  <TooltipProvider>
    <Tooltip open={open}>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Kopiuj link do profilu">
          <Copy aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Kopiuj link do profilu</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/** Repeats the name of an icon-only control (share link, R13). */
const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  render: () => (
    <div className="p-section">
      <CopyLink />
    </div>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shown: Story = {
  render: () => (
    <div className="p-section">
      <CopyLink open />
    </div>
  ),
};

export const LongTextNarrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <div className="p-section">
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Kopiuj link do profilu Anny Kowalskiej, mentorki TypeScript i React">
              <Copy aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kopiuj link do profilu Anny Kowalskiej, mentorki TypeScript i React</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};

export const ShowsOnFocusHidesOnEscape: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button", { name: "Kopiuj link do profilu" })).toHaveFocus();
    await waitFor(() => expect(within(document.body).getByRole("tooltip")).toHaveTextContent("Kopiuj link do profilu"));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("tooltip")).toBeNull());
  },
};
