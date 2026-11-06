// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AccessDenied } from "../feedback";
import { AppShell, NavLinks } from ".";

afterEach(cleanup);

const items = [
  { href: "/account", label: "Konto" },
  { href: "/mentor", label: "Panel mentora" },
];

describe("NavLinks", () => {
  it("marks only the current page", () => {
    render(<NavLinks items={items} currentPath="/mentor" />);
    expect(screen.getByRole("link", { name: "Panel mentora" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Konto" }).getAttribute("aria-current")).toBeNull();
    expect(screen.getByRole("navigation", { name: "Główna" })).toBeDefined();
  });
});

describe("AppShell", () => {
  it("renders the product name, navigation, actions, a skip link and the content", () => {
    render(
      <AppShell items={items} currentPath="/account" actions={<span>Anna Kowalska</span>}>
        <h1>Konto</h1>
      </AppShell>,
    );
    expect(screen.getByRole("link", { name: "DevMentor" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Przejdź do treści" }).getAttribute("href")).toBe("#main-content");
    expect(screen.getByRole("main").textContent).toBe("Konto");
    expect(screen.getByText("Anna Kowalska")).toBeDefined();
  });

  it("omits the actions area when there are none", () => {
    const { container } = render(
      <AppShell items={items} currentPath="/account">
        <p>Treść</p>
      </AppShell>,
    );
    expect(container.querySelector(".ml-auto")).toBeNull();
  });
});

describe("AccessDenied", () => {
  it("states the refusal as the page heading with an optional explanation and action", () => {
    const { rerender } = render(<AccessDenied />);
    expect(screen.getByRole("heading", { level: 1, name: "Nie masz dostępu do tej strony." })).toBeDefined();
    rerender(<AccessDenied description="Mentorzy dołączają tylko z zaproszenia." action={<a href="/account">Przejdź do konta</a>} />);
    expect(screen.getByText("Mentorzy dołączają tylko z zaproszenia.")).toBeDefined();
    expect(screen.getByRole("link", { name: "Przejdź do konta" })).toBeDefined();
  });
});
