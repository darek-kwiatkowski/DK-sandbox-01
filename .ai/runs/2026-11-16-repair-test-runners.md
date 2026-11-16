# Repair integration and E2E

- User explicitly requested repair of both suites after stage-3 verification failures.
- Plan: reproduce startup failures, separate Vitest cache/source-map problem from Docker availability, fix minimal configuration/launch surface, run real integration/E2E plus required regression gate. Existing Nov-13 repairs and all unrelated work preserved.
- Independent read-only runner diagnosis delegated under AGENTS.md rule 6. No dependency upgrades planned.
- Root cause: root globalSetup retained Vitest fsModuleCache despite child projects disabling it, masking Docker setup errors in Vite source mapping. Added root `test.fsModuleCache: false`; kept existing child workaround and source maps.
- Environment: Docker CLI installed but Desktop engine stopped. Started installed Docker Desktop with user-approved escalation; waited until `docker info` and Desktop status confirmed running. Tests use separate ephemeral Testcontainers PostgreSQL, no external database override.
- Validation: direct cmd-shell runs integration 4/4 and E2E 5/5 passed; E2E exit 0. Unit retry 262/262 with 100% lines/branches/functions/statements and exit 0. First unit pass under load failed two form tests; rerun passed without source or timeout changes. Lint/typecheck and production build passed. No source UI change, so no additional Storybook/browser gate required for this configuration-only repair; E2E exercised browser flows.
- Preserved all earlier uncommitted repairs. No dependencies, coverage settings, skipped tests or database schema changes. New root cache setting reviewed against installed Vitest runner source and reproduced via CLI override before editing.
- Lesson recorded in `.ai/lessons/2026-11-16-vitest-global-setup-cache.md`.
- Status: completed.
