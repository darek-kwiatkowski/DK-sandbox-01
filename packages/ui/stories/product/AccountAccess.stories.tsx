import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { AccessDenied } from "@devmentor/ui/backend/feedback";
import { AuthMessage } from "@devmentor/ui/components/auth/AuthMessage";
import { GitHubButton } from "@devmentor/ui/components/auth/GitHubButton";
import { SignOutButton } from "@devmentor/ui/components/auth/SignOutButton";
import { AppShell } from "@devmentor/ui/backend/layout";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";
import { CrudForm } from "@devmentor/ui/backend/forms";
import { z } from "zod";

const meta = { title: "Product/E01 Accounts and access", component: AccessDenied } satisfies Meta<typeof AccessDenied>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AccessDeniedMentee: Story = {};

export const LoginChoices: Story = {
  render: () => (
    <section className="mx-auto flex max-w-reading flex-col gap-between-groups">
      <h1 className="text-xl font-semibold">Zaloguj się</h1>
      <GitHubButton href="/api/auth/github/start">Zaloguj się przez GitHub</GitHubButton>
      <p className="text-center text-sm text-muted-foreground">lub</p>
      <CrudForm
        schema={z.object({ email: z.email("Podaj prawidłowy adres e-mail."), password: z.string().min(1, "Podaj hasło.") })}
        fields={[{ name: "email", label: "E-mail", type: "email", autoComplete: "email" }, { name: "password", label: "Hasło", type: "password", autoComplete: "current-password" }]}
        submitLabel="Zaloguj się"
        submitVariant="outline"
        onSubmit={async () => ({ ok: true, data: null })}
      />
      <a className="text-sm underline" href="/register">Nie masz konta? Załóż konto</a>
    </section>
  ),
};

export const LoginError: Story = {
  render: () => (
    <section className="mx-auto flex max-w-reading flex-col gap-between-groups">
      <h1 className="text-xl font-semibold">Zaloguj się</h1>
      <AuthMessage error="github_failed" />
      <GitHubButton href="/api/auth/github/start">Zaloguj się przez GitHub</GitHubButton>
    </section>
  ),
};

export const AccountAndRoleNavigation: Story = {
  render: () => (
    <AppShell items={[{ href: "/account", label: "Konto" }, { href: "/mentor", label: "Panel mentora" }]} currentPath="/account" actions={<SignOutButton />}>
      <div className="flex flex-col gap-between-groups">
        <h1 className="text-xl font-semibold">Konto</h1>
        <p>Anna Kowalska</p>
        <p>anna@example.test</p>
        <div className="flex gap-in-group"><Badge>Mentee</Badge><Badge variant="outline">Mentor</Badge></div>
        <Button variant="outline">Połącz konto GitHub</Button>
        <p className="max-w-reading text-sm text-muted-foreground">Główny, zweryfikowany adres e-mail na GitHub musi być taki sam jak adres tego konta.</p>
      </div>
    </AppShell>
  ),
};

export const SkipLinkAndAccountAction: Story = {
  render: () => <AppShell items={[{ href: "/account", label: "Konto" }]} currentPath="/account" actions={<SignOutButton />}><h1 className="text-xl font-semibold">Konto</h1></AppShell>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Przejdź do treści" })).toHaveFocus();
  },
};

