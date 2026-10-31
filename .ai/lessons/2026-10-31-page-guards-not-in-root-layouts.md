# Page access checks live in page.tsx, not in layouts

- **Date:** 2026-10-31
- **Context:** while designing role gates for E01-S01 (spec `specs/2026-10-31-platform-primitives.md`, P3).
- **Finding:** every persona route group here is its own root layout (AGENTS.md). In Next 16, `forbidden()` / `unauthorized()` are experimental (`experimental.authInterrupts`) and cannot be called in a root layout. Layouts are also not re-rendered on client navigation, and they render in parallel with the page, so resolving the actor in a layout needs a second `withScope`.
- **How to apply:** guard every protected `page.tsx` with `pageScope` and render `AccessDenied` on refusal. Have the page render the role-aware `AppShell` from the actor it already resolved. Root layouts only set `<html>`, the stylesheet and `<body>`. Do not add `proxy.ts` as a source of truth for access.
