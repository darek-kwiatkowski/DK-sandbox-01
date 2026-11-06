// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

afterEach(cleanup);

beforeAll(() => {
  // jsdom lacks the layout APIs Radix Select calls when it opens.
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.releasePointerCapture = vi.fn();
});

describe("Alert", () => {
  it("renders title, description and action, announced as an alert", () => {
    render(
      <Alert variant="destructive" className="mt-2">
        <AlertTitle>Nie udało się zapisać profilu</AlertTitle>
        <AlertDescription>Spróbuj ponownie za chwilę.</AlertDescription>
        <AlertAction>
          <button type="button">Spróbuj ponownie</button>
        </AlertAction>
      </Alert>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("text-destructive");
    expect(alert.className).toContain("mt-2");
    expect(alert.textContent).toContain("Spróbuj ponownie za chwilę.");
    expect(screen.getByRole("button", { name: "Spróbuj ponownie" }).parentElement?.dataset.slot).toBe("alert-action");
  });

  it("can be a non-urgent note", () => {
    render(
      <Alert role="note">
        <AlertDescription>Płatność jest ostateczna.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("note").className).toContain("bg-background");
  });
});

describe("Avatar", () => {
  it("shows initials while the GitHub picture is not loaded", () => {
    render(
      <Avatar size="sm" className="ml-1">
        <AvatarImage src="https://avatars.githubusercontent.com/u/1" alt="Anna Kowalska" />
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>,
    );
    const root = document.querySelector('[data-slot="avatar"]') as HTMLElement;
    expect(root.dataset.size).toBe("sm");
    expect(root.className).toContain("ml-1");
    expect(screen.getByText("AK").dataset.slot).toBe("avatar-fallback");
  });

  it("defaults to the 32 px size", () => {
    render(
      <Avatar>
        <AvatarFallback>MZ</AvatarFallback>
      </Avatar>,
    );
    expect((document.querySelector('[data-slot="avatar"]') as HTMLElement).dataset.size).toBe("default");
  });
});

describe("Select", () => {
  it("renders an open list with groups, label, separator and the selected item", () => {
    render(
      <Select defaultValue="25" open>
        <SelectTrigger aria-label="Długość slotu" size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-60">
          <SelectScrollUpButton />
          <SelectGroup>
            <SelectLabel>Długość</SelectLabel>
            <SelectItem value="25">25 minut</SelectItem>
            <SelectSeparator />
            <SelectItem value="50">50 minut</SelectItem>
          </SelectGroup>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>,
    );
    // While open, Radix hides everything outside the list from assistive technology.
    const trigger = screen.getByRole("combobox", { name: "Długość slotu", hidden: true });
    expect(trigger.dataset.size).toBe("sm");
    expect(trigger.className).toContain("w-40");
    expect(screen.getByRole("listbox").className).toContain("max-h-60");
    // Radix marks the chosen value with data-state; aria-selected follows keyboard focus.
    expect(screen.getByRole("option", { name: "25 minut" }).dataset.state).toBe("checked");
    expect(document.querySelector('[data-slot="select-separator"]')).not.toBeNull();
    expect(screen.getByText("Długość").dataset.slot).toBe("select-label");
  });

  it("aligns to the trigger by default with the default size", () => {
    render(
      <Select open>
        <SelectTrigger aria-label="Strefa czasowa">
          <SelectValue placeholder="Wybierz" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="waw">Europe/Warsaw</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "Strefa czasowa", hidden: true }).dataset.size).toBe("default");
    expect((document.querySelector('[data-slot="select-content"]') as HTMLElement).dataset.alignTrigger).toBe("true");
  });
});
