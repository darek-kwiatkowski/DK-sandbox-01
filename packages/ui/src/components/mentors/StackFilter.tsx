"use client";

import { X } from "lucide-react";

import { Button } from "@devmentor/ui/components/ui/button";
import { Checkbox } from "@devmentor/ui/components/ui/checkbox";
import { Field, FieldLabel, FieldLegend, FieldSet } from "@devmentor/ui/components/ui/field";

export interface StackFilterProps {
  /** All tags of the beachhead pool (R13). */
  tags: readonly string[];
  selected: readonly string[];
  onChange: (selected: string[]) => void;
  /** Number of mentors matching the current filter; null while loading. */
  resultCount: number | null;
}

/**
 * Stack filter of the mentor list (R13: filter by stack tag, no search, no ranking). Shows the result count
 * and the active filters as removable buttons, each named by its tag.
 */
export function StackFilter({ tags, selected, onChange, resultCount }: Readonly<StackFilterProps>) {
  const toggle = (tag: string, on: boolean) => onChange(on ? [...selected, tag] : selected.filter((t) => t !== tag));
  return (
    <div className="flex flex-col gap-between-groups">
      <FieldSet>
        <FieldLegend variant="label">Stack</FieldLegend>
        <div data-slot="checkbox-group" className="flex flex-wrap gap-x-6 gap-y-3">
          {tags.map((tag) => (
            <Field key={tag} orientation="horizontal" className="w-auto">
              <Checkbox id={`stack-${tag}`} checked={selected.includes(tag)} onCheckedChange={(on) => toggle(tag, on === true)} />
              <FieldLabel htmlFor={`stack-${tag}`}>{tag}</FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
      <div className="flex flex-wrap items-center gap-in-group text-sm">
        <p role="status" className="tabular-nums">
          {resultCount === null ? "Wczytywanie…" : `Wyniki: ${resultCount}`}
        </p>
        {selected.length > 0 ? (
          <>
            <ul aria-label="Aktywne filtry" className="flex flex-wrap gap-1">
              {selected.map((tag) => (
                <li key={tag}>
                  <Button variant="outline" size="sm" onClick={() => toggle(tag, false)} aria-label={`Usuń filtr: ${tag}`}>
                    {tag}
                    <X aria-hidden="true" data-icon="inline-end" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button variant="link" onClick={() => onChange([])}>
              Wyczyść filtry
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
