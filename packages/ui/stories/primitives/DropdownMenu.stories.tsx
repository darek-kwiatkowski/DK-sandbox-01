import type { Meta, StoryObj } from "@storybook/react-vite";
import { Copy, LogOut, MoreHorizontal, Send, Trash2, User } from "lucide-react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Button } from "@devmentor/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@devmentor/ui/components/ui/dropdown-menu";

const onCopy = fn();

/**
 * Documented a11y exception for stories that render the menu open: while a modal menu is open, Radix
 * marks the rest of the page aria-hidden and traps focus in the menu, so the trigger is unreachable
 * although axe reports it as focusable inside aria-hidden (aria-hidden-focus). Closed-menu stories
 * and the keyboard test run every rule.
 */
const OPEN_MENU_A11Y = { a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } } };

/** Row actions for one mentor invitation (E01-S02; proposal: the actions wait for the story spec). */
const InvitationActions = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
  <DropdownMenu defaultOpen={defaultOpen}>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon-sm" aria-label="Akcje: marek.zielinski@example.com">
        <MoreHorizontal aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onSelect={onCopy}>
        <Copy aria-hidden="true" />
        Kopiuj link zaproszenia
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Send aria-hidden="true" />
        Wyślij ponownie
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <Trash2 aria-hidden="true" />
        Cofnij zaproszenie…
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const meta = {
  title: "Primitives/Dropdown menu",
  component: DropdownMenu,
  render: () => (
    <div className="flex justify-end">
      <InvitationActions />
    </div>
  ),
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const RowActionsOpen: Story = {
  parameters: OPEN_MENU_A11Y,
  render: () => (
    <div className="flex h-48 justify-end">
      <InvitationActions defaultOpen />
    </div>
  ),
};

/** Account menu in the app shell (E01-S01 navigation). */
export const AccountMenuOpen: Story = {
  parameters: OPEN_MENU_A11Y,
  render: () => (
    <div className="h-56">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Anna Kowalska</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>anna@example.com</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User aria-hidden="true" />
              Konto
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Panel operatora</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut aria-hidden="true" />
            Wyloguj się
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const LongItemsNarrow: Story = {
  parameters: OPEN_MENU_A11Y,
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <div className="h-48">
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Akcje sesji</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-72">
          <DropdownMenuItem className="whitespace-normal">Pobierz notatkę z sesji jako plik Markdown do runbooka</DropdownMenuItem>
          <DropdownMenuItem>Zgłoś problem z sesją</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", { name: "Akcje: marek.zielinski@example.com" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await within(document.body).findByRole("menu");
    await waitFor(() => expect(within(menu).getByRole("menuitem", { name: "Kopiuj link zaproszenia" })).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(within(menu).getByRole("menuitem", { name: "Wyślij ponownie" })).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{Enter}");
    await expect(onCopy).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(within(document.body).queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};
