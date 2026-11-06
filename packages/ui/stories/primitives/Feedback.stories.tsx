import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { EmptyState, ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { Button } from "@devmentor/ui/components/ui/button";

const onRetry = fn();

/** The only sanctioned loading, error and empty renderers (engineering standards). */
const meta = {
  title: "Primitives/Feedback",
  component: LoadingMessage,
} satisfies Meta<typeof LoadingMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { label: "Wczytywanie terminów…" } };

export const LoadingDefault: Story = {};

export const Error: Story = { render: () => <ErrorMessage message="Nie udało się wczytać terminów." onRetry={onRetry} /> };

export const ErrorDefaultNoRetry: Story = { render: () => <ErrorMessage /> };

export const Empty: Story = {
  render: () => (
    <EmptyState
      title="Nie masz jeszcze opublikowanych terminów."
      description="Mentee zobaczą Cię na liście, gdy opublikujesz co najmniej jeden termin."
      action={<Button>Dodaj termin</Button>}
    />
  ),
};

export const EmptyTitleOnly: Story = { render: () => <EmptyState title="Brak zaproszeń." /> };

export const LongTextNarrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <div className="flex w-80 flex-col gap-section">
      <ErrorMessage message="Nie udało się wczytać listy mentorów, bo serwer nie odpowiedział w wymaganym czasie." onRetry={onRetry} />
      <EmptyState title="Żaden mentor nie pasuje do wybranych filtrów." description="Wyczyść filtry albo wybierz inny stack." />
    </div>
  ),
};

export const RetryRunsAgain: Story = {
  ...Error,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Nie udało się wczytać terminów.");
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(onRetry).toHaveBeenCalledTimes(1);
  },
};

export const LoadingIsAnnounced: Story = {
  ...Loading,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByRole("status");
    await expect(status).toHaveTextContent("Wczytywanie terminów…");
    await expect(status).toHaveAttribute("aria-live", "polite");
  },
};
