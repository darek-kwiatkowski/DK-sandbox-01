# DevMentor monorepo migration plan

- **Date:** 2026-10-17
- **Status:** in progress
- **Base specification:** [implemented/2026-10-17-devmentor-monorepo-foundation.md](implemented/2026-10-17-devmentor-monorepo-foundation.md)
- **Architecture:** `AGENTS.md` (section „Architektura DevMentor” (DevMentor architecture)), `README.md`

## Phases

### Phase 1 — Monorepo structure and moving the application ✅

Scope:
- npm workspaces,
- moving the application to `packages/app`,
- extracting `core` (DI), `db` (MikroORM, entities, migrations) and `ui` (shadcn),
- dependencies between packages, imports by package name,
- root scripts and the initial migration.

Completion criteria:
- [x] `npm run lint`, `npm run typecheck`, `npm run build` from the root pass
- [x] `npm run db:migrate` creates the schema on an **empty**, isolated database, and `db:migration:create` detects no differences
- [x] `npm run dev` (the preview command from `openmercato.toml`) serves `/` (Tailwind) and `/backend` (shadcn, data from the database via DI)
- [x] no package imports undeclared dependencies or another package via a relative path

### Phase 2 — Enforcing architecture boundaries ✅

Scope: the rules from AGENTS.md (dependency direction, frontend without `@devmentor/ui`, `core` framework-independent, no relative imports between packages) enforced by ESLint, not just by documentation.

Completion criteria:
- [x] violating any rule produces an `npm run lint` error (verified on deliberately bad code)
- [x] the current code passes `npm run lint` with no exceptions or disables

### Phase 3 — Automated tests ✅

Scope: test framework: Vitest (the plan's recommendation, adopted in the absence of another decision from the user), an `npm test` script, `core` unit tests (container, scope) and a `db` integration test (migration and `UserService` on an isolated database).

Completion criteria:
- [x] `npm test` from the root passes
- [x] the verification rule in AGENTS.md covers `npm test`

### Phase 4 — CI ✅ (delivered in [implemented/2026-10-17-ci-and-test-coverage.md](implemented/2026-10-17-ci-and-test-coverage.md))

Scope: a pipeline with `lint`, `typecheck`, `build`, migrations on a PostgreSQL service, and tests.

Completion criteria:
- [ ] the pipeline passes on a clean checkout

## Progress

<!-- Newest entries at the top. -->

- **2026-10-17 — Phase 3 complete.**
  - Vitest 5 in `core` and `db`; `npm test` in the root runs the tests in all packages.
  - `core`: 5 DI unit tests (module order, PROXY, singleton/scoped, strict, dispose). The `strict: false` mutation was detected.
  - `db`: 4 integration tests on PostgreSQL via `TEST_DATABASE_URL`:
    - migrations work on an empty database,
    - migrations cover the entities (mutation: a field without a migration was detected, the test showed the missing SQL),
    - `UserService` via DI with separate `em` per scope,
    - a duplicate e-mail is rejected.
  - The `TEST_DATABASE_URL == DATABASE_URL` safeguard aborts the test (exit 1), and the schema stays untouched (verified with a control table).
  - `db` refactor:
    - `createOrmConfig` honors `clientUrl` from overrides,
    - new `createDbModule(overrides)`,
    - migrator options in `migrator-config.ts`, shared by the CLI and the tests.
  - Fix: `eslint` 10 → 9.39.5, because the `eslint-config-next` plugins declare peer `eslint ^9`. `npm install` no longer reports `ERESOLVE`. The phase 2 boundary rules were re-checked with probes.
  - Results: `lint`, `typecheck`, `build` and `npm test` exit 0 (without a database 5 passed / 4 skipped, with an isolated database 9/9), the `/` and `/backend` preview returns 200.
- **Next stage: Phase 4 (CI)**, the last one. The repo has an `origin` on GitHub, so the pipeline is GitHub Actions. It must set `TEST_DATABASE_URL` to a PostgreSQL service. The "passes on a clean checkout" criterion requires pushing the branch (requires the user's consent).

- **2026-10-17 — Phase 2 complete.** `eslint.config.mjs` now enforces:
  - `import/no-relative-packages`,
  - `import/no-extraneous-dependencies` (devDependencies only in `*.config.*` files),
  - `@typescript-eslint/no-restricted-imports` per scope: `core`, `db`, `ui`, `app` routes (data only via DI, types allowed) and `(frontend)` (without `@devmentor/ui`).

  Verification:
  - probes with deliberate violations in every scope produced 18/18 expected errors,
  - a file with allowed imports produced 0 errors,
  - the probes were removed,
  - `lint`, `typecheck` and `build` pass (exit 0), the `/` and `/backend` preview returns 200.

  Note: `--fix` for the `no-relative-packages` rule suggests a path outside `exports` (described in AGENTS.md).


- **2026-10-17 — Phase 1 complete.** Verification on a copy of the tree after `npm ci` (no local state):
  - `lint`, `typecheck` and `build` pass,
  - on an empty, isolated PostgreSQL the migration creates the `users` schema, and `migration:create` reports "No changes required",
  - production build (`npm start`): `/` 200, `/backend` 200 (empty state, then data after an insert), unknown path 404,
  - the `npm run dev` preview on :3000 returns 200,
  - the import audit found no undeclared dependencies or relative imports between packages.
