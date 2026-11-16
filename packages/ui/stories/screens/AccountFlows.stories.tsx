import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
import { z } from "zod";

import { AppShell } from "@devmentor/ui/backend/layout";
import { AccessDenied } from "@devmentor/ui/backend/feedback";
import { CrudForm } from "@devmentor/ui/backend/forms";
import { DataTable } from "@devmentor/ui/backend/tables";
import { AuthMessage } from "@devmentor/ui/components/auth/AuthMessage";
import { GitHubButton } from "@devmentor/ui/components/auth/GitHubButton";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";

const meta = {
  title: "Screens/E01 Account flows",
  parameters: { layout: "fullscreen", docs: { description: { component: "E01-S01 UI/UX and API contracts define registration, linking and role gates. Invitation layouts and their local response fixtures are proposals under approved Q2: E01-S02 has no detailed screen/API specification. No fixture creates an account, grants a role, sends an invitation or navigates to a real provider. GitHub links retain the real navigation contract but must not be followed in this sandbox." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const registrationSchema = z.object({
  name: z.string().trim().min(1, "Podaj imię i nazwisko.").max(100, "Wpisz najwyżej 100 znaków."),
  email: z.email("Podaj prawidłowy adres e-mail."),
  password: z.string().min(12, "Hasło musi mieć co najmniej 12 znaków.").refine((value) => new TextEncoder().encode(value).length <= 72, "Hasło może mieć najwyżej 72 bajty UTF-8."),
});
type RegistrationOutcome = "ready" | "waiting" | "duplicate" | "server" | "network" | "success";
function Registration({ outcome, github = true }: Readonly<{ outcome: RegistrationOutcome; github?: boolean }>) {
  const [confirmed, setConfirmed] = useState(false);
  return <main className="mx-auto flex max-w-reading flex-col gap-between-groups px-panel py-section">
    <h1 className="text-xl font-semibold">Załóż konto</h1>
    {github ? <><GitHubButton href="/api/auth/github/start" /><p className="text-center text-sm text-muted-foreground">lub</p></> : <AuthMessage error="github_unavailable" />}
    {confirmed ? <p role="status">Konto utworzone. W aplikacji przejdziesz teraz do konta.</p> : <CrudForm
      schema={registrationSchema}
      fields={[{ name: "name", label: "Imię i nazwisko", autoComplete: "name" }, { name: "email", label: "E-mail", type: "email", autoComplete: "email" }, { name: "password", label: "Hasło", type: "password", autoComplete: "new-password", description: "Co najmniej 12 znaków. Najwyżej 72 bajty UTF-8." }]}
      defaultValues={outcome === "ready" ? {} : { name: "Anna Kowalska", email: "anna@example.test", password: "bezpieczne-haslo-demo" }}
      submitLabel="Załóż konto" submitVariant={github ? "outline" : "default"}
      onSubmit={async () => {
        if (outcome === "waiting") return new Promise(() => undefined);
        if (outcome === "duplicate") return { ok: false, error: { code: "conflict", message: "Konto z tym adresem już istnieje. Zaloguj się.", fieldErrors: { email: ["Konto z tym adresem już istnieje. Zaloguj się."] } } };
        if (outcome === "server" || outcome === "network") return { ok: false, error: { code: outcome, message: outcome === "network" ? "Brak połączenia. Sprawdź połączenie i spróbuj ponownie." : "Coś poszło nie tak. Spróbuj ponownie." } };
        return { ok: true, data: null };
      }} onSuccess={() => setConfirmed(true)} />}
    <Button asChild variant="link"><a href="/login">Masz konto? Zaloguj się</a></Button>
  </main>;
}
const submitRegistration = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Załóż konto" }));
};
export const RegistrationEmpty: Story = { render: () => <Registration outcome="ready" /> };
export const RegistrationValidation: Story = {
  render: () => <Registration outcome="ready" />,
  play: async (context) => { await submitRegistration(context); const canvas = within(context.canvasElement); await expect(canvas.getByLabelText("Imię i nazwisko")).toHaveFocus(); await expect(canvas.getByText("Podaj imię i nazwisko.")).toBeVisible(); },
};
export const RegistrationWaiting: Story = { render: () => <Registration outcome="waiting" />, play: async (context) => { await submitRegistration(context); await expect(within(context.canvasElement).getByRole("button", { name: "Zapisywanie…" })).toBeDisabled(); } };
export const RegistrationDuplicateEmail: Story = { render: () => <Registration outcome="duplicate" />, play: async (context) => { await submitRegistration(context); const canvas = within(context.canvasElement); await waitFor(() => expect(canvas.getByLabelText("E-mail")).toHaveFocus()); await expect(canvas.getByLabelText("E-mail")).toHaveValue("anna@example.test"); } };
export const RegistrationServerError: Story = { render: () => <Registration outcome="server" />, play: submitRegistration };
export const RegistrationNetworkError: Story = { render: () => <Registration outcome="network" />, play: submitRegistration };
export const RegistrationConfirmed: Story = { render: () => <Registration outcome="success" />, play: async (context) => { await submitRegistration(context); await expect(await within(context.canvasElement).findByRole("status")).toHaveTextContent("Konto utworzone"); } };
export const RegistrationWithoutGithub: Story = { render: () => <Registration outcome="ready" github={false} /> };

function Account({ error, notice, linked = false }: Readonly<{ error?: string; notice?: string; linked?: boolean }>) {
  return <AppShell items={[{ href: "/account", label: "Konto" }]} currentPath="/account"><div className="flex max-w-reading flex-col gap-between-groups">
    <h1 className="text-xl font-semibold">Konto</h1><AuthMessage error={error} notice={notice} /><p>Anna Kowalska · anna@example.test</p><Badge>Mentee</Badge>
    {linked ? <p>Połączono z GitHub: @anna-demo</p> : <><GitHubButton href="/api/auth/github/start?intent=link" variant="outline">Połącz konto GitHub</GitHubButton><p className="text-sm text-muted-foreground">Główny, zweryfikowany adres e-mail na GitHub musi być taki sam jak adres tego konta.</p></>}
  </div></AppShell>;
}
export const AccountGithubLinked: Story = { render: () => <Account linked /> };
export const AccountGithubTakeoverNotice: Story = { render: () => <Account linked notice="github_linked" /> };
export const AccountGithubEmailMismatch: Story = { render: () => <Account error="github_email_mismatch" /> };
export const AccountGithubAlreadyLinked: Story = { render: () => <Account error="github_already_linked" /> };
export const AccountGithubMissingVerifiedEmail: Story = { render: () => <Account error="github_no_verified_email" /> };
export const AccountGithubExpiredState: Story = { render: () => <Account error="github_state" /> };
export const AccountGithubProviderFailure: Story = { render: () => <Account error="github_failed" /> };
export const AccountGithubDenied: Story = { render: () => <Account error="github_denied" /> };
export const MentorRolePanel: Story = { render: () => <AppShell items={[{ href: "/account", label: "Konto" }, { href: "/mentor", label: "Panel mentora" }]} currentPath="/mentor"><h1 className="text-xl font-semibold">Panel mentora</h1><p>Tu pojawią się Twój profil, ceny i terminy.</p></AppShell> };
export const OperatorRolePanel: Story = { render: () => <AppShell items={[{ href: "/account", label: "Konto" }, { href: "/backend", label: "Panel operatora" }]} currentPath="/backend"><h1 className="text-xl font-semibold">Panel operatora</h1><p>Zaproszenia, limity cen i prowizja.</p></AppShell> };
export const MentorAccessDenied: Story = { render: () => <main className="mx-auto max-w-page px-panel"><AccessDenied description="Mentorzy dołączają tylko z zaproszenia." action={<Button asChild variant="link"><a href="/account">Wróć do konta</a></Button>} /></main> };

const invitationProposal = { docs: { description: { story: "Proposal: R07/R24/R35 and backlog E01-S02. An invitation is redeemed by a single-use link (E01-S01 Q7), never by email match. Sample list/create/redeem layouts do not decide delivery, expiry or resend/revoke API semantics. G5 approved action labels. Local form confirmation is a simulated response, not a sent invitation or granted mentor role." } } };
function InvitationList({ state }: Readonly<{ state: "ready" | "loading" | "error" | "empty" }>) {
  return <AppShell items={[{ href: "/backend/invitations", label: "Zaproszenia" }]} currentPath="/backend/invitations"><div className="flex flex-col gap-between-groups"><h1 className="text-xl font-semibold">Zaproszenia mentorów</h1><p>Mentorzy dołączają wyłącznie z zaproszenia. Zaproszenia wysyłamy partiami po 20.</p>
    <DataTable label="Zaproszenia mentorów" getRowId={(row) => row.id} columns={[{ id: "name", header: "Mentor", cell: (row: { id: string; name: string }) => row.name }]}
      rows={state === "empty" ? [] : [{ id: "invite-demo", name: "Anna Kowalska" }]} isLoading={state === "loading"} error={state === "error" ? "Nie udało się wczytać zaproszeń. Odśwież stronę i spróbuj ponownie." : null}
      emptyTitle="Nie ma jeszcze zaproszeń." emptyDescription="Utwórz zaproszenie dla mentora." emptyAction={<Button asChild><a href="#create-invitation">Utwórz zaproszenie</a></Button>} />
    <section id="create-invitation" className="max-w-reading"><h2 className="text-base font-semibold">Utwórz zaproszenie</h2><p className="text-sm text-muted-foreground">Podgląd formularza tworzenia znajduje się w osobnej story InvitationCreate.</p></section>
  </div></AppShell>;
}
export const InvitationsReady: Story = { parameters: invitationProposal, render: () => <InvitationList state="ready" /> };
export const InvitationsLoading: Story = { parameters: invitationProposal, render: () => <InvitationList state="loading" /> };
export const InvitationsError: Story = { parameters: invitationProposal, render: () => <InvitationList state="error" /> };
export const InvitationsEmpty: Story = { parameters: invitationProposal, render: () => <InvitationList state="empty" /> };
function InvitationCreateForm() {
  const [created, setCreated] = useState(false);
  return <main className="mx-auto flex max-w-reading flex-col gap-between-groups px-panel py-section"><h1 className="text-xl font-semibold">Utwórz zaproszenie</h1><p>Mentorzy dołączają tylko z zaproszenia.</p>{created ? <p role="status">Zaproszenie utworzone — symulowana odpowiedź. Żadna wiadomość nie została wysłana.</p> : <CrudForm schema={z.object({ name: z.string().min(1, "Podaj imię i nazwisko.") })} fields={[{ name: "name", label: "Imię i nazwisko mentora" }]} submitLabel="Utwórz zaproszenie" onSubmit={async () => ({ ok: true, data: null })} onSuccess={() => setCreated(true)} />}</main>;
}
export const InvitationCreate: Story = { parameters: invitationProposal, render: () => <InvitationCreateForm />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.type(canvas.getByLabelText("Imię i nazwisko mentora"), "Anna Kowalska"); await userEvent.click(canvas.getByRole("button", { name: "Utwórz zaproszenie" })); await expect(await canvas.findByRole("status")).toHaveTextContent("symulowana odpowiedź"); } };
export const InvitationRedeemSignIn: Story = { parameters: invitationProposal, render: () => <main className="mx-auto flex max-w-reading flex-col gap-between-groups px-panel py-section"><h1 className="text-xl font-semibold">Zaproszenie do grona mentorów</h1><p>Zaloguj się, aby przyjąć zaproszenie. Sam adres e-mail nie nadaje uprawnień mentora.</p><GitHubButton href="/api/auth/github/start" /><Button asChild variant="link"><a href="/login">Zaloguj się adresem e-mail</a></Button></main> };
export const InvitationRedeemUnavailable: Story = { parameters: invitationProposal, render: () => <main className="mx-auto max-w-reading px-panel py-section"><AccessDenied description="Nie można przyjąć tego zaproszenia. Poproś operatora o sprawdzenie linku." /></main> };
export const InvitationRedeemConfirmed: Story = { parameters: invitationProposal, render: () => <main className="mx-auto flex max-w-reading flex-col gap-between-groups px-panel py-section"><h1 className="text-xl font-semibold">Zaproszenie przyjęte</h1><p role="status">Przykład po potwierdzeniu nadania roli przez serwer.</p><Button asChild><a href="/mentor">Przejdź do panelu mentora</a></Button></main> };
