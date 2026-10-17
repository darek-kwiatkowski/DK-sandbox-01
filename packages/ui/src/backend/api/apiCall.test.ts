// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiCall, apiCallOrThrow, ApiCallError, readJsonSafe } from "./apiCall";
import { API_REQUEST_HEADER } from "./types";

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", fetchMock);
afterEach(() => fetchMock.mockReset());

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("apiCall", () => {
  it("sends the API request header, same-origin credentials and a JSON body", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, data: { id: 1 } }, 201));

    const result = await apiCall("/api/things", { method: "POST", json: { name: "Ada" } });

    expect(result).toEqual({ ok: true, data: { id: 1 } });
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = new Headers(init?.headers);
    expect(headers.get(API_REQUEST_HEADER)).toBe("1");
    expect(headers.get("content-type")).toBe("application/json");
    expect(init?.credentials).toBe("same-origin");
    expect(init?.body).toBe(JSON.stringify({ name: "Ada" }));
  });

  it("passes the server's error envelope through", async () => {
    const failure = { ok: false, error: { code: "validation_error", message: "Invalid", fieldErrors: { name: ["Required"] } } };
    fetchMock.mockResolvedValue(jsonResponse(failure, 400));

    await expect(apiCall("/api/things")).resolves.toEqual(failure);
  });

  it("turns a non-JSON error page into a typed failure instead of throwing", async () => {
    fetchMock.mockResolvedValue(new Response("<html>Bad gateway</html>", { status: 502 }));

    const result = await apiCall("/api/things");

    expect(result).toMatchObject({ ok: false, error: { code: "http_502" } });
  });

  it("turns a network failure into a typed failure", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(apiCall("/api/things")).resolves.toMatchObject({ ok: false, error: { code: "network_error" } });
  });

  it("refuses to call anything outside /api/*", async () => {
    await expect(apiCall("https://evil.example/api/x")).rejects.toThrow(/only calls the app's own API/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("apiCallOrThrow", () => {
  it("returns data on success and throws ApiCallError on failure", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, data: [1, 2] }));
    await expect(apiCallOrThrow("/api/things")).resolves.toEqual([1, 2]);

    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: false, error: { code: "not_found", message: "Missing" } }, 404));
    await expect(apiCallOrThrow("/api/things/1")).rejects.toBeInstanceOf(ApiCallError);
  });
});

describe("readJsonSafe", () => {
  it("returns undefined for an empty body", async () => {
    await expect(readJsonSafe(new Response(null, { status: 204 }))).resolves.toBeUndefined();
  });
});
