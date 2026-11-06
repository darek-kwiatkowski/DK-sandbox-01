import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";

import { Avatar, AvatarFallback, AvatarImage } from "@devmentor/ui/components/ui/avatar";

/** GitHub picture with initials as fallback (sign-in with GitHub, R06). Approved in stage 0, Q5. */
const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  args: { size: "default" },
  argTypes: { size: { control: "inline-radio", options: ["default", "sm"] } },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="/avatars/anna-kowalska.svg" alt="" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-between-groups">
      <Avatar>
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/** The name is always next to the avatar, so the picture is decorative (alt=""). */
export const WithName: Story = {
  render: () => (
    <div className="flex flex-col gap-between-groups text-sm">
      <div className="flex items-center gap-in-group">
        <Avatar>
          <AvatarImage src="/avatars/anna-kowalska.svg" alt="" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <span className="font-medium">Anna Kowalska</span>
      </div>
      <div className="flex items-center gap-in-group">
        <Avatar size="sm">
          <AvatarFallback>MZ</AvatarFallback>
        </Avatar>
        <span className="font-medium">Marek Zieliński</span>
        <span className="text-muted-foreground">· 14:05</span>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-between-groups text-sm">
      <span className="flex items-center gap-in-group">
        <Avatar>
          <AvatarImage src="/avatars/anna-kowalska.svg" alt="" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        Picture
      </span>
      <span className="flex items-center gap-in-group">
        <Avatar>
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        No picture: initials
      </span>
      <span className="flex items-center gap-in-group">
        <Avatar>
          <AvatarImage src="/avatars/does-not-exist.png" alt="" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        Picture failed: initials
      </span>
    </div>
  ),
};

export const LongNameNarrow: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-in-group text-sm">
      <Avatar>
        <AvatarFallback>KW</AvatarFallback>
      </Avatar>
      <span className="min-w-0 font-medium break-words">Katarzyna Wiśniewska-Grabowska, mentorka platform engineering</span>
    </div>
  ),
};

export const FallbackWhenImageFails: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/avatars/does-not-exist.png" alt="" />
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(within(canvasElement).getByText("AK")).toBeVisible());
    await expect(canvasElement.querySelector("img")).toBeNull();
  },
};
