// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiCall } from "./apiCall";

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", fetchMock);
afterEach(() => fetchMock.mockReset());

const respondWith = (body: string, status = 200) => fetchMock.mockResolvedValue(new Response(body, { status }));

describe("apiCall envelope handling", () => {
  it("rethrows an abort so callers can cancel requests", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation was aborted.", "AbortError"));

    await expect(apiCall("/api/things")).rejects.toMatchObject({ name: "AbortError" });
  });

  it.each([
    ["null", "null"],
    ["a primitive", "42"],
    ["an object without ok", JSON.stringify({ data: [] })],
    ["ok: true without data", JSON.stringify({ ok: true })],
    ["ok: false without error", JSON.stringify({ ok: false })],
    ["ok: false with a null error", JSON.stringify({ ok: false, error: null })],
    ["ok: false with an error missing code", JSON.stringify({ ok: false, error: { message: "x" } })],
    ["ok: false with an error missing message", JSON.stringify({ ok: false, error: { code: "x" } })],
    ["ok of another type", JSON.stringify({ ok: "yes", data: 1 })],
  ])("rejects %s as an invalid response", async (_label, body) => {
    respondWith(body);

    await expect(apiCall("/api/things")).resolves.toEqual({
      ok: false,
      error: { code: "invalid_response", message: "Serwer zwrócił nieoczekiwaną odpowiedź." },
    });
  });

  it("forwards custom headers and request options", async () => {
    respondWith(JSON.stringify({ ok: true, data: null }));

    await apiCall("/api/things", { method: "DELETE", headers: { "x-trace": "abc" } });

    const [path, init] = fetchMock.mock.calls[0]!;
    expect(path).toBe("/api/things");
    expect(init?.method).toBe("DELETE");
    expect(init).not.toHaveProperty("body");
    const headers = new Headers(init?.headers);
    expect(headers.get("x-trace")).toBe("abc");
    expect(headers.get("content-type")).toBeNull();
  });
});
