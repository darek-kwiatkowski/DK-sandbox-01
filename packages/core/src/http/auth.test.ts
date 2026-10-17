import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetEnvCache } from "../config/env";
import {
  assertOwnership,
  createSessionToken,
  requireRole,
  requireSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  type Session,
} from "./auth";
import { ForbiddenError, UnauthorizedError } from "./errors";

const SECRET = "test-secret-that-is-definitely-longer-than-32-bytes";
const session: Session = { userId: "6f1c1d7e-3a3b-4a8a-9b55-0d8f4a2f6c11", role: "student" };
const withCookie = (token: string) =>
  new Request("http://test", { headers: { cookie: `other=1; ${SESSION_COOKIE_NAME}=${token}` } });

describe("session auth", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = SECRET;
    resetEnvCache();
  });
  afterEach(() => {
    delete process.env.AUTH_SECRET;
    resetEnvCache();
  });

  it("round-trips a session through the cookie", async () => {
    const token = await createSessionToken(session);
    await expect(requireSession(withCookie(token))).resolves.toEqual(session);
  });

  it("rejects a request without a session cookie", async () => {
    await expect(requireSession(new Request("http://test"))).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("rejects a request whose cookies do not include the session cookie", async () => {
    const request = new Request("http://test", { headers: { cookie: "theme=dark; flag; other=1" } });
    await expect(requireSession(request)).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("finds the session cookie among malformed and URL-encoded cookie parts", async () => {
    const token = await createSessionToken(session);
    const request = new Request("http://test", {
      headers: { cookie: `flag; ${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
    });
    await expect(requireSession(request)).resolves.toEqual(session);
  });

  it("rejects a token signed with another secret", async () => {
    const forged = await new SignJWT({ role: "mentor" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.userId)
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("another-secret-that-is-also-longer-than-32-bytes"));
    await expect(requireSession(withCookie(forged))).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("rejects an expired token", async () => {
    const expired = await new SignJWT({ role: "student" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.userId)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(new TextEncoder().encode(SECRET));
    await expect(requireSession(withCookie(expired))).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("rejects an unsigned (alg: none) token", async () => {
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const unsigned = `${encode({ alg: "none" })}.${encode({ sub: session.userId, role: "mentor" })}.`;
    await expect(requireSession(withCookie(unsigned))).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("rejects a validly signed token with unexpected claims", async () => {
    const wrongRole = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.userId)
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));
    await expect(requireSession(withCookie(wrongRole))).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("fails closed when AUTH_SECRET is not configured", async () => {
    const token = await createSessionToken(session);
    delete process.env.AUTH_SECRET;
    resetEnvCache();
    await expect(requireSession(withCookie(token))).rejects.toThrow("AUTH_SECRET is not configured.");
  });

  it("rejects a too short AUTH_SECRET at startup validation", async () => {
    process.env.AUTH_SECRET = "short";
    resetEnvCache();
    await expect(createSessionToken(session)).rejects.toThrow(/at least 32 bytes/);
  });

  it("uses httpOnly, sameSite=lax cookies scoped to the whole app", () => {
    expect(sessionCookieOptions()).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
  });
});

describe("authorization helpers", () => {
  it("requireRole allows the matching role and forbids others", () => {
    expect(() => requireRole(session, "student")).not.toThrow();
    expect(() => requireRole(session, "mentor")).toThrow(ForbiddenError);
  });

  it("assertOwnership forbids other owners and fails closed on a missing owner", () => {
    expect(() => assertOwnership(session, session.userId)).not.toThrow();
    expect(() => assertOwnership(session, "a0a0a0a0-0000-4000-8000-000000000000")).toThrow(ForbiddenError);
    expect(() => assertOwnership(session, null)).toThrow(ForbiddenError);
    expect(() => assertOwnership(session, undefined)).toThrow(ForbiddenError);
  });
});
