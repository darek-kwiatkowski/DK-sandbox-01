import { logger } from "../logger";
import { API_REQUEST_HEADER, type ApiFailure, type ApiSuccess } from "./envelope";
import { AppError, ForbiddenError } from "./errors";

/** Second argument Next.js passes to route handlers (dynamic segments as a promise). */
export type RouteContext = { params: Promise<Record<string, string | string[] | undefined>> };

export type RouteHandler = (request: Request, context: RouteContext) => Promise<Response>;

export interface ApiHandlerOptions {
  /** HTTP status of a successful response (default 200). */
  status?: number;
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Wraps a route function: enforces the CSRF header on state-changing requests,
 * maps thrown `AppError`s to their status and the JSON envelope, and logs any
 * other failure without leaking it to the client. Routes never write their own
 * try/catch.
 */
export function apiHandler<T>(
  handler: (request: Request, context: RouteContext) => Promise<T> | T,
  options: ApiHandlerOptions = {},
): RouteHandler {
  return async (request, context) => {
    try {
      if (!SAFE_METHODS.has(request.method) && request.headers.get(API_REQUEST_HEADER) !== "1") {
        throw new ForbiddenError("Brak wymaganego nagłówka żądania.");
      }
      const data = await handler(request, context);
      return Response.json({ ok: true, data } satisfies ApiSuccess<T>, { status: options.status ?? 200 });
    } catch (error) {
      return errorResponse(error, request);
    }
  };
}

function errorResponse(error: unknown, request: Request): Response {
  if (error instanceof AppError) {
    const fieldErrors = "fieldErrors" in error ? (error.fieldErrors as ApiFailure["error"]["fieldErrors"]) : undefined;
    const body: ApiFailure = {
      ok: false,
      error: { code: error.code, message: error.message, ...(fieldErrors ? { fieldErrors } : {}) },
    };
    return Response.json(body, { status: error.status });
  }
  logger.error({ err: error, method: request.method, url: request.url }, "unhandled error in API route");
  const body: ApiFailure = { ok: false, error: { code: "internal_error", message: "Coś poszło nie tak. Spróbuj ponownie później." } };
  return Response.json(body, { status: 500 });
}
