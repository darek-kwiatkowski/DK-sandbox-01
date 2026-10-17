import type { z } from "zod";
import { ValidationError, type FieldErrors } from "./errors";

/** Parses untrusted input with a schema; returns only the schema's typed output (no mass assignment). */
export function parseInput<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(toFieldErrors(result.error));
  }
  return result.data;
}

/** Reads a JSON body; malformed JSON is a validation error, not a 500. */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError({}, "Treść żądania musi być poprawnym JSON-em.");
  }
}

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join(".") : "_form";
    (fieldErrors[field] ??= []).push(issue.message);
  }
  return fieldErrors;
}
