import { z } from "zod";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEnvCache } from "../config/env";
import type { RouteContext } from "./api-handler";
import { createSessionToken, SESSION_COOKIE_NAME } from "./auth";
import { API_REQUEST_HEADER } from "./envelope";
import { makeCrudRoute } from "./make-crud-route";

const ID = "6f1c1d7e-3a3b-4a8a-9b55-0d8f4a2f6c11";
const noParams: RouteContext = { params: Promise.resolve({}) };
const withId = (id: string): RouteContext => ({ params: Promise.resolve({ id }) });
const request = (method: string, body?: unknown, headers: Record<string, string> = {}) =>
  new Request("http://test/api/things", {
    method,
    headers: { [API_REQUEST_HEADER]: "1", ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

const createSchema = z.object({ name: z.string().min(1) });

describe("makeCrudRoute", () => {
  it("answers 405 for methods that are not configured", async () => {
    const run = vi.fn();
    const { POST, PUT, DELETE } = makeCrudRoute({ access: "public", list: run });

    for (const handler of [POST, PUT, DELETE]) {
      const response = await handler(request("POST", {}), noParams);
      expect(response.status).toBe(405);
      expect(((await response.json()) as { error: { code: string } }).error.code).toBe("method_not_allowed");
    }
    expect(run).not.toHaveBeenCalled();
  });

  it("refuses to combine collection `list` with item `read`", () => {
    expect(() => makeCrudRoute({ access: "public", list: async () => [], read: async () => null })).toThrow(
      /mutually exclusive/,
    );
  });

  it("lists through the service on a public route", async () => {
    const { GET } = makeCrudRoute({ access: "public", list: async () => [{ name: "a" }] });
    const response = await GET(request("GET"), noParams);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, data: [{ name: "a" }] });
  });

  it("creates with 201 and passes only schema-parsed fields to the service", async () => {
    const run = vi.fn(async (_ctx, input: z.output<typeof createSchema>) => ({ id: ID, ...input }));
    const { POST } = makeCrudRoute({ access: "public", create: { schema: createSchema, run } });

    const response = await POST(request("POST", { name: "Ada", id: "attacker-id", role: "mentor" }), noParams);

    expect(response.status).toBe(201);
    expect(run.mock.calls[0]![1]).toEqual({ name: "Ada" });
  });

  it("returns 400 with field errors for an invalid body and never calls the service", async () => {
    const run = vi.fn();
    const { POST } = makeCrudRoute({ access: "public", create: { schema: createSchema, run } });

    const response = await POST(request("POST", { name: "" }), noParams);

    expect(response.status).toBe(400);
    expect(((await response.json()) as { error: { fieldErrors: object } }).error.fieldErrors).toHaveProperty("name");
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects a non-UUID id on item routes", async () => {
    const remove = vi.fn();
    const { DELETE } = makeCrudRoute({ access: "public", remove });

    const response = await DELETE(request("DELETE"), withId("1 OR 1=1"));

    expect(response.status).toBe(400);
    expect(remove).not.toHaveBeenCalled();
  });

  it("updates and deletes by id", async () => {
    const update = vi.fn(async (_ctx, id: string, input: unknown) => ({ id, ...(input as object) }));
    const remove = vi.fn(async () => undefined);
    const { PUT, DELETE } = makeCrudRoute({ access: "public", update: { schema: createSchema, run: update }, remove });

    expect(await (await PUT(request("PUT", { name: "New" }), withId(ID))).json()).toEqual({
      ok: true,
      data: { id: ID, name: "New" },
    });
    expect(await (await DELETE(request("DELETE"), withId(ID))).json()).toEqual({ ok: true, data: null });
    expect(remove).toHaveBeenCalledWith(expect.anything(), ID);
  });

  describe("with access: session", () => {
    beforeEach(() => {
      process.env.AUTH_SECRET = "test-secret-that-is-definitely-longer-than-32-bytes";
      resetEnvCache();
    });
    afterEach(() => {
      delete process.env.AUTH_SECRET;
      resetEnvCache();
    });

    it("returns 401 before validating input or touching the service", async () => {
      const run = vi.fn();
      const { POST } = makeCrudRoute({ access: "session", create: { schema: createSchema, run } });

      const response = await POST(request("POST", { name: "" }), noParams);

      expect(response.status).toBe(401);
      expect(run).not.toHaveBeenCalled();
    });

    it("passes the verified session to the service", async () => {
      const token = await createSessionToken({ userId: ID, role: "mentor" });
      const list = vi.fn(async ({ session }) => session);
      const { GET } = makeCrudRoute({ access: "session", list });

      const response = await GET(request("GET", undefined, { cookie: `${SESSION_COOKIE_NAME}=${token}` }), noParams);

      expect(await response.json()).toEqual({ ok: true, data: { userId: ID, role: "mentor" } });
    });
  });
});
