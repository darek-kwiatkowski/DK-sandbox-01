// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { DataTable, type DataTableColumn } from ".";

type Row = { id: string; name: string };
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Imię", cell: (row) => row.name, className: "w-1/2" },
];
const makeRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({ id: String(index + 1), name: `Osoba ${index + 1}` }));

afterEach(cleanup);

describe("DataTable edge cases", () => {
  it("falls back to the default empty title without rows", () => {
    render(<DataTable label="Lista" columns={columns} getRowId={(r) => r.id} emptyDescription="Dodaj kogoś." />);

    expect(screen.getByText("Brak danych.")).toBeDefined();
    expect(screen.getByText("Dodaj kogoś.")).toBeDefined();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders without a pagination bar or actions column for one page, applying column classes", () => {
    render(<DataTable label="Lista" columns={columns} rows={makeRows(2)} getRowId={(r) => r.id} />);

    const table = screen.getByRole("table", { name: "Lista" });
    expect(within(table).queryByRole("columnheader", { name: "Akcje" })).toBeNull();
    expect(within(table).getByRole("columnheader", { name: "Imię" }).className).toContain("w-1/2");
    expect(within(table).getByRole("cell", { name: "Osoba 1" }).className).toContain("w-1/2");
    expect(screen.queryByRole("navigation", { name: "Paginacja" })).toBeNull();
  });

  it("uses 20 rows per page by default and navigates back with Poprzednia", async () => {
    render(<DataTable label="Lista" columns={columns} rows={makeRows(21)} getRowId={(r) => r.id} />);
    const table = screen.getByRole("table", { name: "Lista" });
    const previous = screen.getByRole("button", { name: "Poprzednia" }) as HTMLButtonElement;
    expect(within(table).getAllByRole("row")).toHaveLength(21); // header + 20
    expect(previous.disabled).toBe(true);

    await userEvent.click(screen.getByRole("button", { name: "Następna" }));
    expect(within(table).getByText("Osoba 21")).toBeDefined();
    expect(previous.disabled).toBe(false);

    await userEvent.click(previous);
    expect(within(table).getByText("Osoba 1")).toBeDefined();
    expect(screen.getByText("Strona 1 z 2")).toBeDefined();
  });

  it("clamps to the last page when rows shrink", async () => {
    const { rerender } = render(<DataTable label="Lista" columns={columns} rows={makeRows(5)} getRowId={(r) => r.id} pageSize={2} />);
    await userEvent.click(screen.getByRole("button", { name: "Następna" }));
    await userEvent.click(screen.getByRole("button", { name: "Następna" }));
    expect(screen.getByText("Strona 3 z 3")).toBeDefined();

    rerender(<DataTable label="Lista" columns={columns} rows={makeRows(3)} getRowId={(r) => r.id} pageSize={2} />);

    expect(screen.getByText("Strona 2 z 2")).toBeDefined();
    expect(screen.getByText("Osoba 3")).toBeDefined();
  });

  it("shows an error without a retry button when onRetry is missing", () => {
    render(<DataTable label="Lista" columns={columns} getRowId={(r) => r.id} error="Błąd" />);

    expect(screen.getByRole("alert").textContent).toBe("Błąd");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
