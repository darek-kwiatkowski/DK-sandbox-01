import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@devmentor/ui/components/ui/card";

const onSignOut = fn();

/** A panel that groups one topic on a page. Not for list rows: lists use lines (R01.3). */
const meta = {
  title: "Primitives/Card",
  component: Card,
  args: { size: "default" },
  argTypes: { size: { control: "inline-radio", options: ["default", "sm"] } },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Konto</CardTitle>
        <CardDescription>Dane, którymi logujesz się do DevMentor.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-in-group">
        <p>Anna Kowalska</p>
        <p className="text-muted-foreground">anna@example.com</p>
      </CardContent>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The /account panels from the E01-S01 spec. */
export const AccountPanels: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-between-groups">
      <Card>
        <CardHeader>
          <CardTitle>Konto</CardTitle>
          <CardAction>
            <div className="flex gap-in-group">
              <Badge>Mentor</Badge>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-in-group">
          <p className="font-medium">Anna Kowalska</p>
          <p className="text-muted-foreground">anna@example.com</p>
          <p>Połączono z GitHub: @annakowalska</p>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <Button variant="outline" onClick={onSignOut}>
            Wyloguj się
          </Button>
          <p className="text-muted-foreground">Wylogujemy Cię na wszystkich urządzeniach.</p>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Small: Story = { args: { size: "sm" } };

export const LongContentNarrow: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Połącz konto GitHub z kontem założonym przez adres e-mail i hasło</CardTitle>
        <CardDescription>Główny, zweryfikowany adres e-mail na GitHub musi być taki sam jak adres tego konta.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          Połącz konto GitHub
        </Button>
      </CardContent>
    </Card>
  ),
};

/** Card is not interactive itself; its controls keep their own focus order. */
export const ActionInsideCard: Story = {
  ...AccountPanels,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Konto")).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Wyloguj się" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(onSignOut).toHaveBeenCalledTimes(1);
  },
};
