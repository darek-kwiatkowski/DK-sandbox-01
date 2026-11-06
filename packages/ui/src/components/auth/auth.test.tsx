// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthMessage } from "./AuthMessage";
import { AUTH_ERROR_MESSAGES, authErrorMessage, authNoticeMessage, GENERIC_ERROR_MESSAGE } from "./auth-messages";
import { GitHubButton } from "./GitHubButton";
import { SignOutButton } from "./SignOutButton";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const respond = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));

describe("auth messages", () => {
  it("maps every known error code and falls back to the generic message", () => {
    for (const [code, message] of Object.entries(AUTH_ERROR_MESSAGES)) {
      expect(authErrorMessage(code)).toBe(message);
    }
    expect(authErrorMessage("unknown")).toBe(GENERIC_ERROR_MESSAGE);
    expect(authNoticeMessage("github_linked")).toMatch(/Połączyliśmy konto z GitHub/);
    expect(authNoticeMessage("unknown")).toBeNull();
  });
});

describe("AuthMessage", () => {
  it("announces an error as an alert", () => {
    render(<AuthMessage error="github_denied" notice="github_linked" />);
    expect(screen.getByRole("alert").textContent).toBe("Logowanie przez GitHub zostało anulowane.");
  });

  it("shows a known notice politely and nothing for unknown or missing codes", () => {
    const { rerender, container } = render(<AuthMessage notice="github_linked" />);
    expect(screen.getByRole("status").textContent).toMatch(/Połączyliśmy konto/);
    rerender(<AuthMessage notice="unknown" />);
    expect(container.textContent).toBe("");
    rerender(<AuthMessage />);
    expect(container.textContent).toBe("");
  });
});

describe("GitHubButton", () => {
  it("is a real link to the OAuth start with the GitHub mark", () => {
    render(<GitHubButton href="/api/auth/github/start" />);
    const link = screen.getByRole("link", { name: "Zaloguj się przez GitHub" });
    expect(link.getAttribute("href")).toBe("/api/auth/github/start");
    expect(link.dataset.variant).toBe("default");
    expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("can connect an account as a secondary action", () => {
    render(
      <GitHubButton href="/api/auth/github/start?link=1" variant="outline">
        Połącz konto GitHub
      </GitHubButton>,
    );
    expect(screen.getByRole("link", { name: "Połącz konto GitHub" }).dataset.variant).toBe("outline");
  });
});

describe("SignOutButton", () => {
  it("revokes the session and navigates with a full page load", async () => {
    const fetch = respond({ ok: true, data: null });
    vi.stubGlobal("fetch", fetch);
    const navigate = vi.fn();
    render(<SignOutButton navigate={navigate} redirectTo="/" />);
    const button = screen.getByRole("button", { name: "Wyloguj się" });
    expect(button).toHaveProperty("textContent", "Wyloguj się");
    await userEvent.click(button);
    expect(fetch).toHaveBeenCalledWith("/api/auth/logout", expect.objectContaining({ method: "POST" }));
    expect(navigate).toHaveBeenCalledWith("/");
    expect(screen.getByRole("button").textContent).toBe("Wylogowywanie…");
  });

  it("keeps the user signed in and says so when sign-out fails", async () => {
    vi.stubGlobal("fetch", respond({ ok: false, error: { code: "internal", message: "Coś poszło nie tak…" } }, 500));
    const navigate = vi.fn();
    render(<SignOutButton navigate={navigate} />);
    await userEvent.click(screen.getByRole("button", { name: "Wyloguj się" }));
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toBe("Coś poszło nie tak…");
    expect(screen.getByRole("button", { name: "Wyloguj się" })).toHaveProperty("disabled", false);
  });

  it("navigates with window.location by default", async () => {
    vi.stubGlobal("fetch", respond({ ok: true, data: null }));
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    render(<SignOutButton />);
    await userEvent.click(screen.getByRole("button", { name: "Wyloguj się" }));
    expect(assign).toHaveBeenCalledWith("/login");
  });
});
