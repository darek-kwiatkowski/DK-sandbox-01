// Mirrors the JSON envelope of @devmentor/core's apiHandler. ui must not
// import core, so the shape is declared on both sides: change them together.
export type FieldErrors = Record<string, string[]>;
export type ApiError = { code: string; message: string; fieldErrors?: FieldErrors };
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

/** Sent on every request; the server rejects state-changing requests without it (CSRF defense). */
export const API_REQUEST_HEADER = "x-devmentor-request";
