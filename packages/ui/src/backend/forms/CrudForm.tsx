"use client";

import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import type { z } from "zod";
import { Button } from "@devmentor/ui/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Input } from "@devmentor/ui/components/ui/input";
import type { ApiResult, FieldErrors } from "../api/types";

export interface CrudFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "url";
  description?: string;
  autoComplete?: string;
}

export interface CrudFormProps<S extends z.ZodType> {
  /** The same schema the API route validates with. Inputs are strings: use `z.coerce` for numbers. */
  schema: S;
  fields: readonly CrudFormField[];
  defaultValues?: Readonly<Record<string, string>>;
  onSubmit: (values: z.output<S>) => Promise<ApiResult<unknown>>;
  onSuccess?: (data: unknown) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const FORM_ERROR_KEY = "_form";

/**
 * Schema-driven create/edit form: validates on the client with the shared
 * schema, shows server `fieldErrors` next to their fields, Cmd/Ctrl+Enter
 * submits, Escape cancels.
 */
export function CrudForm<S extends z.ZodType>({
  schema,
  fields,
  defaultValues = {},
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = "Zapisz",
  cancelLabel = "Anuluj",
}: Readonly<CrudFormProps<S>>) {
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, defaultValues[field.name] ?? ""])),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(issuesToFieldErrors(parsed.error.issues));
      setFormError(null);
      return;
    }
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    try {
      const result = await onSubmit(parsed.data);
      if (result.ok) {
        onSuccess?.(result.data);
        return;
      }
      setFieldErrors(result.error.fieldErrors ?? {});
      setFormError(result.error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    } else if (event.key === "Escape" && onCancel) {
      event.preventDefault();
      onCancel();
    }
  }

  const generalErrors = fieldErrors[FORM_ERROR_KEY] ?? [];

  return (
    <form noValidate onSubmit={handleSubmit} onKeyDown={handleKeyDown} aria-busy={isSubmitting}>
      <FieldGroup>
        {fields.map((field) => {
          const inputId = `${formId}-${field.name}`;
          const errorId = `${inputId}-error`;
          const errors = fieldErrors[field.name];
          return (
            <Field key={field.name} data-invalid={errors ? true : undefined}>
              <FieldLabel htmlFor={inputId}>{field.label}</FieldLabel>
              <Input
                id={inputId}
                name={field.name}
                type={field.type ?? "text"}
                autoComplete={field.autoComplete}
                value={values[field.name] ?? ""}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                aria-invalid={errors ? true : undefined}
                aria-describedby={errors ? errorId : undefined}
                disabled={isSubmitting}
              />
              {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
              <FieldError id={errorId} errors={errors?.map((message) => ({ message }))} />
            </Field>
          );
        })}
        {formError || generalErrors.length > 0 ? (
          <p role="alert" className="text-sm text-destructive">
            {[formError, ...generalErrors].filter(Boolean).join(" ")}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie…" : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

function issuesToFieldErrors(issues: readonly z.core.$ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : FORM_ERROR_KEY;
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}
