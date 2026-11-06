import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Skeleton } from "@devmentor/ui/components/ui/skeleton";

/** Mentor list rows while loading (E03-S01): same shape as a loaded row. */
const MentorRowsLoading = ({ rows = 3 }: { rows?: number }) => (
  <div aria-busy="true" className="max-w-page">
    <p role="status" className="sr-only">
      Wczytywanie mentorów…
    </p>
    <ul className="divide-y divide-border border-y border-border">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-between-groups px-list-row-x py-list-row-y">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-32" />
        </li>
      ))}
    </ul>
  </div>
);

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  args: { className: "h-4 w-48" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MentorListLoading: Story = { render: () => <MentorRowsLoading /> };

export const ProfileLoading: Story = {
  render: () => (
    <div aria-busy="true" className="flex max-w-reading flex-col gap-in-group">
      <p role="status" className="sr-only">
        Wczytywanie profilu…
      </p>
      <Skeleton className="h-6 w-56" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  ),
};

export const Narrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <div className="w-80">
      <MentorRowsLoading rows={2} />
    </div>
  ),
};

export const AnnouncedOnceNotPerShape: Story = {
  render: () => <MentorRowsLoading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent("Wczytywanie mentorów…");
    for (const shape of canvasElement.querySelectorAll('[data-slot="skeleton"]')) {
      await expect(shape).toHaveAttribute("aria-hidden", "true");
    }
  },
};
