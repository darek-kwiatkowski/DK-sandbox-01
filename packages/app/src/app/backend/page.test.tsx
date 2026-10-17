// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BackendPage from "./page";

vi.mock("./users-table", () => ({ UsersTable: () => <div data-testid="users-table" /> }));

afterEach(cleanup);

describe("BackendPage", () => {
  it("renders the users card with the users table", () => {
    render(<BackendPage />);

    expect(screen.getByText("Użytkownicy")).toBeDefined();
    expect(screen.getByText(/Panel administracyjny \(backend\) używa komponentów shadcn-ui z/).textContent).toContain(
      "@devmentor/ui",
    );
    expect(screen.getByTestId("users-table")).toBeDefined();
  });
});
