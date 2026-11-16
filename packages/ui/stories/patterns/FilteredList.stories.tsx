import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";

import { DataTable } from "@devmentor/ui/backend/tables";
import { MentorList } from "@devmentor/ui/components/mentors/MentorList";
import { StackFilter } from "@devmentor/ui/components/mentors/StackFilter";
import { Button } from "@devmentor/ui/components/ui/button";
import type { MentorSummary } from "@devmentor/ui/components/mentors/types";

const mentors: MentorSummary[] = [{ id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"], nextSlotAt: null, price25Minor: 12000, price50Minor: 22000 }];
const meta = { title: "Patterns/Filtered list", component: MentorList, args: { state: { status: "ready", mentors }, hrefFor: (mentor: MentorSummary) => `/mentors/${mentor.id}` } } satisfies Meta<typeof MentorList>;
export default meta;
type Story = StoryObj<typeof meta>;

function FilterComposition({ noMatch = false }: Readonly<{ noMatch?: boolean }>) {
  const [selected, setSelected] = useState<string[]>(noMatch ? ["Python"] : ["TypeScript"]);
  const shown = mentors.filter((mentor) => selected.length === 0 || mentor.stack.some((tag) => selected.includes(tag)));
  return <div className="flex flex-col gap-section">
    <StackFilter tags={["TypeScript", "React", "Python", "AI agents"]} selected={selected} onChange={setSelected} resultCount={shown.length} />
    <MentorList state={{ status: "ready", mentors: shown }} hrefFor={(mentor) => `/mentors/${mentor.id}`} filtered={selected.length > 0} onClearFilters={() => setSelected([])} />
  </div>;
}

export const ActiveFiltersAndCount: Story = { render: () => <FilterComposition /> };
export const ClearNoMatchFilters: Story = {
  render: () => <FilterComposition noMatch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Wyniki: 0")).toBeVisible();
    await userEvent.click(canvas.getAllByRole("button", { name: "Wyczyść filtry" })[0]);
    await expect(canvas.getByText("Wyniki: 1")).toBeVisible();
    await expect(canvas.queryByRole("button", { name: "Usuń filtr: Python" })).not.toBeInTheDocument();
  },
};

export const Results: Story = { args: { state: { status: "ready", mentors }, hrefFor: (mentor) => `/mentors/${mentor.id}` } };
export const Loading: Story = { args: { state: { status: "loading" }, hrefFor: () => "/mentors" } };
export const RequestError: Story = { args: { state: { status: "error" }, hrefFor: () => "/mentors", onRetry: fn() } };
export const NoPublishedMentors: Story = { args: { state: { status: "ready", mentors: [] }, hrefFor: () => "/mentors" } };
export const NoMatchesForFilters: Story = { args: { state: { status: "ready", mentors: [] }, hrefFor: () => "/mentors", filtered: true, onClearFilters: fn() } };

export const EmptyListWithCreateAction: Story = {
  render: () => <DataTable columns={[{ id: "name", header: "Mentor", cell: (row: { name: string }) => row.name }]} rows={[]} getRowId={(row: { name: string }) => row.name} label="Zaproszeni mentorzy" emptyTitle="Nie zaproszono jeszcze mentorów." emptyDescription="Zaproś mentora, aby mógł utworzyć profil." emptyAction={<Button type="button">Zaproś mentora</Button>} />,
};

export const Pagination: Story = {
  render: () => <DataTable columns={[{ id: "name", header: "Mentor", cell: (row: { name: string }) => row.name }]} rows={Array.from({ length: 21 }, (_, index) => ({ name: `Mentor ${index + 1}` }))} getRowId={(row) => row.name} pageSize={20} label="Mentorzy" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Następna" }));
    await expect(canvas.getByText("Strona 2 z 2")).toBeInTheDocument();
    await expect(canvas.getByText("Mentor 21")).toBeInTheDocument();
  },
};

