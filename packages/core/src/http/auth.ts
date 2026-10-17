import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";
import { getEnv } from "../config/env";
import { ForbiddenError, UnauthorizedError } from "./errors";

export const SESSION_COOKIE_NAME = "devmentor_session";
// Short-lived on purpose: there is no refresh-token flow in MVP scope.
export const SESSION_TTL_SECONDS = 24 * 60 * 60;
const JWT_ALGORITHM = "HS256";

const sessionSchema = z.object({
  sub: z.uuid(),
  role: z.enum(["student", "mentor"]),
});
export type Session = { userId: string; role: z.infer<typeof sessionSchema>["role"] };

/** Cookie attributes for the session token; keep them when touching auth-cookie code. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: getEnv().NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

function secretKey(): Uint8Array {
  const secret = getEnv().AUTH_SECRET;
  if (!secret) {
    // Fail closed: a misconfigured server rejects every session (logged as a 500).
    throw new Error("AUTH_SECRET is not configured.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ role: session.role })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

/** Returns the verified session from the request cookie or throws `UnauthorizedError`. */
export async function requireSession(request: Request): Promise<Session> {
  const token = readCookie(request, SESSION_COOKIE_NAME);
  if (!token) {
    throw new UnauthorizedError();
  }
  const key = secretKey();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: [JWT_ALGORITHM] });
    const claims = sessionSchema.parse(payload);
    return { userId: claims.sub, role: claims.role };
  } catch {
    // Any verification problem (bad signature, expiry, claims) denies access.
    throw new UnauthorizedError();
  }
}

export function requireRole(session: Session, role: Session["role"]): void {
  if (session.role !== role) {
    throw new ForbiddenError();
  }
}

/** Ownership check for a specific record (no insecure direct object references). */
export function assertOwnership(session: Session, ownerId: string | null | undefined): void {
  if (!ownerId || ownerId !== session.userId) {
    throw new ForbiddenError();
  }
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) {
    return undefined;
  }
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator !== -1 && part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return undefined;
}
