// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmptyState, ErrorMessage, LoadingMessage } from ".";

afterEach(cleanup);

describe("feedback components", () => {
  it("LoadingMessage announces a custom label politely", () => {
    render(<LoadingMessage label="Wczytywanie sesji…" />);
    const status = screen.getByRole("status");
    expect(status.textContent).toBe("Wczytywanie sesji…");
    expect(status.getAttribute("aria-live")).toBe("polite");
  });

  it("ErrorMessage shows the default message and no retry button without onRetry", () => {
    render(<ErrorMessage />);
    expect(screen.getByRole("alert").textContent).toBe("Nie udało się wczytać danych.");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("ErrorMessage calls onRetry from its button", async () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Serwer nie odpowiada." onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("EmptyState renders only the title by default", () => {
    const { container } = render(<EmptyState title="Brak sesji." />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(screen.getByText("Brak sesji.")).toBeDefined();
  });

  it("EmptyState renders a description and an action", () => {
    render(
      <EmptyState
        title="Brak mentorów."
        description="Dodaj pierwszego mentora."
        action={<button type="button">Dodaj mentora</button>}
      />,
    );
    expect(screen.getByText("Dodaj pierwszego mentora.")).toBeDefined();
    expect(screen.getByRole("button", { name: "Dodaj mentora" })).toBeDefined();
  });
});
