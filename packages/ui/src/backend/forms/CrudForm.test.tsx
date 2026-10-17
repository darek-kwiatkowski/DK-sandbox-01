// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CrudForm, type CrudFormField } from "./CrudForm";

const schema = z.object({ email: z.email("Podaj poprawny e-mail"), name: z.string().min(1, "Imię jest wymagane") });
const fields: CrudFormField[] = [
  { name: "email", label: "E-mail", type: "email" },
  { name: "name", label: "Imię" },
];

afterEach(cleanup);

describe("CrudForm", () => {
  it("validates on the client with the shared schema and does not submit invalid data", async () => {
    const onSubmit = vi.fn();
    render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("E-mail"), "nope");
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    expect(onSubmit).not.toHaveBeenCalled();
    const email = screen.getByLabelText("E-mail");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(email.getAttribute("aria-describedby")!)?.textContent).toBe("Podaj poprawny e-mail");
    expect(screen.getByText("Imię jest wymagane")).toBeDefined();
  });

  it("submits parsed values and reports success", async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: { id: "1" } }));
    const onSuccess = vi.fn();
    render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} onSuccess={onSuccess} />);

    await userEvent.type(screen.getByLabelText("E-mail"), "ada@example.test");
    await userEvent.type(screen.getByLabelText("Imię"), "Ada");
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    expect(onSubmit).toHaveBeenCalledWith({ email: "ada@example.test", name: "Ada" });
    expect(onSuccess).toHaveBeenCalledWith({ id: "1" });
  });

  it("shows server field errors next to the matching field", async () => {
    const onSubmit = vi.fn(async () => ({
      ok: false as const,
      error: { code: "conflict", message: "Konflikt danych.", fieldErrors: { email: ["Ten e-mail jest zajęty."] } },
    }));
    render(<CrudForm schema={schema} fields={fields} onSubmit={onSubmit} defaultValues={{ email: "ada@example.test", name: "Ada" }} />);

    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    const email = screen.getByLabelText("E-mail");
    expect(document.getElementById(email.getAttribute("aria-describedby")!)?.textContent).toBe("Ten e-mail jest zajęty.");
    expect(screen.getByText("Konflikt danych.")).toBeDefined();
  });

  it("submits with Ctrl+Enter and cancels with Escape", async () => {
    const onSubmit = vi.fn(async () => ({ ok: true as const, data: null }));
    const onCancel = vi.fn();
    render(
      <CrudForm schema={schema} fields={fields} onSubmit={onSubmit} onCancel={onCancel} defaultValues={{ email: "ada@example.test", name: "Ada" }} />,
    );

    await userEvent.click(screen.getByLabelText("Imię"));
    await userEvent.keyboard("{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledOnce();

    await userEvent.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
