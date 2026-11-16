import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppShell } from "@devmentor/ui/backend/layout";

import { MentorList } from "@devmentor/ui/components/mentors/MentorList";
import { MentorProfile } from "@devmentor/ui/components/mentors/MentorProfile";
import type { MentorProfileData, MentorSummary } from "@devmentor/ui/components/mentors/types";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";

import { SessionTranscript, type TranscriptState } from "@devmentor/ui/components/messages/SessionTranscript";
import { MessageComposer } from "@devmentor/ui/components/messages/MessageComposer";
import { PrivateNote, type PrivateNoteProps } from "@devmentor/ui/components/notes/PrivateNote";
import { ConnectStatus, type ConnectState } from "@devmentor/ui/components/payments/ConnectStatus";
import { PayoutList, type PayoutListState, type PayoutRecord } from "@devmentor/ui/components/payments/PayoutList";
const nav = [{ href: "/account", label: "Konto" }, { href: "/mentor", label: "Panel mentora" }];
const mentor: MentorProfileData = {
  id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"], nextSlotAt: "2026-11-13T17:00:00.000Z", price25Minor: 12000, price50Minor: 22000,
  description: "Pomagam rozwiązywać problemy z aplikacjami TypeScript i React.", publicWork: { href: "https://example.com/anna", title: "Publiczne portfolio Anny" },
};
const mentorSummary: MentorSummary = mentor;
const meta = { title: "Screens/Key backlog screens", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const E01AccountAndAccess: Story = {
  name: "E01 · Account",
  render: () => <AppShell items={nav} currentPath="/account"><div className="flex max-w-reading flex-col gap-between-groups"><h1 className="text-xl font-semibold">Konto</h1><p>Anna Kowalska</p><p>anna@example.test</p><div className="flex gap-in-group"><Badge>Mentee</Badge><Badge variant="outline">Mentor</Badge></div><Button variant="outline">Połącz konto GitHub</Button><p className="text-sm text-muted-foreground">Główny, zweryfikowany adres e-mail na GitHub musi być taki sam jak adres tego konta.</p></div></AppShell>,
};

export const E02MentorOffer: Story = {
  name: "E02 · Public mentor offer (proposal)",
  render: () => <main className="mx-auto max-w-page px-panel py-section"><MentorProfile mentor={mentor} /></main>,
};

export const E03FindMentor: Story = {
  name: "E03 · Find a mentor",
  render: () => <AppShell items={nav} currentPath="/mentors"><div className="flex flex-col gap-section"><h1 className="text-xl font-semibold">Znajdź mentora</h1><p className="max-w-reading text-muted-foreground">Wybierz stack, aby zawęzić listę mentorów. Lista jest uporządkowana według najbliższego terminu.</p><MentorList state={{ status: "ready", mentors: [mentorSummary] }} hrefFor={(item) => `/mentors/${item.id}`} /></div></AppShell>,
};

const noop = () => undefined;
const staticProposal = {
  docs: { description: { story: "Static presentation proposal composed from package exports. Retry, note editing/approval and Connect callbacks are no-ops; message sending simulates a confirmed response. No persistence, provider redirect or realtime contract is implemented. Sources: brief R03, R20, R26, R05, R28, R35; approved Q2/H4." } },
};
const sessionMessages = [{ id: "1", author: "Anna Kowalska", sentAt: "2026-11-13T17:00:00Z", text: "Pokaż komunikat błędu TypeScript i opcje kompilatora." }];
const sessionNote = "Sprawdzić konfigurację tsconfig po aktualizacji zależności.";

/** Screen composition only; these fixtures deliberately do not implement an E04 controller. */
function SessionScreen({ transcript, noteStatus, noteValue = sessionNote, disabledReason }: Readonly<{
  transcript: TranscriptState;
  noteStatus: PrivateNoteProps["status"];
  noteValue?: string;
  disabledReason?: string;
}>) {
  return (
    <AppShell items={nav} currentPath="/sessions/current">
      <div className="grid gap-section md:grid-cols-2">
        <section className="flex min-w-0 flex-col gap-between-groups">
          <h1 className="text-xl font-semibold">Sesja tekstowa z Anną Kowalską</h1>
          <p className="text-sm text-muted-foreground">Sesja tekstowa · 25 minut</p>
          <SessionTranscript state={transcript} onRetry={noop} />
          <MessageComposer disabledReason={disabledReason} onSend={async () => ({ ok: true, data: null })} />
        </section>
        <section className="min-w-0">
          <h2 className="text-base font-semibold">Prywatna notatka</h2>
          <PrivateNote value={noteValue} status={noteStatus} canApprove onChange={noop} onSave={noop} onApprove={noop} onRetry={noop} />
        </section>
      </div>
    </AppShell>
  );
}

export const E04TextSessionAndNote: Story = {
  name: "E04 · Text session and private note (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "ready", messages: sessionMessages }} noteStatus="ready" />,
};
export const E04Loading: Story = {
  name: "E04 · Loading session and note (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "loading" }} noteStatus="loading" disabledReason="Wczytujemy sesję. Wysyłanie będzie dostępne po wczytaniu danych." />,
};
export const E04Error: Story = {
  name: "E04 · Session and note request errors (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "error", message: "Nie udało się wczytać rozmowy. Spróbuj ponownie." }} noteStatus="error" disabledReason="Nie udało się wczytać sesji. Spróbuj ponownie przed wysłaniem wiadomości." />,
};
export const E04Empty: Story = {
  name: "E04 · Empty conversation and note (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "ready", messages: [] }} noteStatus="ready" noteValue="" />,
};
export const E04PartialAndConflict: Story = {
  name: "E04 · Partial conversation and note conflict (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "ready", messages: sessionMessages, partial: true }} noteStatus="conflict" />,
};
export const E04ApprovedNote: Story = {
  name: "E04 · Server-confirmed approved note (proposal)",
  parameters: staticProposal,
  render: () => <SessionScreen transcript={{ status: "ready", messages: sessionMessages }} noteStatus="approved" />,
};

const payout: PayoutRecord = {
  id: "session-1", session: "Sesja tekstowa z Anną Kowalską", grossMinor: 22000, feeMinor: null, netMinor: null,
  status: "pending", explanation: "Rozliczenie oczekuje na potwierdzenie realizacji i warunków wypłaty.", canHold: false,
};

/** Static E05 composition; the application's payment adapter owns these states. */
function PayoutScreen({ connect, payouts }: Readonly<{ connect: ConnectState; payouts: PayoutListState }>) {
  return (
    <AppShell items={nav} currentPath="/mentor/payouts">
      <div className="flex flex-col gap-section">
        <h1 className="text-xl font-semibold">Wypłaty</h1>
        <ConnectStatus state={connect} onContinue={noop} onRetry={noop} />
        <PayoutList state={payouts} onRetry={noop} />
      </div>
    </AppShell>
  );
}

export const E05PayoutSetup: Story = {
  name: "E05 · Mentor payout setup (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "incomplete", starting: false, error: null }} payouts={{ status: "ready", rows: [payout] }} />,
};
export const E05Loading: Story = {
  name: "E05 · Loading setup and settlements (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "loading" }} payouts={{ status: "loading" }} />,
};
export const E05Error: Story = {
  name: "E05 · Setup and settlement request errors (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "error", message: "Nie udało się wczytać konfiguracji wypłat." }} payouts={{ status: "error", message: "Nie udało się wczytać rozliczeń sesji." }} />,
};
export const E05Empty: Story = {
  name: "E05 · Ready account without settlements (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "ready" }} payouts={{ status: "ready", rows: [] }} />,
};
export const E05PartialAmounts: Story = {
  name: "E05 · Settlement with partial amounts (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "ready" }} payouts={{ status: "ready", rows: [payout] }} />,
};
export const E05HeldPayout: Story = {
  name: "E05 · Server-confirmed held payout (proposal)",
  parameters: staticProposal,
  render: () => <PayoutScreen connect={{ status: "ready" }} payouts={{ status: "ready", rows: [{ ...payout, status: "held", explanation: "Operator wstrzymał wypłatę do wyjaśnienia realizacji sesji." }] }} />,
};
