// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./page";

afterEach(cleanup);

describe("HomePage", () => {
  it("renders the landing headline inside the main landmark", () => {
    render(<HomePage />);

    const main = screen.getByRole("main");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Rozwijaj się jako programista z pomocą mentora.");
    expect(main.textContent).toContain("DevMentor");
    expect(main.textContent).toContain("Strona publiczna (frontend) jest stylowana czystym Tailwind CSS.");
  });
});
