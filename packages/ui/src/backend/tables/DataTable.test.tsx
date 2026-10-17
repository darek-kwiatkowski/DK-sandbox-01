// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

type Row = { id: string; name: string };
const columns: DataTableColumn<Row>[] = [{ id: "name", header: "Imię", cell: (row) => row.name }];
const rows: Row[] = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Grace" },
  { id: "3", name: "Linus" },
];

afterEach(cleanup);

describe("DataTable", () => {
  it("shows the shared loading, error and empty states", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<DataTable label="Lista" columns={columns} getRowId={(r) => r.id} isLoading />);
    expect(screen.getByRole("status").textContent).toBe("Ładowanie…");

    rerender(<DataTable label="Lista" columns={columns} getRowId={(r) => r.id} error="Błąd serwera" onRetry={onRetry} />);
    expect(screen.getByRole("alert").textContent).toContain("Błąd serwera");
    await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(<DataTable label="Lista" columns={columns} getRowId={(r) => r.id} rows={[]} emptyTitle="Brak użytkowników." />);
    expect(screen.getByText("Brak użytkowników.")).toBeDefined();
  });

  it("renders rows with row actions and paginates", async () => {
    render(
      <DataTable
        label="Lista"
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        pageSize={2}
        rowActions={(row) => <button type="button">Edytuj {row.name}</button>}
      />,
    );
    const table = screen.getByRole("table", { name: "Lista" });
    expect(within(table).getAllByRole("row")).toHaveLength(3); // header + 2 rows
    expect(within(table).getByRole("button", { name: "Edytuj Ada" })).toBeDefined();
    expect(screen.getByText("Strona 1 z 2")).toBeDefined();

    await userEvent.click(screen.getByRole("button", { name: "Następna" }));

    expect(within(table).getByText("Linus")).toBeDefined();
    expect(within(table).queryByText("Ada")).toBeNull();
    expect((screen.getByRole("button", { name: "Następna" }) as HTMLButtonElement).disabled).toBe(true);
  });
});
