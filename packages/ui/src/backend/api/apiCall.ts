import { API_REQUEST_HEADER, type ApiError, type ApiResult } from "./types";

export interface ApiCallInit extends Omit<RequestInit, "body"> {
  /** JSON-serializable request body. */
  json?: unknown;
}

export class ApiCallError extends Error {
  constructor(readonly error: ApiError) {
    super(error.message);
  }
}

const NETWORK_ERROR: ApiError = { code: "network_error", message: "Brak połączenia z serwerem. Spróbuj ponownie." };

/**
 * The only sanctioned `fetch()` to `/api/*`. Never throws for HTTP or network
 * failures: always resolves to a typed `ApiResult`.
 */
export async function apiCall<T>(path: string, init: ApiCallInit = {}): Promise<ApiResult<T>> {
  if (!path.startsWith("/api/")) {
    throw new Error(`apiCall only calls the app's own API (/api/*), got "${path}".`);
  }
  const { json, headers, ...rest } = init;
  const requestHeaders = new Headers(headers);
  requestHeaders.set(API_REQUEST_HEADER, "1");
  requestHeaders.set("accept", "application/json");
  if (json !== undefined) {
    requestHeaders.set("content-type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(path, {
      credentials: "same-origin",
      ...rest,
      headers: requestHeaders,
      ...(json === undefined ? {} : { body: JSON.stringify(json) }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return { ok: false, error: NETWORK_ERROR };
  }

  const payload = await readJsonSafe(response);
  if (isApiResult<T>(payload)) {
    return payload;
  }
  return {
    ok: false,
    error: {
      code: response.ok ? "invalid_response" : `http_${response.status}`,
      message: "Serwer zwrócił nieoczekiwaną odpowiedź.",
    },
  };
}

/** Like `apiCall`, but returns `data` directly and throws `ApiCallError` on failure. */
export async function apiCallOrThrow<T>(path: string, init?: ApiCallInit): Promise<T> {
  const result = await apiCall<T>(path, init);
  if (!result.ok) {
    throw new ApiCallError(result.error);
  }
  return result.data;
}

/** Parses a response body as JSON; an empty or non-JSON body yields `undefined` instead of throwing. */
export async function readJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

function isApiResult<T>(value: unknown): value is ApiResult<T> {
  if (typeof value !== "object" || value === null || !("ok" in value)) {
    return false;
  }
  if (value.ok === true) {
    return "data" in value;
  }
  if (value.ok === false && "error" in value) {
    const error = value.error;
    return typeof error === "object" && error !== null && "code" in error && "message" in error;
  }
  return false;
}
