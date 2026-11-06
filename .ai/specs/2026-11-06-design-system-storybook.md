# Design system and Storybook for DevMentor

- **Date:** 2026-11-06
- **Status:** plan accepted (stage 0) by Oliwia on 2026-11-06; built in stages 1–5, each stage waits for the owner's "dalej". Progress, decisions and open questions live in `packages/ui/POSTEP.md`. The spec moves to `implemented/` after stage 5.
- **Design authority:** `lekcja-06/referencje.md` (references, character, anti-references, conflicts), `lekcja-06/tokeny.md` (approved tokens and rules), `AGENTS.md`, `.ai/docs/engineering-standards.md`, `.ai/specs/product-brief.md`, `.ai/specs/backlog.md`, `.ai/specs/2026-10-31-e01-s01-accounts-and-role-access.md`, `.ai/specs/2026-10-31-platform-primitives.md`.

## TLDR

Turn `packages/ui` into DevMentor's design system and document it in Storybook as a manual, not a gallery. Readers: a developer building a screen, an AI agent building a screen, and a designer checking a screen. Done means a developer or agent builds a new screen from the docs without guessing: which component and why, how to compose it, which tokens, how every state behaves, and what not to do.

## Decisions (2026-11-06, Oliwia)

- UI copy and story examples in Polish (AGENTS.md, E01-S01 copy); Storybook documentation in English.
- E02–E05 have no screen specs: their product components and screens are derived from the brief and references and each is marked as a proposal for the owner's decision.
- Stories live in `packages/ui/stories/` mirroring `src/`; the 100% coverage threshold and `coverage.exclude` stay unchanged. Product components get unit tests at 100% coverage.
- Changes to the existing system: `globals.css` values replaced by `tokeny.md` tokens moved to a new `src/styles/tokens.css` (three layers); `--font-sans` self-reference fixed; violet removed from dark `--sidebar-primary`; primitives restyled (shape, density, focus, states; details approved before stage 2); `./tokens.css` exported; CrudForm gains `textarea`, `select`, `money` fields (primitives spec P18); existing component copy stays Polish. Nothing is deleted.
- Component set: shadcn/ui on Radix (existing). Avatar with initials. No switch, tabs, popover or toast (and no `sonner`): no screen needs them; listed on "What is missing" with the reason.
- Theme switcher is an own Storybook decorator that sets `.dark` on `<html>`; no `@storybook/addon-themes`.
- New CI job "Storybook": build, a11y and interaction tests in both themes, token check.
- Agent guide at `.ai/docs/design-system.md`, referenced from `AGENTS.md`.
- Storybook telemetry, onboarding checklist and what's-new notifications disabled; only "DevMentor" visible in the Storybook UI.

## Technical plan

- Storybook 10.6.6 with `@storybook/react-vite` (Vite 8, `@tailwindcss/vite` 4.3), config in `packages/ui/.storybook`.
- Addons: `@storybook/addon-docs` with `remark-gfm`; `@storybook/addon-a11y` with `a11y: { test: 'error' }`; `@storybook/addon-vitest` with `@vitest/browser-playwright` and `playwright`; `msw` with `msw-storybook-addon` for `/api/*` responses.
- Story tests run from a separate `packages/ui/vitest.storybook.config.ts`, so `npm run test:unit` and its coverage are unaffected; a script runs them once per theme.
- Scripts in `packages/ui`: `storybook`, `build-storybook`, `test:storybook`; root scripts delegate with `-w @devmentor/ui`.
- Token check script `scripts/check-design-tokens.mjs` with a unit test (P-S6, accepted) fails on colours outside `tokens.css`, Tailwind palette classes and arbitrary Tailwind values.

## Storybook tree

```
Design system: Start here, Components, How to choose, Usage and accessibility, Content,
               What to avoid, What is missing, Contributing, Epics/E01–E05
Foundations:   Color, Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes
Primitives:    Button, Link, Input, Textarea, Select, Checkbox, Radio group, Field, Card, Badge,
               Avatar, Alert, Dialog, Alert dialog, Dropdown menu, Tooltip, Skeleton, Separator,
               Table, Feedback
Product:       E01–E05 product components
Patterns:      Form, Filtered list, Detail view, Delete confirmation, Sign-in, Access gate,
               Booking checkout, Text session, Co-edited note
Screens:       E01–E05 full-screen stories with state maps
```

## Phasing

| Stage | Content |
|---|---|
| 0 | Inventory and plan (done) |
| 1 | Storybook setup, tokens in code, Tailwind wiring, theme switcher, Foundations pages, token check script |
| 2 | Primitives in batches of about six, each with the 13-section page and state matrix |
| 3 | Product components per epic, patterns with all data and API states, key screens with state maps |
| 4 | Teaching pages and the agent guide |
| 5 | Build, typecheck, lint, token check, a11y, browser check at 320/768/1440 in both themes, agent test prepared, counts and report |
