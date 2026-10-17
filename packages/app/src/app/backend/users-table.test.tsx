// @vitest-environment jsdom
import type { ApiResourceState } from "@devmentor/ui/backend/api";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UsersTable } from "./users-table";

type UserRow = { id: string; email: string; name: string; createdAt: string };

const resource = vi.hoisted(() => ({
  state: { status: "loading" } as ApiResourceState<UserRow[]>,
  reload: vi.fn(),
  path: "",
}));

vi.mock("@devmentor/ui/backend/api", () => ({
  useApiResource: (path: string) => {
    resource.path = path;
    return { ...resource.state, reload: resource.reload };
  },
}));

beforeEach(() => {
  resource.reload.mockReset();
});
afterEach(cleanup);

describe("UsersTable", () => {
  it("loads users from GET /api/users and shows the loading state", () => {
    resource.state = { status: "loading" };
    render(<UsersTable />);

    expect(resource.path).toBe("/api/users");
    expect(screen.getByRole("status").textContent).toBe("Ładowanie…");
  });

  it("shows the API error message and retries through reload()", async () => {
    resource.state = { status: "error", error: { code: "internal_error", message: "Serwer nie odpowiada." } };
    render(<UsersTable />);

    expect(screen.getByRole("alert").textContent).toContain("Serwer nie odpowiada.");
    await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
    expect(resource.reload).toHaveBeenCalledOnce();
  });

  it("shows the empty state when there are no users", () => {
    resource.state = { status: "ready", data: [] };
    render(<UsersTable />);

    expect(screen.getByText("Brak użytkowników.")).toBeDefined();
  });

  it("renders name, email badge and a pl-PL creation date per user", () => {
    const createdAt = "2026-10-17T08:36:56.000Z";
    resource.state = {
      status: "ready",
      data: [{ id: "b38f5451-de68-4a50-bedf-5d244762809c", email: "ada@example.test", name: "Ada", createdAt }],
    };
    render(<UsersTable />);

    const table = screen.getByRole("table", { name: "Użytkownicy" });
    const headers = within(table).getAllByRole("columnheader").map((cell) => cell.textContent);
    expect(headers).toEqual(["Imię", "E-mail", "Utworzono"]);

    const cells = within(within(table).getAllByRole("row")[1]!).getAllByRole("cell");
    expect(cells.map((cell) => cell.textContent)).toEqual([
      "Ada",
      "ada@example.test",
      new Date(createdAt).toLocaleString("pl-PL"),
    ]);
    expect(cells[1]!.querySelector('[data-slot="badge"]')?.textContent).toBe("ada@example.test");
  });
});
