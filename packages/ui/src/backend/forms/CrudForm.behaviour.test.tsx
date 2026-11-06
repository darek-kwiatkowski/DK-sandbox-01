// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { CrudForm, type CrudFormField } from "./CrudForm";

afterEach(cleanup);

beforeAll(() => {
  // jsdom lacks the layout APIs Radix Select uses when it opens.
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.releasePointerCapture = vi.fn();
});

const schema = z.object({
  email: z.email("Podaj poprawny e-mail"),
  description: z.string().min(1, "Dodaj opis"),
  duration: z.enum(["25", "50"], { error: "Wybierz długość" }),
  price: z.string().regex(/^\d+(,\d{2})?$/, "Podaj kwotę, np. 180,00"),
});

const fields: CrudFormField[] = [
  { name: "email", label: "E-mail", type: "email", description: "Na ten adres wyślemy potwierdzenie.", placeholder: "anna@example.com" },
  { name: "description", label: "Opis", type: "textarea", placeholder: "Np. migracje Helm 3" },
  {
    name: "duration",
    label: "Długość",
    type: "select",
    options: [
      { value: "25", label: "25 minut" },
      { value: "50", label: "50 minut" },
    ],
  },
  { name: "price", label: "Cena za 25 minut", type: "money" },
];

describe("CrudForm behaviour", () => {
  it("validates a field when the user leaves it and clears the error once it is fixed", async () => {
    render(<CrudForm schema={schema} fields={fields} onSubmit={vi.fn()} />);
    const email = screen.getByLabelText("E-mail");
    expect(email.getAttribute("aria-describedby")).toMatch(/description/);
    await userEvent.type(email, "nope");
    await userEvent.tab();
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Podaj poprawny e-mail")).toBeDefined();
    await userEvent.clear(email);
    await userEvent.type(email, "anna@example.com");
    await userEvent.tab();
    expect(email.getAttribute("aria-invalid")).toBeNull();
  });

  it("moves focus to the first invalid field after a failed submit and keeps typed values", async () => {
    render(<CrudForm schema={schema} fields={fields} onSubmit={vi.fn()} defaultValues={{ email: "anna@example.com" }} />);
    await userEvent.type(screen.getByLabelText("Cena za 25 minut"), "dużo");
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Opis")));
    expect(screen.getByLabelText("Cena za 25 minut")).toHaveProperty("value", "dużo");
    expect(screen.getByText("Wybierz długość")).toBeDefined();
  });

  it("submits textarea, select and money values and offers an outline submit", async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: null }));
    render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} submitVariant="outline" defaultValues={{ email: "anna@example.com" }} />);
    await userEvent.type(screen.getByLabelText("Opis"), "Migracje Helm 3");
    await userEvent.click(screen.getByRole("combobox", { name: "Długość" }));
    await userEvent.click(await screen.findByRole("option", { name: "50 minut" }));
    await userEvent.type(screen.getByLabelText("Cena za 25 minut"), "180,00");
    const submit = screen.getByRole("button", { name: "Zapisz" });
    expect(submit.dataset.variant).toBe("outline");
    await userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledWith({ email: "anna@example.com", description: "Migracje Helm 3", duration: "50", price: "180,00" });
  });

  it("validates a select when it loses focus", async () => {
    render(<CrudForm schema={schema} fields={fields} onSubmit={vi.fn()} />);
    screen.getByRole("combobox", { name: "Długość" }).focus();
    await userEvent.tab();
    expect(screen.getByText("Wybierz długość")).toBeDefined();
  });

  it("focuses the form message when the server rejects without field errors", async () => {
    const onSubmit = vi.fn(async () => ({ ok: false as const, error: { code: "network_error", message: "Brak połączenia z serwerem. Spróbuj ponownie." } }));
    render(
      <CrudForm
        schema={schema}
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={{ email: "anna@example.com", description: "Opis", duration: "25", price: "180,00" }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("alert")));
    expect(screen.getByLabelText("Opis")).toHaveProperty("value", "Opis");
  });

  it("renders a select without options and with its default placeholder", () => {
    render(<CrudForm schema={z.object({ zone: z.string() })} fields={[{ name: "zone", label: "Strefa", type: "select" }]} onSubmit={vi.fn()} />);
    expect(screen.getByRole("combobox", { name: "Strefa" }).textContent).toBe("Wybierz");
  });
});
