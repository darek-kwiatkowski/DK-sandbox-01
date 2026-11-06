import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Avatar, AvatarFallback } from "@devmentor/ui/components/ui/avatar";
import { Badge } from "@devmentor/ui/components/ui/badge";
import { Button } from "@devmentor/ui/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@devmentor/ui/components/ui/table";

type Mentor = { name: string; initials: string; stack: string[]; next: string; price25: string };

/** Example data; prices are illustrative, PLN bounds are not decided yet (R29). */
const MENTORS: Mentor[] = [
  { name: "Anna Kowalska", initials: "AK", stack: ["TypeScript", "React"], next: "pt., 13 lis, 18:00 CET", price25: "180,00 zł" },
  { name: "Marek Zieliński", initials: "MZ", stack: ["Python"], next: "sob., 14 lis, 8:30 CET", price25: "150,00 zł" },
  { name: "Ewa Nowak", initials: "EN", stack: ["AI agents", "Python"], next: "wt., 17 lis, 20:00 CET", price25: "220,00 zł" },
];

const MentorTable = ({ rows = MENTORS, selected }: { rows?: Mentor[]; selected?: string }) => (
  <Table>
    <TableCaption className="sr-only">Mentorzy z najbliższym wolnym terminem</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Mentor</TableHead>
        <TableHead>Stack</TableHead>
        <TableHead>Najbliższy termin</TableHead>
        <TableHead className="text-right">25 minut</TableHead>
        <TableHead className="text-right">
          <span className="sr-only">Akcje</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((m) => (
        <TableRow key={m.name} data-state={m.name === selected ? "selected" : undefined}>
          <TableCell>
            <span className="flex items-center gap-in-group font-medium">
              <Avatar size="sm">
                <AvatarFallback>{m.initials}</AvatarFallback>
              </Avatar>
              {m.name}
            </span>
          </TableCell>
          <TableCell>
            <span className="flex gap-1">
              {m.stack.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </span>
          </TableCell>
          <TableCell className="font-semibold tabular-nums">{m.next}</TableCell>
          <TableCell className="text-right tabular-nums">{m.price25}</TableCell>
          <TableCell className="text-right">
            <Button asChild variant="link">
              <a href={`/m/${m.initials.toLowerCase()}`}>Zobacz profil</a>
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const meta = {
  title: "Primitives/Table",
  component: Table,
  render: () => <MentorTable />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Hover and selected rows; hover is a frozen preview of :hover. */
export const RowStates: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stan wiersza</TableHead>
          <TableHead>Mentor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Default</TableCell>
          <TableCell>Anna Kowalska</TableCell>
        </TableRow>
        <TableRow data-preview-state="hover">
          <TableCell>Hover</TableCell>
          <TableCell>Marek Zieliński</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>Selected</TableCell>
          <TableCell>Ewa Nowak</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const ManyRows: Story = {
  render: () => <MentorTable rows={Array.from({ length: 4 }, () => MENTORS).flat().map((m, i) => ({ ...m, name: `${m.name} ${i + 1}` }))} />,
};

export const LongTextNarrow: Story = {
  globals: { viewport: { value: "narrow" } },
  render: () => (
    <div className="w-80">
      <MentorTable rows={[{ ...MENTORS[0], name: "Katarzyna Wiśniewska-Grabowska", stack: ["TypeScript", "React", "AI agents"] }]} />
    </div>
  ),
};

export const HeadersNameTheCells: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table", { name: "Mentorzy z najbliższym wolnym terminem" });
    await expect(within(table).getAllByRole("columnheader")).toHaveLength(5);
    await expect(within(table).getAllByRole("row")).toHaveLength(4);
    await expect(canvas.getAllByRole("link", { name: "Zobacz profil" })).toHaveLength(3);
  },
};
