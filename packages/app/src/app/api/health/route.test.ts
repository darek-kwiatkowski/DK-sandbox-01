import { describe, expect, it } from "vitest";
import { dynamic, GET } from "./route";

describe("api/health route", () => {
  it("is force-dynamic", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("answers liveness in the JSON envelope", async () => {
    const response = await GET(new Request("http://test/api/health"), { params: Promise.resolve({}) });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, data: { status: "ok" } });
  });
});
