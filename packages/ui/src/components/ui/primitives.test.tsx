// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";
import { Button } from "./button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Separator } from "./separator";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table";

afterEach(cleanup);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);

describe("Badge", () => {
  it("renders a span with the default variant", () => {
    render(<Badge>Nowy</Badge>);
    const badge = screen.getByText("Nowy");
    expect(badge.tagName).toBe("SPAN");
    expect(badge.dataset.slot).toBe("badge");
    expect(badge.dataset.variant).toBe("default");
    expect(badge.className).toContain("bg-primary");
  });

  it("applies the chosen variant and merges custom classes", () => {
    render(
      <Badge variant="destructive" className="ml-2">
        Błąd
      </Badge>,
    );
    const badge = screen.getByText("Błąd");
    expect(badge.dataset.variant).toBe("destructive");
    expect(badge.className).toContain("text-destructive");
    expect(badge.className).toContain("ml-2");
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Badge asChild variant="link">
        <a href="/mentors">Mentorzy</a>
      </Badge>,
    );
    const link = screen.getByRole("link", { name: "Mentorzy" });
    expect(link.dataset.slot).toBe("badge");
    expect(link.className).toContain("underline-offset-4");
  });
});

describe("Button", () => {
  it("renders a button with default variant and size", () => {
    render(<Button>Zapisz</Button>);
    const button = screen.getByRole("button", { name: "Zapisz" });
    expect(button.dataset.variant).toBe("default");
    expect(button.dataset.size).toBe("default");
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Button asChild variant="ghost" size="sm">
        <a href="/backend">Panel</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Panel" });
    expect(link.dataset.slot).toBe("button");
    expect(link.dataset.variant).toBe("ghost");
    expect(link.dataset.size).toBe("sm");
  });
});

describe("Card", () => {
  it("renders every card slot with its content", () => {
    render(
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Tytuł</CardTitle>
          <CardDescription>Opis</CardDescription>
          <CardAction>Akcja</CardAction>
        </CardHeader>
        <CardContent>Treść</CardContent>
        <CardFooter>Stopka</CardFooter>
      </Card>,
    );
    const card = slot("card") as HTMLElement;
    expect(card.dataset.size).toBe("default");
    expect(card.className).toContain("max-w-sm");
    for (const [name, text] of [
      ["card-title", "Tytuł"],
      ["card-description", "Opis"],
      ["card-action", "Akcja"],
      ["card-content", "Treść"],
      ["card-footer", "Stopka"],
    ]) {
      expect(slot(name)?.textContent).toBe(text);
    }
    expect(slot("card-header")).not.toBeNull();
  });

  it("supports the small size", () => {
    render(<Card size="sm">Mała</Card>);
    expect((slot("card") as HTMLElement).dataset.size).toBe("sm");
  });
});

describe("Input and Label", () => {
  it("associates a label with an input", () => {
    render(
      <>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" className="w-64" />
      </>,
    );
    const input = screen.getByLabelText("E-mail");
    expect(input.getAttribute("type")).toBe("email");
    expect(input.dataset.slot).toBe("input");
    expect(input.className).toContain("w-64");
    expect(slot("label")?.textContent).toBe("E-mail");
  });
});

describe("Separator", () => {
  it("is decorative and horizontal by default", () => {
    render(<Separator />);
    const separator = slot("separator") as HTMLElement;
    expect(separator.getAttribute("role")).toBe("none");
    expect(separator.dataset.orientation).toBe("horizontal");
  });

  it("can be a semantic vertical separator", () => {
    render(<Separator decorative={false} orientation="vertical" className="mx-2" />);
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator.className).toContain("mx-2");
  });
});

describe("Table", () => {
  it("renders all table parts in a scroll container", () => {
    render(
      <Table className="min-w-full">
        <TableCaption>Lista</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Imię</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Razem: 1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );
    const table = screen.getByRole("table", { name: "Lista" });
    expect(table.className).toContain("min-w-full");
    expect(table.parentElement?.dataset.slot).toBe("table-container");
    expect(screen.getByRole("columnheader", { name: "Imię" }).dataset.slot).toBe("table-head");
    expect(slot("table-footer")?.textContent).toBe("Razem: 1");
    expect(slot("table-caption")?.textContent).toBe("Lista");
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });
});
