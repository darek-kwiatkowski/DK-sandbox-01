import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";
import { MentorListRow } from "@devmentor/ui/components/mentors/MentorListRow";
import { PublicWorkLink } from "@devmentor/ui/components/mentors/PublicWorkLink";
import { StackTags } from "@devmentor/ui/components/mentors/StackTags";
import { StackFilter } from "@devmentor/ui/components/mentors/StackFilter";
import type { MentorSummary } from "@devmentor/ui/components/mentors/types";

const meta = { title: "Product/E02 Mentor offer and E03 Finding a mentor/Parts", parameters: { docs: { description: { component: "Real mentor building blocks. E02/E03 presentation proposals under approved Q2; brief R04/R08/R13/R14, N02 and references R01.1/R01.3/R01.5. Loading/errors belong to the containing list, not new visual variants of rows or tags. Frozen links reuse documentation-only data-preview-state styles." } } } } satisfies Meta;
export default meta;
type PartsArgs = { mentor?: MentorSummary; href?: string; title?: string; tags?: string[]; label?: string; selected?: string[]; resultCount?: number; onChange?: (selected: string[]) => void };
type Story = StoryObj<PartsArgs>;
const mentor: MentorSummary = { id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"], nextSlotAt: "2026-11-20T17:00:00Z", price25Minor: 12000, price50Minor: 22000 };

export const RowPlayground: Story = { args: { mentor, href: "/mentors/anna" }, render: (args) => <ul className="divide-y divide-border"><MentorListRow mentor={args.mentor as MentorSummary} href={args.href as string} timeZone="Europe/Warsaw" /></ul> };
export const RowPartial: Story = { render: () => <ul><MentorListRow mentor={{ ...mentor, stack: [], nextSlotAt: null, price25Minor: null, price50Minor: null }} href="/mentors/anna" /></ul> };
export const RowLong: Story = { render: () => <ul><MentorListRow mentor={{ ...mentor, name: "Aleksandra Długonazwiskowa-Wiśniewska", stack: ["TypeScript", "React", "Python", "AI agents"] }} href="/mentors/anna" /></ul> };
export const WorkLinkPlayground: Story = { args: { href: "https://example.com/anna", title: "Publiczne portfolio Anny" }, render: (args) => <PublicWorkLink href={args.href as string} title={args.title as string} /> };
export const WorkLinkLong: Story = { render: () => <PublicWorkLink href="https://example.com/anna" title="Opis wdrożenia aplikacji TypeScript i React wraz z przykładami konfiguracji" /> };
export const WorkLinkKeyboard: Story = { render: () => <PublicWorkLink href="https://example.com/anna" title="Portfolio Anny" />, play: async ({ canvasElement }) => { await userEvent.tab(); const link = within(canvasElement).getByRole("link"); await expect(link).toHaveFocus(); await expect(link).toHaveAttribute("target", "_blank"); await expect(link).toHaveAccessibleName(/otwiera się w nowej karcie/); } };
export const TagsPlayground: Story = { args: { tags: ["TypeScript", "React"], label: "Stack" }, render: (args) => <StackTags tags={args.tags as string[]} label={args.label as string} /> };
export const TagsEmpty: Story = { render: () => <StackTags tags={[]} /> };
export const TagsLong: Story = { render: () => <StackTags tags={["TypeScript", "React", "Python", "AI agents"]} /> };

function Filter({ loading = false }: Readonly<{ loading?: boolean }>) {
  const [selected, setSelected] = useState<string[]>([]);
  return <StackFilter tags={["TypeScript", "React", "Python", "AI agents"]} selected={selected} onChange={setSelected} resultCount={loading ? null : selected.length === 0 ? 1 : 0} />;
}
export const FilterPlayground: Story = { args: { tags: ["TypeScript", "React", "Python", "AI agents"], selected: ["React"], resultCount: 1, onChange: fn() }, render: (args) => <StackFilter tags={args.tags as string[]} selected={args.selected as string[]} resultCount={args.resultCount as number} onChange={args.onChange as (selected: string[]) => void} /> };
export const FilterLoading: Story = { render: () => <Filter loading /> };
export const FilterKeyboard: Story = { render: () => <Filter />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await userEvent.keyboard(" "); await expect(canvas.getByRole("checkbox", { name: "TypeScript" })).toBeChecked(); await userEvent.click(canvas.getByRole("button", { name: "Usuń filtr: TypeScript" })); await expect(canvas.getByRole("checkbox", { name: "TypeScript" })).not.toBeChecked(); } };
export const FrozenLinks: Story = { render: () => <div className="flex flex-col gap-between-groups">{["hover", "focus-visible", "active"].map((state) => <section key={state} data-frozen={state}><h2 className="text-base font-semibold">{state}</h2><PublicWorkLink href="https://example.com/anna" title="Portfolio Anny" /></section>)}</div>, play: async ({ canvasElement }) => { canvasElement.querySelectorAll<HTMLElement>("[data-frozen]").forEach((section) => { section.querySelector("a")?.setAttribute("data-preview-state", section.dataset.frozen ?? ""); }); } };
