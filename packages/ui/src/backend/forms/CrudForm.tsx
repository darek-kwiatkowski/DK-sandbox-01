"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { z } from "zod";
import { Button } from "@devmentor/ui/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@devmentor/ui/components/ui/field";
import { Input } from "@devmentor/ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devmentor/ui/components/ui/select";
import { Textarea } from "@devmentor/ui/components/ui/textarea";
import type { ApiResult, FieldErrors } from "../api/types";

export interface CrudFormOption {
  value: string;
  label: string;
}

export interface CrudFormField {
  name: string;
  label: string;
  /**
   * `textarea` for descriptions and notes, `select` for one value from `options`, `money` for an amount
   * in PLN typed as text (the schema parses it; platform primitives P18).
   */
  type?: "text" | "email" | "password" | "number" | "url" | "textarea" | "select" | "money";
  description?: string;
  autoComplete?: string;
  /** Choices of a `select` field. */
  options?: readonly CrudFormOption[];
  /** Example shown before typing; never the label (WCAG 3.3.2). */
  placeholder?: string;
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
  /** `outline` when another control on the screen is the main action, e.g. GitHub sign-in on /login (K3). */
  submitVariant?: "default" | "outline";
}

const FORM_ERROR_KEY = "_form";

/**
 * Schema-driven create/edit form: validates a field with the shared schema when the user leaves it and
 * the whole form on submit, shows server `fieldErrors` next to their fields, moves focus to the first
 * error after a failed submit, keeps typed values, blocks double submits, reports success only after the
 * server confirms. Cmd/Ctrl+Enter submits, Escape cancels.
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
  submitVariant = "default",
}: Readonly<CrudFormProps<S>>) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.name, defaultValues[field.name] ?? ""])),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);

  // After a failed submit the controls are enabled again; then focus the first invalid field, or the
  // form-level message when no field is to blame (WCAG 3.3.1).
  useEffect(() => {
    if (focusRequest === 0 || isSubmitting) {
      return;
    }
    const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-form-error]');
    target?.focus();
  }, [focusRequest, isSubmitting]);

  function validateField(name: string) {
    const parsed = schema.safeParse(values);
    const messages = parsed.success ? [] : parsed.error.issues.filter((issue) => issue.path.join(".") === name).map((issue) => issue.message);
    setFieldErrors((current) => {
      const next = { ...current };
      if (messages.length > 0) {
        next[name] = messages;
      } else {
        delete next[name];
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(issuesToFieldErrors(parsed.error.issues));
      setFormError(null);
      setFocusRequest((value) => value + 1);
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
      setFocusRequest((value) => value + 1);
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

  const setValue = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const generalErrors = fieldErrors[FORM_ERROR_KEY] ?? [];

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} onKeyDown={handleKeyDown} aria-busy={isSubmitting}>
      <FieldGroup>
        {fields.map((field) => {
          const inputId = `${formId}-${field.name}`;
          const errorId = `${inputId}-error`;
          const descriptionId = `${inputId}-description`;
          const errors = fieldErrors[field.name];
          const describedBy = [field.description ? descriptionId : null, errors ? errorId : null].filter(Boolean).join(" ") || undefined;
          const common = {
            id: inputId,
            "aria-invalid": errors ? true : undefined,
            "aria-describedby": describedBy,
            disabled: isSubmitting,
          };
          return (
            <Field key={field.name} data-invalid={errors ? true : undefined}>
              <FieldLabel htmlFor={inputId}>{field.label}</FieldLabel>
              {field.type === "textarea" ? (
                <Textarea
                  {...common}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  onBlur={() => validateField(field.name)}
                />
              ) : field.type === "select" ? (
                <Select
                  name={field.name}
                  value={values[field.name] || undefined}
                  onValueChange={(value) => setValue(field.name, value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger {...common} className="w-full" onBlur={() => validateField(field.name)}>
                    <SelectValue placeholder={field.placeholder ?? "Wybierz"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "money" ? (
                <div className="flex items-center gap-in-group">
                  <Input
                    {...common}
                    name={field.name}
                    type="text"
                    inputMode="decimal"
                    placeholder={field.placeholder}
                    className="max-w-40 text-right tabular-nums"
                    value={values[field.name]}
                    onChange={(event) => setValue(field.name, event.target.value)}
                    onBlur={() => validateField(field.name)}
                  />
                  <span className="text-sm text-muted-foreground">zł</span>
                </div>
              ) : (
                <Input
                  {...common}
                  name={field.name}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={values[field.name]}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  onBlur={() => validateField(field.name)}
                />
              )}
              {field.description ? <FieldDescription id={descriptionId}>{field.description}</FieldDescription> : null}
              <FieldError id={errorId} errors={errors?.map((message) => ({ message }))} />
            </Field>
          );
        })}
        {formError || generalErrors.length > 0 ? (
          <p role="alert" tabIndex={-1} data-form-error className="text-sm text-destructive outline-none">
            {[formError, ...generalErrors].filter(Boolean).join(" ")}
          </p>
        ) : null}
        <div className="flex flex-col-reverse gap-in-group sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button type="submit" variant={submitVariant} disabled={isSubmitting} aria-busy={isSubmitting || undefined}>
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
