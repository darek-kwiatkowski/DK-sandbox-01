import type { FieldErrors } from "./errors";

// The JSON envelope every API route returns. `@devmentor/ui` declares the same
// shape on its side (ui must not import core): change both together.
export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: { code: string; message: string; fieldErrors?: FieldErrors } };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

/** Header that `apiCall` sends on every request; required on state-changing requests (CSRF defense). */
export const API_REQUEST_HEADER = "x-devmentor-request";
