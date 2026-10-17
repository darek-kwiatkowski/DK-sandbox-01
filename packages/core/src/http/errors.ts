export type FieldErrors = Record<string, string[]>;

/**
 * Base of every expected error. Services throw these and nothing else; the
 * route layer (`apiHandler`) turns them into an HTTP status and JSON envelope.
 */
export abstract class AppError extends Error {
  abstract readonly status: number;
  abstract readonly code: string;
}

export class ValidationError extends AppError {
  readonly status = 400;
  readonly code = "validation_error";
  constructor(
    readonly fieldErrors: FieldErrors = {},
    message = "Przesłane dane są nieprawidłowe.",
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  readonly status = 401;
  readonly code = "unauthorized";
  constructor(message = "Wymagane jest zalogowanie.") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly status = 403;
  readonly code = "forbidden";
  constructor(message = "Nie masz uprawnień do wykonania tej operacji.") {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly status = 404;
  readonly code = "not_found";
  constructor(message = "Nie znaleziono zasobu.") {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly status = 409;
  readonly code = "conflict";
  constructor(
    message = "Operacja koliduje z aktualnym stanem danych.",
    readonly fieldErrors?: FieldErrors,
  ) {
    super(message);
  }
}

export class MethodNotAllowedError extends AppError {
  readonly status = 405;
  readonly code = "method_not_allowed";
  constructor(message = "Ta metoda nie jest obsługiwana dla tego zasobu.") {
    super(message);
  }
}
