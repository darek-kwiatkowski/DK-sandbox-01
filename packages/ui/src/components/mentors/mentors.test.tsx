// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MentorList } from "./MentorList";
import { MentorListRow } from "./MentorListRow";
import { MentorProfile } from "./MentorProfile";
import { PublicWorkLink } from "./PublicWorkLink";
import { StackFilter } from "./StackFilter";
import { StackTags } from "./StackTags";
import { initials, type MentorProfileData, type MentorSummary } from "./types";

afterEach(cleanup);

const mentor: MentorSummary = {
  id: "anna", name: "Anna Kowalska", stack: ["TypeScript", "React"],
  nextSlotAt: "2026-11-13T17:00:00.000Z", price25Minor: 12000, price50Minor: 22000,
};
const hrefFor = (item: MentorSummary) => `/mentors/${item.id}`;
const profile: MentorProfileData = {
  ...mentor,
  description: "Pomagam diagnozować problemy TypeScript w aplikacjach React.",
  publicWork: { href: "https://example.test/anna", title: "Konfiguracja TypeScript" },
};

describe("mentor identity and public work", () => {
  it("forms initials from first and last names and handles whitespace or absent text", () => {
    expect(initials("  anna maria kowalska  ")).toBe("AK");
    expect(initials("piotr")).toBe("P");
    expect(initials("   ")).toBe("");
  });

  it("renders stack tags as a named list and omits an empty list", () => {
    const { rerender } = render(<StackTags tags={["TypeScript", "React"]} />);
    expect(within(screen.getByRole("list", { name: "Stack" })).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["TypeScript", "React"]);
    rerender(<StackTags tags={["Python"]} label="Technologie mentora" />);
    expect(screen.getByRole("list", { name: "Technologie mentora" }).textContent).toBe("Python");
    rerender(<StackTags tags={[]} />);
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("announces an external public-work link opening in a new tab", () => {
    render(<PublicWorkLink href="https://example.test/anna" title="Konfiguracja TypeScript" />);
    const link = screen.getByRole("link", { name: /^Publiczna praca: Konfiguracja TypeScript\s*\(otwiera się w nowej karcie\)$/ });
    expect(link.getAttribute("href")).toBe("https://example.test/anna");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("MentorListRow", () => {
  it("shows identity, both prices and nearest slot in the supplied timezone with two purposeful links", () => {
    render(<ul><MentorListRow mentor={mentor} href="/mentors/anna" timeZone="Europe/Warsaw" /></ul>);
    expect(screen.getByText("AK").textContent).toBe("AK");
    expect(screen.getByRole("link", { name: "Anna Kowalska" }).getAttribute("href")).toBe("/mentors/anna");
    expect(screen.getByRole("link", { name: "Zobacz profil: Anna Kowalska" }).getAttribute("href")).toBe("/mentors/anna");
    expect(screen.getByText(/25 min · 120,00.*50 min · 220,00/).textContent).toContain("zł");
    expect(screen.getByText("Najbliższy termin:").nextElementSibling?.textContent).toContain("18:00");
  });

  it("shows fallback content while a picture loads and does not invent prices or slots", () => {
    render(<ul><MentorListRow mentor={{ ...mentor, avatarUrl: "https://example.test/anna.png", nextSlotAt: null, price25Minor: null, price50Minor: null }} href="/mentors/anna" /></ul>);
    expect(screen.getByText("AK").textContent).toBe("AK");
    expect(screen.getByText("Brak wolnych terminów").textContent).toBe("Brak wolnych terminów");
    expect(screen.getByText("Cena wkrótce").textContent).toBe("Cena wkrótce");
    expect(screen.queryByText("Najbliższy termin:")).toBeNull();
  });

  it("shows only the configured duration when one price is absent", () => {
    const { rerender } = render(<ul><MentorListRow mentor={{ ...mentor, price25Minor: null }} href="/mentors/anna" /></ul>);
    expect(screen.getByText(/50 min · 220,00/).textContent).not.toContain("25 min");
    rerender(<ul><MentorListRow mentor={{ ...mentor, price50Minor: null }} href="/mentors/anna" /></ul>);
    expect(screen.getByText(/25 min · 120,00/).textContent).not.toContain("50 min");
    expect(screen.queryByText("Cena wkrótce")).toBeNull();
  });
});

describe("MentorProfile", () => {
  it("labels the profile, includes description, public work, prices and the composed booking action", () => {
    render(<MentorProfile mentor={profile}><button type="button">Wybierz termin</button></MentorProfile>);
    expect(screen.getByRole("article", { name: "Anna Kowalska" }).getAttribute("aria-labelledby")).toBe("mentor-anna");
    expect(screen.getByRole("heading", { name: "Anna Kowalska" }).tagName).toBe("H1");
    expect(screen.getByText(profile.description).textContent).toBe(profile.description);
    expect(screen.getByRole("link", { name: /Publiczna praca/ }).getAttribute("href")).toBe(profile.publicWork?.href);
    expect(screen.getByText(/120,00/).textContent).toContain("zł");
    expect(screen.getByText(/220,00/).textContent).toContain("zł");
    expect(screen.getByRole("button", { name: "Wybierz termin" }).textContent).toBe("Wybierz termin");
  });

  it("shows an honest partial profile without public work, booking action or configured prices", () => {
    render(<MentorProfile mentor={{ ...profile, avatarUrl: "https://example.test/anna.png", publicWork: null, price25Minor: null, price50Minor: null }} />);
    expect(screen.getByText("AK").textContent).toBe("AK");
    expect(screen.getAllByText("—")).toHaveLength(2);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("MentorList", () => {
  it("announces loading and hides decorative skeletons from assistive technology", () => {
    const { container } = render(<MentorList state={{ status: "loading" }} hrefFor={hrefFor} />);
    expect(screen.getByRole("status").textContent).toContain("Wczytywanie mentorów");
    expect(screen.getByRole("status").parentElement?.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelectorAll('[data-slot="skeleton"][aria-hidden="true"]')).toHaveLength(9);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("reports default and server errors and lets the user retry", async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<MentorList state={{ status: "error" }} hrefFor={hrefFor} onRetry={onRetry} />);
    expect(screen.getByRole("alert").textContent).toContain("Nie udało się wczytać mentorów.");
    await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
    expect(onRetry).toHaveBeenCalledOnce();
    rerender(<MentorList state={{ status: "error", message: "Sesja wygasła. Zaloguj się ponownie." }} hrefFor={hrefFor} />);
    expect(screen.getByRole("alert").textContent).toBe("Sesja wygasła. Zaloguj się ponownie.");
  });

  it("distinguishes no published mentors from no matches and clears applied filters", async () => {
    const onClearFilters = vi.fn();
    const { rerender } = render(<MentorList state={{ status: "ready", mentors: [] }} hrefFor={hrefFor} />);
    expect(screen.getByText("Nie ma jeszcze opublikowanych mentorów.").textContent).toBe("Nie ma jeszcze opublikowanych mentorów.");
    rerender(<MentorList state={{ status: "ready", mentors: [] }} hrefFor={hrefFor} filtered onClearFilters={onClearFilters} />);
    expect(screen.getByText("Żaden mentor nie pasuje do wybranych filtrów.").textContent).toContain("filtrów");
    await userEvent.click(screen.getByRole("button", { name: "Wyczyść filtry" }));
    expect(onClearFilters).toHaveBeenCalledOnce();
    rerender(<MentorList state={{ status: "ready", mentors: [] }} hrefFor={hrefFor} filtered />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Wyczyść filtry albo wybierz inny stack.").textContent).toContain("inny stack");
  });

  it("preserves server order and uses the supplied profile URLs", () => {
    const second = { ...mentor, id: "piotr", name: "Piotr Nowak" };
    const href = vi.fn(hrefFor);
    render(<MentorList state={{ status: "ready", mentors: [second, mentor] }} hrefFor={href} timeZone="Europe/Warsaw" />);
    const rows = screen.getByRole("list", { name: "Mentorzy" }).children;
    expect(within(rows[0] as HTMLElement).getByRole("link", { name: "Piotr Nowak" }).getAttribute("href")).toBe("/mentors/piotr");
    expect(within(rows[1] as HTMLElement).getByRole("link", { name: "Anna Kowalska" }).getAttribute("href")).toBe("/mentors/anna");
    expect(href.mock.calls.map(([value]) => value.id)).toEqual(["piotr", "anna"]);
  });
});

describe("StackFilter", () => {
  it("announces a pending count, then results and controlled filter additions/removals", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<StackFilter tags={["React", "Python"]} selected={[]} resultCount={null} onChange={onChange} />);
    expect(screen.getByRole("status").textContent).toBe("Wczytywanie…");
    expect(screen.queryByRole("list", { name: "Aktywne filtry" })).toBeNull();
    await userEvent.click(screen.getByRole("checkbox", { name: "React" }));
    expect(onChange).toHaveBeenLastCalledWith(["React"]);
    rerender(<StackFilter tags={["React", "Python"]} selected={["React"]} resultCount={2} onChange={onChange} />);
    expect(screen.getByRole("status").textContent).toBe("Wyniki: 2");
    expect(screen.getByRole("checkbox", { name: "React" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("checkbox", { name: "Python" }));
    expect(onChange).toHaveBeenLastCalledWith(["React", "Python"]);
    await userEvent.click(screen.getByRole("checkbox", { name: "React" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("removes one active filter by name and clears all filters", async () => {
    const onChange = vi.fn();
    render(<StackFilter tags={["React", "Python"]} selected={["React", "Python"]} resultCount={0} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Usuń filtr: React" }));
    expect(onChange).toHaveBeenLastCalledWith(["Python"]);
    await userEvent.click(screen.getByRole("button", { name: "Wyczyść filtry" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
