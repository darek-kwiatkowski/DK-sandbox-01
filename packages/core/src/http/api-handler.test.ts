import { describe, expect, it, vi } from "vitest";
import { logger } from "../logger";
import { apiHandler, type RouteContext } from "./api-handler";
import { API_REQUEST_HEADER } from "./envelope";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "./errors";

const context: RouteContext = { params: Promise.resolve({}) };
const get = () => new Request("http://test/api/x");
const post = (headers: Record<string, string> = { [API_REQUEST_HEADER]: "1" }) =>
  new Request("http://test/api/x", { method: "POST", headers });

describe("apiHandler", () => {
  it("wraps the result in the success envelope with the configured status", async () => {
    const response = await apiHandler(() => ({ id: 1 }), { status: 201 })(post(), context);

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, data: { id: 1 } });
  });

  it.each([
    [new ValidationError({ email: ["Invalid email"] }), 400, "validation_error"],
    [new UnauthorizedError(), 401, "unauthorized"],
    [new ForbiddenError(), 403, "forbidden"],
    [new NotFoundError(), 404, "not_found"],
    [new ConflictError(), 409, "conflict"],
  ])("maps %o to its status and error code", async (error, status, code) => {
    const response = await apiHandler(() => {
      throw error;
    })(get(), context);

    expect(response.status).toBe(status);
    const body = (await response.json()) as { error: { fieldErrors?: unknown } };
    expect(body).toMatchObject({ ok: false, error: { code, message: error.message } });
    if (error instanceof ValidationError) {
      expect(body.error.fieldErrors).toEqual({ email: ["Invalid email"] });
    }
  });

  it("logs unexpected errors and returns a generic 500 without leaking details", async () => {
    const logError = vi.spyOn(logger, "error").mockImplementation(() => undefined);

    const response = await apiHandler(() => {
      throw new Error("connection string postgres://secret");
    })(get(), context);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).not.toContain("secret");
    expect(JSON.parse(text)).toEqual({ ok: false, error: { code: "internal_error", message: "Coś poszło nie tak. Spróbuj ponownie później." } });
    expect(logError).toHaveBeenCalledOnce();
    logError.mockRestore();
  });

  it("rejects state-changing requests without the API request header (CSRF)", async () => {
    const handler = vi.fn(() => "done");

    const response = await apiHandler(handler)(post({}), context);

    expect(response.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not require the header on safe methods", async () => {
    const response = await apiHandler(() => "ok")(get(), context);
    expect(response.status).toBe(200);
  });
});
