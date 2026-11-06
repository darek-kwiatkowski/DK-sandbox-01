import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@devmentor/ui/components/ui/alert-dialog";
import { Button } from "@devmentor/ui/components/ui/button";

const onCancelBooking = fn();

/** Mentee cancels a paid booking: no refund (R27, D39). */
const CancelBooking = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
  <AlertDialog defaultOpen={defaultOpen}>
    <AlertDialogTrigger asChild>
      <Button variant="destructive">Anuluj rezerwację</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Anulować sesję z Anną Kowalską, pt., 13 lis, 18:00 CET?</AlertDialogTitle>
        <AlertDialogDescription>Płatność 180,00 zł nie zostanie zwrócona. Tej operacji nie można cofnąć.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Zostaw rezerwację</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={onCancelBooking}>
          Anuluj rezerwację
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const meta = {
  title: "Primitives/Alert dialog",
  component: AlertDialog,
  render: () => <CancelBooking />,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CancelBookingOpen: Story = { render: () => <CancelBooking defaultOpen /> };

/** Operator revokes a mentor invitation (E01-S02; proposal: copy waits for the story spec). */
export const RevokeInvitation: Story = {
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cofnąć zaproszenie dla marek.zielinski@example.com?</AlertDialogTitle>
          <AlertDialogDescription>Link z zaproszenia przestanie działać.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zostaw zaproszenie</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Cofnij zaproszenie</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const LongTitleNarrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => <CancelBooking defaultOpen />,
};

export const CancelIsTheSafeDefault: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Anuluj rezerwację" }));
    const body = within(document.body);
    const dialog = await body.findByRole("alertdialog");
    await waitFor(() => expect(body.getByRole("button", { name: "Zostaw rezerwację" })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("alertdialog")).toBeNull());
    await expect(onCancelBooking).not.toHaveBeenCalled();
    await expect(dialog).not.toBeInTheDocument();
  },
};

export const ConfirmRunsTheAction: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Anuluj rezerwację" }));
    const dialog = await within(document.body).findByRole("alertdialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Anuluj rezerwację" }));
    await expect(onCancelBooking).toHaveBeenCalledTimes(1);
  },
};
