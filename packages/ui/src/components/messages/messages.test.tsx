// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import type { ApiResult } from "@devmentor/ui/backend/api";
import { MessageComposer } from "./MessageComposer";
import { SessionTranscript } from "./SessionTranscript";

afterEach(cleanup);

it("sends trimmed text on Enter and clears it only after confirmation, blocking duplicate submits", async () => {
  let confirm!: (result: ApiResult<unknown>) => void;
  const onSend = vi.fn(() => new Promise<ApiResult<unknown>>((resolve) => { confirm = resolve; }));
  const { container } = render(<MessageComposer onSend={onSend} />);
  const text = screen.getByRole("textbox") as HTMLTextAreaElement;
  const form = container.querySelector("form")!;
  expect(screen.getByText(/Wpisz wiadomość, aby odblokować wysyłanie/)).toBeTruthy();
  fireEvent.submit(form);
  expect(onSend).not.toHaveBeenCalled();
  await userEvent.type(text, "  Jak zawęzić typ?  ");
  fireEvent.keyDown(text, { key: "Enter", shiftKey: true });
  fireEvent.keyDown(text, { key: "Enter", isComposing: true });
  expect(onSend).not.toHaveBeenCalled();
  fireEvent.keyDown(text, { key: "Enter" });
  expect(onSend).toHaveBeenCalledExactlyOnceWith("Jak zawęzić typ?");
  expect(text.value).toBe("  Jak zawęzić typ?  ");
  expect(text.readOnly).toBe(true);
  expect(form.getAttribute("aria-busy")).toBe("true");
  expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  fireEvent.submit(form);
  expect(onSend).toHaveBeenCalledTimes(1);
  await act(async () => confirm({ ok: true, data: null }));
  expect(text.value).toBe("");
  expect(text.readOnly).toBe(false);
  expect(screen.getByRole("status").textContent).toBe("Wiadomość wysłana.");
});

it("retains drafts for server and network errors and lets a retry succeed", async () => {
  const onSend = vi.fn().mockResolvedValueOnce({ ok: false, error: { code: "closed", message: "Sesja jest zamknięta." } })
    .mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ ok: true, data: null });
  render(<MessageComposer onSend={onSend} />);
  const text = screen.getByRole("textbox") as HTMLTextAreaElement;
  await userEvent.type(text, "Pytanie");
  await userEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("alert").textContent).toBe("Sesja jest zamknięta.");
  expect(text.value).toBe("Pytanie");
  await userEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("alert").textContent).toContain("Tekst został zachowany");
  expect(text.value).toBe("Pytanie");
  await userEvent.click(screen.getByRole("button"));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(text.value).toBe("");
});

it("explains why sending is unavailable and refuses a programmatic submit", () => {
  const onSend = vi.fn();
  const { container } = render(<MessageComposer onSend={onSend} disabledReason="Sesja jeszcze się nie rozpoczęła." />);
  const text = screen.getByRole("textbox") as HTMLTextAreaElement;
  expect(text.disabled).toBe(true);
  expect(document.getElementById(text.getAttribute("aria-describedby")!)?.textContent).toBe("Sesja jeszcze się nie rozpoczęła.");
  fireEvent.change(text, { target: { value: "Pytanie" } });
  fireEvent.submit(container.querySelector("form")!);
  expect(onSend).not.toHaveBeenCalled();
});

it("distinguishes transcript loading, failure, empty and partial data with retry", async () => {
  const onRetry = vi.fn();
  const { rerender } = render(<SessionTranscript state={{ status: "loading" }} onRetry={onRetry} />);
  expect(screen.getByRole("status").textContent).toContain("Wczytywanie rozmowy");
  rerender(<SessionTranscript state={{ status: "error", message: "Połączenie przerwane." }} onRetry={onRetry} />);
  expect(screen.getByRole("alert").textContent).toContain("Połączenie przerwane.");
  await userEvent.click(screen.getByRole("button"));
  expect(onRetry).toHaveBeenCalledOnce();
  rerender(<SessionTranscript state={{ status: "ready", messages: [] }} onRetry={onRetry} />);
  expect(screen.getByText("Nie ma jeszcze wiadomości.")).toBeTruthy();
  expect(screen.queryByRole("list")).toBeNull();
  const messages = [{ id: "one", author: "Anna", sentAt: "2026-11-13T17:00:00Z", text: "Sprawdź typ wejścia.\nDodaj test." }];
  rerender(<SessionTranscript state={{ status: "ready", messages, partial: true }} onRetry={onRetry} />);
  expect(screen.getByRole("list", { name: "Wiadomości" }).children).toHaveLength(1);
  expect(screen.getByText("Anna")).toBeTruthy();
  expect(screen.getByText(/Sprawdź typ wejścia/).textContent).toBe(messages[0].text);
  expect(screen.getByRole("alert").textContent).toContain("Widoczne wiadomości zostały zachowane");
  expect(document.querySelector("time")?.textContent).toContain("18:00");
  expect(document.querySelector("time")?.getAttribute("datetime")).toBe(messages[0].sentAt);
  rerender(<SessionTranscript state={{ status: "ready", messages }} onRetry={onRetry} timeZone="UTC" />);
  expect(screen.queryByRole("alert")).toBeNull();
  expect(document.querySelector("time")?.textContent).toContain("17:00");
});
