// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useApiResource } from "./useApiResource";

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal("fetch", fetchMock);
afterEach(() => fetchMock.mockReset());

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("useApiResource", () => {
  it("moves from loading to ready, and reloads on demand", async () => {
    fetchMock.mockResolvedValueOnce(json({ ok: true, data: [1] })).mockResolvedValueOnce(json({ ok: true, data: [1, 2] }));
    const { result } = renderHook(() => useApiResource<number[]>("/api/things"));

    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current).toMatchObject({ status: "ready", data: [1] }));

    act(() => result.current.reload());
    await waitFor(() => expect(result.current).toMatchObject({ status: "ready", data: [1, 2] }));
  });

  it("exposes the API error", async () => {
    fetchMock.mockResolvedValue(json({ ok: false, error: { code: "internal_error", message: "Coś poszło nie tak." } }, 500));
    const { result } = renderHook(() => useApiResource("/api/things"));

    await waitFor(() => expect(result.current).toMatchObject({ status: "error", error: { code: "internal_error" } }));
  });
});
