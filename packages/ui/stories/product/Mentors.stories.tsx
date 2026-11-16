import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";

import { MentorList } from "@devmentor/ui/components/mentors/MentorList";
import { MentorProfile } from "@devmentor/ui/components/mentors/MentorProfile";
import { StackFilter } from "@devmentor/ui/components/mentors/StackFilter";
import type { MentorProfileData, MentorSummary } from "@devmentor/ui/components/mentors/types";

const mentors: MentorSummary[] = [
  { id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"], nextSlotAt: "2026-11-13T17:00:00.000Z", price25Minor: 12000, price50Minor: 22000 },
  { id: "piotr", name: "Piotr Nowak", stack: ["Python"], nextSlotAt: null, price25Minor: null, price50Minor: 30000 },
];

const profile: MentorProfileData = {
  ...mentors[0]!,
  description: "Pomagam rozwiązywać problemy z aplikacjami TypeScript i React.\nPracuję z zespołami produktowymi.",
  publicWork: { href: "https://example.com/anna", title: "Publiczne portfolio Anny" },
};

const meta = { title: "Product/E02 Mentor offer and E03 Finding a mentor", component: MentorList, args: { state: { status: "ready", mentors }, hrefFor: (mentor: MentorSummary) => `/mentors/${mentor.id}` } } satisfies Meta<typeof MentorList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MentorListReady: Story = { args: { state: { status: "ready", mentors } } };
export const MentorListLoading: Story = { args: { state: { status: "loading" } } };
export const MentorListError: Story = { args: { state: { status: "error", message: "Nie udało się wczytać mentorów." }, onRetry: fn() } };
export const MentorListEmpty: Story = { args: { state: { status: "ready", mentors: [] } } };
export const MentorListNoFilterMatches: Story = { args: { state: { status: "ready", mentors: [] }, filtered: true, onClearFilters: fn() } };
export const MentorListLongNamesAndManyTags: Story = {
  args: { state: { status: "ready", mentors: [{ ...mentors[0]!, name: "Aleksandra Długonazwiskowa-Wiśniewska", stack: ["TypeScript", "React", "AI agents", "Python"], price25Minor: null }] } },
};

function FilteredList() {
  const [selected, setSelected] = useState<string[]>(["TypeScript"]);
  const shown = mentors.filter((mentor) => selected.length === 0 || mentor.stack.some((tag) => selected.includes(tag)));
  return (
    <div className="flex flex-col gap-section">
      <StackFilter tags={["TypeScript", "React", "Python", "AI agents"]} selected={selected} onChange={setSelected} resultCount={shown.length} />
      <MentorList state={{ status: "ready", mentors: shown }} hrefFor={(mentor) => `/mentors/${mentor.id}`} filtered={selected.length > 0} onClearFilters={() => setSelected([])} />
    </div>
  );
}

export const StackFilteredList: Story = { render: () => <FilteredList /> };
export const FilterKeyboardAndClear: Story = {
  render: () => <FilteredList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Usuń filtr: TypeScript" }));
    await expect(canvas.getByText("Wyniki: 2")).toBeInTheDocument();
    const react = canvas.getByRole("checkbox", { name: "React" });
    await userEvent.click(react);
    await expect(react).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Wyczyść filtry" }));
    await expect(canvas.getByRole("checkbox", { name: "React" })).not.toBeChecked();
  },
};

export const PublicMentorProfile: Story = { render: () => <MentorProfile mentor={profile} /> };
export const MentorProfileLongDescription: Story = {
  render: () => <MentorProfile mentor={{ ...profile, name: "Aleksandra Długonazwiskowa-Wiśniewska", description: `${profile.description}\n\nPrzykłady pracy i stos technologiczny są widoczne przed wyborem terminu.` }} />,
};

