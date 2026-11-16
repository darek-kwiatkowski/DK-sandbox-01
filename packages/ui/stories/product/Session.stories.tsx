import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MessageComposer } from "@devmentor/ui/components/messages/MessageComposer";
import { SessionTranscript, type SessionMessage } from "@devmentor/ui/components/messages/SessionTranscript";
import { PrivateNote } from "@devmentor/ui/components/notes/PrivateNote";

const messages: SessionMessage[] = [
  { id: "1", author: "Anna Kowalska", sentAt: "2026-11-13T17:00:00Z", text: "Pokaż komunikat błędu TypeScript i opcje kompilatora." },
  { id: "2", author: "Mentee", sentAt: "2026-11-13T17:01:00Z", text: "Po aktualizacji zależności kompilator zgłasza konflikt typów. Sprawdziłem już wersje pakietów." },
];
const meta = {
  title: "Product/E04 Session and note (proposals)",
  parameters: { docs: { description: { component: "Proposed presentation states for E04-S01/S02. Sources: brief R03, R20, R26; references R02.2, R02.3, K4. Server/realtime delivery, note revision and approval contracts remain unspecified. No local story promises persistence." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
const retry = fn();
export const TranscriptReady: Story = { render: () => <SessionTranscript state={{ status: "ready", messages }} onRetry={retry} /> };
export const TranscriptLoading: Story = { render: () => <SessionTranscript state={{ status: "loading" }} onRetry={retry} /> };
export const TranscriptEmpty: Story = { render: () => <SessionTranscript state={{ status: "ready", messages: [] }} onRetry={retry} /> };
export const TranscriptError: Story = { render: () => <SessionTranscript state={{ status: "error", message: "Nie udało się wczytać rozmowy." }} onRetry={retry} />, play: async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getByRole("button", { name: "Spróbuj ponownie" }));
  await expect(retry).toHaveBeenCalledOnce();
} };
export const TranscriptPartial: Story = { render: () => <SessionTranscript state={{ status: "ready", messages, partial: true }} onRetry={retry} /> };
export const TranscriptLongAndMany: Story = { render: () => <SessionTranscript state={{ status: "ready", messages: Array.from({ length: 16 }, (_, index) => ({ ...messages[index % 2]!, id: String(index), text: `${messages[index % 2]!.text}\nKolejny krok: porównaj konfigurację projektu przed aktualizacją i po aktualizacji. ${"tsconfig/".repeat(20)}` })) }} onRetry={retry} /> };
export const ComposerSend: Story = {
  render: () => <MessageComposer onSend={async () => ({ ok: true, data: null })} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Wiadomość" });
    await userEvent.type(input, "Sprawdziłem konfigurację.");
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("status")).toHaveTextContent("Wiadomość wysłana.");
    await expect(input).toHaveValue("");
  },
};
export const ComposerWaiting: Story = { render: () => <MessageComposer onSend={() => new Promise(() => undefined)} />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.type(canvas.getByRole("textbox"), "Sprawdziłem konfigurację."); await userEvent.click(canvas.getByRole("button")); await expect(canvas.getByRole("button")).toBeDisabled(); } };
export const ComposerFailure: Story = { render: () => <MessageComposer onSend={async () => ({ ok: false, error: { code: "network_error", message: "Brak połączenia. Wiadomość nie została wysłana; spróbuj ponownie." } })} />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.type(canvas.getByRole("textbox"), "Zachowaj tę wiadomość."); await userEvent.keyboard("{Enter}"); await expect(canvas.getByRole("alert")).toBeInTheDocument(); await expect(canvas.getByRole("textbox")).toHaveValue("Zachowaj tę wiadomość."); } };
export const ComposerUnavailable: Story = { render: () => <MessageComposer disabledReason="Ta sesja jest zakończona. Rozmowa pozostaje do odczytu." onSend={async () => ({ ok: true, data: null })} /> };

const note = "Sprawdzić opcje module i moduleResolution w tsconfig. Porównać wersje zależności przed kolejną aktualizacją.";
const noteProps = { canApprove: true, onChange: fn(), onSave: fn(), onApprove: fn(), onRetry: fn() };
export const NoteReady: Story = { render: () => <PrivateNote {...noteProps} value={note} status="ready" />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz notatkę" }));
  await expect(noteProps.onSave).toHaveBeenCalledOnce();
  await userEvent.click(canvas.getByRole("button", { name: "Zatwierdź notatkę" }));
  await expect(noteProps.onApprove).toHaveBeenCalledOnce();
  await expect(canvas.queryByRole("status")).toBeNull();
} };
export const NoteEmpty: Story = { render: () => <PrivateNote {...noteProps} value="" status="ready" /> };
export const NoteLoading: Story = { render: () => <PrivateNote {...noteProps} value="" status="loading" /> };
export const NoteSaving: Story = { render: () => <PrivateNote {...noteProps} value={note} status="saving" /> };
export const NoteApproving: Story = { render: () => <PrivateNote {...noteProps} value={note} status="approving" /> };
export const NoteError: Story = { render: () => <PrivateNote {...noteProps} value={note} status="error" /> };
export const NoteConflict: Story = { render: () => <PrivateNote {...noteProps} value={note} status="conflict" /> };
export const NoteApproved: Story = { render: () => <PrivateNote {...noteProps} value={note} status="approved" /> };
export const NoteMentor: Story = { render: () => <PrivateNote {...noteProps} canApprove={false} value={note} status="ready" /> };
export const NoteLong: Story = { render: () => <PrivateNote {...noteProps} value={Array.from({ length: 20 }, () => note).join("\n")} status="ready" /> };
