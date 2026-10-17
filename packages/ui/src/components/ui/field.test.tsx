// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";

afterEach(cleanup);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`) as HTMLElement | null;

describe("Field layout", () => {
  it("renders a fieldset with a legend and a group of fields", () => {
    render(
      <FieldSet>
        <FieldLegend>Dane</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Imię</FieldLabel>
            <input id="name" />
            <FieldDescription>Twoje imię</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>,
    );
    expect(screen.getByRole("group", { name: "Dane" }).dataset.slot).toBe("field-set");
    expect(slot("field-legend")?.dataset.variant).toBe("legend");
    expect(slot("field-group")).not.toBeNull();
    const field = slot("field");
    expect(field?.getAttribute("role")).toBe("group");
    expect(field?.dataset.orientation).toBe("vertical");
    expect(screen.getByLabelText("Imię")).toBeDefined();
    expect(slot("field-description")?.textContent).toBe("Twoje imię");
  });

  it("supports the label legend variant, horizontal orientation, content and title", () => {
    render(
      <FieldSet>
        <FieldLegend variant="label">Ustawienia</FieldLegend>
        <Field orientation="horizontal" className="gap-4">
          <FieldContent>
            <FieldTitle>Powiadomienia</FieldTitle>
          </FieldContent>
        </Field>
      </FieldSet>,
    );
    expect(slot("field-legend")?.dataset.variant).toBe("label");
    const field = slot("field");
    expect(field?.dataset.orientation).toBe("horizontal");
    expect(field?.className).toContain("flex-row");
    expect(field?.className).toContain("gap-4");
    expect(slot("field-content")?.textContent).toBe("Powiadomienia");
  });
});

describe("FieldSeparator", () => {
  it("renders only a line without children", () => {
    render(<FieldSeparator />);
    const separator = slot("field-separator");
    expect(separator?.dataset.content).toBe("false");
    expect(slot("field-separator-content")).toBeNull();
    expect(slot("separator")).not.toBeNull();
  });

  it("renders its label when given children", () => {
    render(<FieldSeparator>lub</FieldSeparator>);
    expect(slot("field-separator")?.dataset.content).toBe("true");
    expect(slot("field-separator-content")?.textContent).toBe("lub");
  });
});

describe("FieldError", () => {
  it("renders nothing without children or errors", () => {
    const { container } = render(
      <>
        <FieldError />
        <FieldError errors={[]} />
      </>,
    );
    expect(container.innerHTML).toBe("");
  });

  it("prefers children over errors", () => {
    render(<FieldError errors={[{ message: "Z błędów" }]}>Własny komunikat</FieldError>);
    expect(screen.getByRole("alert").textContent).toBe("Własny komunikat");
  });

  it("renders a single (de-duplicated) message as text", () => {
    render(<FieldError errors={[{ message: "Wymagane" }, { message: "Wymagane" }]} />);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toBe("Wymagane");
    expect(alert.querySelector("ul")).toBeNull();
  });

  it("renders multiple messages as a list and skips entries without a message", () => {
    render(<FieldError errors={[{ message: "Za krótkie" }, undefined, { message: "Brak cyfry" }, {}]} />);
    const items = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toEqual(["Za krótkie", "Brak cyfry"]);
  });
});
