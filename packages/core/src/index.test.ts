import { describe, expect, it } from "vitest";
import * as core from "./index";

describe("@devmentor/core public API", () => {
  it("exposes the container, HTTP layer, auth helpers, logger and services", () => {
    expect(Object.keys(core).sort()).toEqual(
      [
        "API_REQUEST_HEADER",
        "AppError",
        "ConflictError",
        "ForbiddenError",
        "MethodNotAllowedError",
        "NotFoundError",
        "SESSION_COOKIE_NAME",
        "UnauthorizedError",
        "UserService",
        "ValidationError",
        "apiHandler",
        "assertOwnership",
        "createAppContainer",
        "createSessionToken",
        "getEnv",
        "logger",
        "makeCrudRoute",
        "parseInput",
        "readJsonBody",
        "requireRole",
        "requireSession",
        "sessionCookieOptions",
        "withScope",
      ].sort(),
    );
  });
});
