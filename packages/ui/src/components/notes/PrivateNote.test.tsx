// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { PrivateNote, type PrivateNoteProps } from "./PrivateNote";

afterEach(cleanup);
const props = (): PrivateNoteProps => ({ value: "Dodaj test zawężania typu.", status: "ready", canApprove: true, onChange: vi.fn(), onSave: vi.fn(), onApprove: vi.fn(), onRetry: vi.fn() });

it("edits a controlled draft and requests save and approval without claiming server success", async () => {
  const input = props();
  render(<PrivateNote {...input} />);
  await userEvent.type(screen.getByRole("textbox"), "!");
  expect(input.onChange).toHaveBeenLastCalledWith(`${input.value}!`);
  await userEvent.click(screen.getByRole("button", { name: "Zapisz notatkę" }));
  await userEvent.click(screen.getByRole("button", { name: "Zatwierdź notatkę" }));
  expect(input.onSave).toHaveBeenCalledOnce();
  expect(input.onApprove).toHaveBeenCalledOnce();
  expect(screen.queryByRole("status")).toBeNull();
});

it("handles loading and empty drafts and hides approval from the mentor", () => {
  const input = props();
  const { rerender } = render(<PrivateNote {...input} status="loading" />);
  expect(screen.getByRole("status").textContent).toContain("Wczytywanie prywatnej notatki");
  rerender(<PrivateNote {...input} value="" canApprove={false} />);
  expect(screen.getByText("Notatka jest jeszcze pusta.")).toBeTruthy();
  expect(screen.getByText(/Pusta notatka nie może zostać zapisana ani zatwierdzona/)).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Zatwierdź notatkę" })).toBeNull();
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  rerender(<PrivateNote {...input} value=" " />);
  expect(screen.getAllByRole("button").every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
});

it.each(["saving", "approving"] as const)("locks the draft while %s and identifies the pending operation", (status) => {
  render(<PrivateNote {...props()} status={status} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).readOnly).toBe(true);
  expect(screen.getByRole("region").getAttribute("aria-busy")).toBe("true");
  expect(screen.getAllByRole("button").every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
  expect(screen.getByRole("button", { name: status === "saving" ? "Zapisywanie…" : "Zatwierdzanie…" })).toBeTruthy();
});

it.each(["error", "conflict"] as const)("retains the draft on %s and exposes recovery", async (status) => {
  const input = props();
  render(<PrivateNote {...input} status={status} />);
  expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(input.value);
  expect(screen.getByRole("alert").textContent).toContain(status === "error" ? "Twój tekst został zachowany" : "Zachowaliśmy Twój tekst");
  await userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
  expect(input.onRetry).toHaveBeenCalledOnce();
  expect((screen.getByRole("button", { name: "Zapisz notatkę" }) as HTMLButtonElement).disabled).toBe(status === "conflict");
});

it("announces confirmed approval and preserves a read-only note even when empty", () => {
  const input = props();
  const { rerender } = render(<PrivateNote {...input} status="approved" />);
  expect(screen.getByRole("status").textContent).toBe("Notatka zatwierdzona.");
  expect((screen.getByRole("textbox", { name: "Zatwierdzona notatka" }) as HTMLTextAreaElement).readOnly).toBe(true);
  expect(screen.queryByRole("button")).toBeNull();
  rerender(<PrivateNote {...input} value="" status="approved" />);
  expect(screen.queryByText("Notatka jest jeszcze pusta.")).toBeNull();
});
