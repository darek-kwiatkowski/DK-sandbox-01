# Stage 4 — teaching pages and agent guide

- **Goal:** complete Storybook teaching pages and the `docs/design-system.md` agent guide; stop before stage 5.
- **Specification:** `.ai/specs/2026-11-06-design-system-storybook.md`; approved stages and page content are in the user task and `packages/ui/POSTEP.md`.
- **Starting state:** stages 0–3 complete; existing foundations, primitive manuals, product manuals, patterns and epic screen map are present. New Stage-4 pages do not yet exist. Preserve the existing Storybook structure and content.
- **Decisions:** English documentation; Polish product UI examples; every rule cites an existing reference, brief/spec decision, WCAG or WAI-ARIA, and otherwise is labeled proposal. Do not claim unspecified API/settlement behavior.
- **Plan:** author Start here, Components catalog, How to choose, Usage and accessibility, Content, What to avoid, What is missing, Contributing; add linked epic pages and the AI quick reference; update root `AGENTS.md` with a pointer.
- **Validation:** build Storybook, render/check all new docs pages and tables in both themes, ensure links/imports/catalog previews resolve, run relevant lint/typecheck and token scan. Do not proceed to stage 5.
- **Completed:** authored 8 teaching pages and 6 epic pages (14 total), plus the agent guide. Components catalog shows 41 working entries; Start here index has 40 documented exports/blocks. Added a reusable TSX documentation row because a local MDX component declaration did not resolve at runtime. Added responsive wrapping for docs tables and long code/text.
- **Commands/results:** `npm run build-storybook` passed after the final catalog edit; `npm run typecheck` and `npm run lint` passed (lint has the known warning in generated `coverage/block-navigation.js`); `npm run check:tokens` passed with zero findings; `git diff --check` passed. Browser harness verified 14 pages × 3 widths × 2 themes = 84 checks, no page overflow, JS errors, broken links, raw Markdown tables, or incorrect document theme.
- **State:** stage 4 complete; waiting for the user before stage 5.
