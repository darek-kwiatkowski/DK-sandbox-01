import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { AccessDenied, ErrorMessage, LoadingMessage } from "@devmentor/ui/backend/feedback";
import { MentorProfile } from "@devmentor/ui/components/mentors/MentorProfile";
import type { MentorProfileData } from "@devmentor/ui/components/mentors/types";
import { Button } from "@devmentor/ui/components/ui/button";

const chooseSlot = fn();
const retry = fn();
const mentor: MentorProfileData = {
  id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"],
  nextSlotAt: "2026-11-13T17:00:00.000Z", price25Minor: 12000, price50Minor: 22000,
  description: "Pomagam rozwiązywać problemy z aplikacjami TypeScript i React.\nPracuję z zespołami produktowymi.",
  publicWork: { href: "https://example.test/anna", title: "Publiczne portfolio Anny" },
};

const meta = {
  title: "Patterns/Detail view",
  component: MentorProfile,
  args: {
    mentor,
    children: <Button type="button" onClick={chooseSlot}>Wybierz termin</Button>,
  },
  parameters: {
    docs: { description: { component: "Proposal pending E02/E03 screen specifications. Compose the real MentorProfile with its booking entry action; do not invent a slot picker or checkout contract. Sources: backlog E02-S01/E03-S01; brief R04 (public work), R08 (25/50-minute prices), R13 (stack and availability), N02 (no ratings); WCAG 1.3.1 and 2.4.4. The action callback is a test spy, not a completed booking." } },
  },
} satisfies Meta<typeof MentorProfile>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Anna Kowalska", level: 1 })).toBeVisible();
    const action = canvas.getByRole("button", { name: "Wybierz termin" });
    action.focus();
    await userEvent.keyboard("{Enter}");
    await expect(chooseSlot).toHaveBeenCalledOnce();
  },
};

export const Loading: Story = {
  render: () => <LoadingMessage label="Wczytywanie profilu mentora…" />,
};

export const RequestError: Story = {
  render: () => <ErrorMessage message="Nie udało się wczytać profilu mentora. Spróbuj ponownie." onRetry={retry} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Spróbuj ponownie" }));
    await expect(retry).toHaveBeenCalledOnce();
  },
};

export const MissingOrAccessDenied: Story = {
  render: () => <AccessDenied description="Profil nie istnieje albo nie masz do niego dostępu." action={<Button asChild variant="outline"><a href="/mentors">Wróć do mentorów</a></Button>} />,
  parameters: { docs: { description: { story: "Proposal: use one non-disclosing recovery state for an unavailable record. Sources: task stage 3, detail-view requirement; platform primitives P3. The page/server determines access; this presentation performs no authorization." } } },
};

export const Partial: Story = {
  args: { mentor: { ...mentor, publicWork: null, price25Minor: null, price50Minor: null, nextSlotAt: null }, children: undefined },
  parameters: { docs: { description: { story: "Unconfigured prices remain an em dash and absent public work is omitted by MentorProfile. No booking action is supplied because this fixture has no published availability. Proposal pending publication rules in E02/E03; do not fabricate a price, rating or slot (R08, R13, N02)." } } },
};

export const LongContent: Story = {
  args: { mentor: { ...mentor, name: "Aleksandra Długonazwiskowa-Wiśniewska", stack: ["TypeScript", "React", "Python", "AI agents"], description: `${mentor.description}\n\nPomagam zdiagnozować błędy typowania i uporządkować integrację aplikacji z API. Na sesję przygotuj krótki opis problemu i fragment kodu, który możemy wspólnie przeanalizować.`, publicWork: { href: "https://example.test/aleksandra", title: "Konfiguracja TypeScript i przykłady integracji w aplikacjach produktowych" } } },
};
