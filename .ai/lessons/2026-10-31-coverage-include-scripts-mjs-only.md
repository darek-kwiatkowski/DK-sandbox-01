# Unit coverage counts only `scripts/**/*.mjs`

- **Date:** 2026-10-31
- **Context:** spec review for the `operator:grant` CLI (E01-S01).
- **Finding:** `vitest.config.ts` `coverage.include` covers `scripts/**/*.mjs` only. A `scripts/*.ts` file would never be measured, so the 100% rule would be hollow for it.
- **How to apply:** when adding a TypeScript script, widen `coverage.include` with `scripts/**/*.ts` in the same change. Widening `include` is allowed; widening `exclude` is not.
