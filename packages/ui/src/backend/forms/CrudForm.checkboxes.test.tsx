// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import type { ApiResult } from "../api/types";
import { CrudForm, type CrudFormField } from "./CrudForm";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn(); });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const schema = z.object({ stack: z.array(z.string()).min(1, "Wybierz co najmniej jedną technologię.") });
const fields: CrudFormField[] = [{ name: "stack", label: "Stack", type: "checkboxes", description: "Wybierz technologie, w których pomagasz.", options: [{ value: "TypeScript", label: "TypeScript" }, { value: "React", label: "React" }] }];

describe("CrudForm checkbox groups", () => {
  it("reads array defaults, toggles choices independently and submits arrays alongside strings", async () => {
    const submit = vi.fn(async () => ({ ok: true as const, data: null }));
    render(<CrudForm schema={schema.extend({ description: z.string() })} fields={[...fields, { name: "description", label: "Opis" }]} defaultValues={{ stack: ["React"], description: "Pomagam z React." }} onSubmit={submit} />);
    expect(screen.getByRole("group", { name: "Stack" }).getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: "React" }).getAttribute("aria-checked")).toBe("true");
    await userEvent.click(screen.getByRole("checkbox", { name: "TypeScript" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "React" }));
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    expect(submit).toHaveBeenCalledWith({ stack: ["TypeScript"], description: "Pomagam z React." });
  });

  it("validates only when focus leaves the group and clears a corrected error", async () => {
    render(<CrudForm schema={schema} fields={fields} onSubmit={async () => ({ ok: true, data: null })} />);
    const first = screen.getByRole("checkbox", { name: "TypeScript" });
    const second = screen.getByRole("checkbox", { name: "React" });
    first.focus();
    fireEvent.blur(first, { relatedTarget: second });
    expect(screen.queryByText("Wybierz co najmniej jedną technologię.")).toBeNull();
    fireEvent.blur(second, { relatedTarget: screen.getByRole("button", { name: "Zapisz" }) });
    expect(await screen.findByText("Wybierz co najmniej jedną technologię.")).toBeTruthy();
    expect(first.getAttribute("aria-invalid")).toBe("true");
    expect(first.getAttribute("aria-describedby")).toContain("-error");
    await userEvent.click(first);
    fireEvent.blur(first, { relatedTarget: null });
    await waitFor(() => expect(screen.queryByText("Wybierz co najmniej jedną technologię.")).toBeNull());
    expect(first.getAttribute("aria-invalid")).toBeNull();
  });

  it("focuses the first invalid checkbox after submit without calling the server", async () => {
    const submit = vi.fn();
    render(<CrudForm schema={schema} fields={fields} onSubmit={submit} />);
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "TypeScript" })));
    expect(submit).not.toHaveBeenCalled();
  });

  it("locks choices while pending and preserves selection with associated server error", async () => {
    let finish!: (result: ApiResult<unknown>) => void;
    const submit = vi.fn(() => new Promise<ApiResult<unknown>>((resolve) => { finish = resolve; }));
    render(<CrudForm schema={schema} fields={fields} defaultValues={{ stack: ["React"] }} onSubmit={submit} />);
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    expect(screen.getByRole("checkbox", { name: "React" })).toHaveProperty("disabled", true);
    finish({ ok: false, error: { code: "validation_error", message: "Sprawdź technologie.", fieldErrors: { stack: ["Wybierz inny stack."] } } });
    expect(await screen.findByText("Wybierz inny stack.")).toBeTruthy();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("checkbox", { name: "TypeScript" })));
    expect(screen.getByRole("checkbox", { name: "React" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("checkbox", { name: "React" })).toHaveProperty("disabled", false);
    expect(screen.getByRole("checkbox", { name: "React" }).getAttribute("aria-describedby")).toContain("-error");
  });

  it("keeps an empty option group named and focuses it when invalid", async () => {
    render(<CrudForm schema={schema} fields={[{ name: "stack", label: "Stack", type: "checkboxes" }]} onSubmit={async () => ({ ok: true, data: null })} />);
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByText("Brak dostępnych opcji.")).toBeTruthy();
    const group = screen.getByRole("group", { name: "Stack" });
    expect(group.getAttribute("aria-describedby")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(document.activeElement).toBe(group));
    expect(group.getAttribute("aria-invalid")).toBe("true");
    expect(group.getAttribute("aria-describedby")).toContain("-error");
  });

  it("submits an explicitly empty options array as an empty selection when the schema allows it", async () => {
    const submit = vi.fn(async () => ({ ok: true as const, data: null }));
    render(<CrudForm schema={z.object({ stack: z.array(z.string()) })} fields={[{ name: "stack", label: "Stack", type: "checkboxes", options: [] }]} onSubmit={submit} />);
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    expect(submit).toHaveBeenCalledWith({ stack: [] });
  });

  it("associates errors in an individual array item with the checkbox group", async () => {
    render(<CrudForm schema={z.object({ stack: z.array(z.enum(["TypeScript"])) })} fields={fields} defaultValues={{ stack: ["React"] }} onSubmit={vi.fn()} />);
    const first = screen.getByRole("checkbox", { name: "TypeScript" });
    fireEvent.blur(first, { relatedTarget: null });
    await waitFor(() => expect(first.getAttribute("aria-invalid")).toBe("true"));
    await userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
    await waitFor(() => expect(document.activeElement).toBe(first));
    expect(first.getAttribute("aria-describedby")).toContain("-error");
  });
});
