// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Button, buttonVariants } from "./button";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Textarea } from "./textarea";

afterEach(cleanup);

describe("Button", () => {
  it("uses the hover token instead of opacity for the main action", () => {
    expect(buttonVariants()).toContain("hover:bg-primary-hover");
    expect(buttonVariants()).toContain("focus-visible:ring-offset-2");
  });

  it("renders a link without control height or padding", () => {
    render(
      <Button asChild variant="link">
        <a href="/konto">Załóż konto</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Załóż konto" });
    expect(link.className).toContain("h-auto");
    expect(link.className).toContain("px-0");
    expect(link.className).not.toContain("h-8");
  });

  it("supports the small and icon sizes", () => {
    render(
      <>
        <Button size="sm">Mały</Button>
        <Button size="icon-sm" aria-label="Kopiuj link" />
      </>,
    );
    expect(screen.getByRole("button", { name: "Mały" }).className).toContain("h-6");
    expect(screen.getByRole("button", { name: "Kopiuj link" }).className).toContain("size-6");
  });
});

describe("Textarea", () => {
  it("renders a labelled, resizable text area", async () => {
    render(
      <>
        <label htmlFor="opis">Opis</label>
        <Textarea id="opis" className="min-h-24" />
      </>,
    );
    const textarea = screen.getByLabelText("Opis");
    expect(textarea.dataset.slot).toBe("textarea");
    expect(textarea.className).toContain("min-h-24");
    await userEvent.type(textarea, "Pomagam przy migracjach");
    expect(textarea).toHaveProperty("value", "Pomagam przy migracjach");
  });
});

describe("Checkbox", () => {
  it("toggles with the keyboard and shows the check icon", async () => {
    render(
      <>
        <Checkbox id="ts" />
        <label htmlFor="ts">TypeScript</label>
      </>,
    );
    const box = screen.getByRole("checkbox", { name: "TypeScript" });
    expect(box.getAttribute("aria-checked")).toBe("false");
    box.focus();
    await userEvent.keyboard(" ");
    expect(box.getAttribute("aria-checked")).toBe("true");
    expect(document.querySelector('[data-slot="checkbox-indicator"] svg')).not.toBeNull();
  });
});

describe("RadioGroup", () => {
  it("selects one duration and moves with arrow keys", async () => {
    render(
      <RadioGroup defaultValue="25" aria-label="Czas sesji" className="mt-2">
        <RadioGroupItem value="25" aria-label="25 minut" />
        <RadioGroupItem value="50" aria-label="50 minut" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Czas sesji" }).className).toContain("mt-2");
    const first = screen.getByRole("radio", { name: "25 minut" });
    expect(first.getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("radio", { name: "50 minut" }));
    expect(screen.getByRole("radio", { name: "50 minut" }).getAttribute("aria-checked")).toBe("true");
    expect(first.getAttribute("aria-checked")).toBe("false");
  });
});
