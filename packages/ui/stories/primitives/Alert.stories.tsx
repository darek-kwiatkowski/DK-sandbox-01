import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, Info, RefreshCw } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@devmentor/ui/components/ui/alert";
import { Button } from "@devmentor/ui/components/ui/button";

const onReload = fn();

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  args: { variant: "default" },
  argTypes: { variant: { control: "inline-radio", options: ["default", "destructive"] } },
  render: (args) => (
    <Alert {...args} className="max-w-reading">
      <Info aria-hidden="true" />
      <AlertTitle>Płatność jest ostateczna</AlertTitle>
      <AlertDescription>Po opłaceniu sesji nie zwracamy pieniędzy, także gdy anulujesz rezerwację.</AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-reading flex-col gap-between-groups">
      <Alert role="note">
        <Info aria-hidden="true" />
        <AlertTitle>Płatność jest ostateczna</AlertTitle>
        <AlertDescription>Po opłaceniu sesji nie zwracamy pieniędzy, także gdy anulujesz rezerwację.</AlertDescription>
      </Alert>
      <Alert role="status">
        <Info aria-hidden="true" />
        <AlertDescription>Połączyliśmy konto z GitHub. Hasło ustawione wcześniej dla tego adresu zostało usunięte.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Nie udało się zalogować przez GitHub</AlertTitle>
        <AlertDescription>Spróbuj ponownie.</AlertDescription>
      </Alert>
    </div>
  ),
};

/** The stale-note notice from the platform primitives spec (P15). */
export const WithAction: Story = {
  render: () => (
    <Alert className="max-w-reading">
      <RefreshCw aria-hidden="true" />
      <AlertTitle>Druga osoba zmieniła notatkę</AlertTitle>
      <AlertDescription>Wczytaj najnowszą wersję. Twój tekst zostaje w polu, możesz go skopiować.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline" onClick={onReload}>
          Wczytaj najnowszą wersję
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert role="note" className="max-w-reading">
      <AlertDescription>Sesja jest tekstowa i odbywa się w DevMentor.</AlertDescription>
    </Alert>
  ),
};

export const LongTextNarrow: Story = {
  render: () => (
    <div className="w-80">
      <Alert variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Ten adres e-mail należy do konta połączonego z innym kontem GitHub</AlertTitle>
        <AlertDescription>Zaloguj się kontem GitHub, które było połączone wcześniej, albo zaloguj się adresem e-mail i hasłem.</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            Zaloguj się e-mailem
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
};

export const AnnouncedAndActionable: Story = {
  ...WithAction,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent("Druga osoba zmieniła notatkę");
    await userEvent.click(canvas.getByRole("button", { name: "Wczytaj najnowszą wersję" }));
    await expect(onReload).toHaveBeenCalledTimes(1);
  },
};
