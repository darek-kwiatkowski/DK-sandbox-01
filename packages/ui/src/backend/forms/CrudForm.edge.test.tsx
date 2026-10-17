// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ApiResult } from "../api/types";
import { CrudForm, type CrudFormField } from "./CrudForm";

const passwordSchema = z
  .object({ password: z.string(), confirm: z.string() })
  .refine((value) => value.password === value.confirm, { message: "Hasła muszą być takie same." });
const fields: CrudFormField[] = [
  { name: "password", label: "Hasło", type: "password", description: "Min. 12 znaków", autoComplete: "new-password" },
  { name: "confirm", label: "Powtórz hasło", type: "password" },
];

afterEach(cleanup);

describe("CrudForm edge cases", () => {
  it("shows schema-level (empty path) issues as a general form error", async () => {
    const onSubmit = vi.fn();
    render(<CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} defaultValues={{ password: "a" }} />);

    await userEvent.type(screen.getByLabelText("Powtórz hasło"), "b");
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toBe("Hasła muszą być takie same.");
  });

  it("renders field descriptions, autocomplete hints, defaults and custom labels", () => {
    render(
      <CrudForm
        schema={passwordSchema}
        fields={fields}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        defaultValues={{ password: "sekret" }}
        submitLabel="Ustaw hasło"
        cancelLabel="Wróć"
      />,
    );

    const password = screen.getByLabelText("Hasło") as HTMLInputElement;
    expect(password.value).toBe("sekret");
    expect(password.getAttribute("autocomplete")).toBe("new-password");
    expect((screen.getByLabelText("Powtórz hasło") as HTMLInputElement).value).toBe("");
    expect(screen.getByText("Min. 12 znaków")).toBeDefined();
    expect(screen.getByRole("button", { name: "Ustaw hasło" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Wróć" })).toBeDefined();
  });

  it("shows a server error without field errors and needs no onSuccess", async () => {
    const onSubmit = vi.fn(async (): Promise<ApiResult<unknown>> => ({
      ok: false,
      error: { code: "internal_error", message: "Coś poszło nie tak." },
    }));
    render(<CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} defaultValues={{ password: "x", confirm: "x" }} />);

    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    expect(screen.getByRole("alert").textContent).toBe("Coś poszło nie tak.");
    expect(screen.getByLabelText("Hasło").getAttribute("aria-invalid")).toBeNull();
  });

  it("succeeds without an onSuccess callback", async () => {
    const onSubmit = vi.fn(async (): Promise<ApiResult<unknown>> => ({ ok: true, data: null }));
    render(<CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} defaultValues={{ password: "x", confirm: "x" }} />);

    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    expect(onSubmit).toHaveBeenCalledWith({ password: "x", confirm: "x" });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("disables the form while submitting and ignores a second submit", async () => {
    let finish: (result: ApiResult<unknown>) => void = () => undefined;
    const onSubmit = vi.fn(() => new Promise<ApiResult<unknown>>((resolve) => (finish = resolve)));
    const { container } = render(
      <CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} onCancel={vi.fn()} defaultValues={{ password: "x", confirm: "x" }} />,
    );
    const form = container.querySelector("form")!;

    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));

    const submit = screen.getByRole("button", { name: "Zapisywanie…" }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Anuluj" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText("Hasło") as HTMLInputElement).disabled).toBe(true);
    expect(form.getAttribute("aria-busy")).toBe("true");

    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledOnce();

    finish({ ok: true, data: null });
    expect(await screen.findByRole("button", { name: "Zapisz" })).toBeDefined();
  });

  it("ignores Escape without onCancel and other keys", () => {
    const onSubmit = vi.fn();
    const { container } = render(<CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} />);
    const form = container.querySelector("form")!;

    expect(fireEvent.keyDown(form, { key: "Escape" })).toBe(true);
    expect(fireEvent.keyDown(form, { key: "Enter" })).toBe(true);
    expect(fireEvent.keyDown(form, { key: "a", ctrlKey: true })).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits with Cmd+Enter", () => {
    const onSubmit = vi.fn(async (): Promise<ApiResult<unknown>> => ({ ok: true, data: null }));
    const { container } = render(
      <CrudForm schema={passwordSchema} fields={fields} onSubmit={onSubmit} defaultValues={{ password: "x", confirm: "x" }} />,
    );

    expect(fireEvent.keyDown(container.querySelector("form")!, { key: "Enter", metaKey: true })).toBe(false);
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("renders an empty input for a field added after the first render", () => {
    const { rerender } = render(<CrudForm schema={passwordSchema} fields={fields.slice(0, 1)} onSubmit={vi.fn()} />);

    rerender(<CrudForm schema={passwordSchema} fields={fields} onSubmit={vi.fn()} />);

    expect((screen.getByLabelText("Powtórz hasło") as HTMLInputElement).value).toBe("");
  });
});
