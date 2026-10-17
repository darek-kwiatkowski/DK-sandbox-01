// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiCall } from "./apiCall";
import { useApiResource } from "./useApiResource";

vi.mock("./apiCall", () => ({ apiCall: vi.fn() }));

/**
 * A thenable that rejects synchronously and records what the rejection handler
 * throws, so a rethrown error is observable without an unhandled rejection.
 */
function rejectingWith(reason: unknown) {
  const outcome: { thrown?: unknown } = {};
  const thenable = {
    then(_onFulfilled: unknown, onRejected: (error: unknown) => unknown) {
      try {
        onRejected(reason);
      } catch (error) {
        outcome.thrown = error;
      }
    },
  };
  return { thenable: thenable as unknown as ReturnType<typeof apiCall>, outcome };
}

afterEach(() => vi.mocked(apiCall).mockReset());

describe("useApiResource rejections", () => {
  it("passes the abort signal and ignores aborts (e.g. after unmount)", () => {
    const { thenable, outcome } = rejectingWith(new DOMException("aborted", "AbortError"));
    vi.mocked(apiCall).mockReturnValue(thenable);

    const { result, unmount } = renderHook(() => useApiResource("/api/things"));

    expect(outcome.thrown).toBeUndefined();
    expect(result.current.status).toBe("loading");
    const signal = vi.mocked(apiCall).mock.calls[0]![1]!.signal!;
    expect(signal.aborted).toBe(false);
    unmount();
    expect(signal.aborted).toBe(true);
  });

  it("does not swallow unexpected errors", () => {
    const failure = new Error("apiCall only calls the app's own API");
    const { thenable, outcome } = rejectingWith(failure);
    vi.mocked(apiCall).mockReturnValue(thenable);

    renderHook(() => useApiResource("/api/things"));

    expect(outcome.thrown).toBe(failure);
  });

  it("does not treat other DOMExceptions as aborts", () => {
    const failure = new DOMException("quota", "QuotaExceededError");
    const { thenable, outcome } = rejectingWith(failure);
    vi.mocked(apiCall).mockReturnValue(thenable);

    renderHook(() => useApiResource("/api/things"));

    expect(outcome.thrown).toBe(failure);
  });
});
