# CI on GitHub Actions, unit tests with 100% coverage, integration (Testcontainers) and E2E (agent-browser)

- **Date:** 2026-10-17
- **Status:** implemented (2026-10-17)
- **Supersedes:** phase 4 (CI) of the [migration plan](../2026-10-17-monorepo-migration-plan.md)

## Goal

Every pull request automatically goes through:
- build,
- lint (+ typecheck),
- unit tests with **100% coverage** (lines/branches/functions/statements),
- integration tests on an ephemeral PostgreSQL with **Testcontainers**,
- E2E tests on an ephemerally launched application, driven by **agent-browser** (Vercel Labs).

## Decisions

| Area | Choice | Rationale |
| --- | --- | --- |
| Unit tests | Vitest 5 (already in the repo) + `@vitest/coverage-v8` 5.0.5 | The `vitest` peer must have exactly the same version. |
| Coverage scope | `packages/*/src/**/*.{ts,tsx}` excluding test files | All application code, including generated shadcn primitives, migrations and `mikro-orm.config.ts`. Only tool configuration files (`next.config.ts`, `postcss.config.mjs`) stay outside `src`; they are verified by build and lint. |
| Thresholds | 100% for all metrics, computed jointly in a single `vitest.config.ts` | 100% jointly means 100% in every file, so weak coverage in one package does not hide in the average. No need to duplicate the configuration per package. |
| Integration | Root `vitest.integration.config.ts`, `globalSetup` with `@testcontainers/postgresql` | A PostgreSQL 17 container for the duration of the run. `TEST_DATABASE_URL` in the environment replaces the container (e.g. when Docker is missing). Integration tests are no longer skipped; they fail without a database. |
| E2E | Root `test/e2e`, Vitest drives the `agent-browser` CLI (`--json`, separate session) | `globalSetup` starts the container, runs migrations through the real CLI (`npm run db:migrate`), seeds and cleans data through `@devmentor/core` services, and starts `next start` from the production build on a random port. |
| Test infrastructure | A `test/` directory in the root (not a workspace package) | A fifth package requires consent (AGENTS.md); repo tooling lives in the root. |
| CI | `.github/workflows/ci.yml`, `pull_request`, Node 24, 5 parallel jobs | `actions/checkout@v7`, `actions/setup-node@v7` (npm cache), `actions/upload-artifact@v7`. Docker is available on `ubuntu-latest`. |

## Completion criteria

- [x] `npm run test:unit` (alias `npm test`) passes with the 100% threshold in every package
- [x] `npm run test:integration` passes on a Testcontainers container (locally, via Docker)
- [x] `npm run test:e2e` passes: the application starts ephemerally, and agent-browser verifies `/`, `/backend` (data, empty state) and the absence of JS errors
- [x] the CI workflow has build, lint, unit, integration and e2e jobs; the file is syntactically valid, and the steps were reproduced locally
- [x] AGENTS.md requires 100% unit test coverage for every new feature; the README describes the commands
- [x] CI run on GitHub: [PR #1](https://github.com/darek-kwiatkowski/DK-sandbox-01/pull/1), run 39020654680, 5/5 jobs green

## Progress

<!-- Newest entries at the top. -->

- **2026-10-17 — CI on GitHub green.** PR #1, all jobs passed on the first try:

  | Job | Time |
  | --- | --- |
  | Build | 49 s |
  | Lint & typecheck | 49 s |
  | Integration (Testcontainers) | 49 s |
  | Unit (100%) | 1 min 2 s |
  | E2E (agent-browser) | 1 min 15 s |

- **2026-10-17 — implementation.**
  - `vitest.config.ts`: projects `app`, `core`, `db`, `ui`; v8 coverage, 100% threshold jointly (i.e. in every package).
  - `vitest.integration.config.ts` + `test/integration/global-setup.ts`: Testcontainers `postgres:17-alpine`.
  - `vitest.e2e.config.ts` + `test/e2e/global-setup.ts`: container → `npm run db:migrate` → `next start` on a free port → `/api/health`. Plus `test/support/agent-browser.ts` and 5 scenarios in `test/e2e/app.e2e.test.ts`.
  - `.github/workflows/ci.yml`: 5 jobs; actionlint OK.
  - 26 new or extended unit test files, 139 tests. Coverage: lines 354/354, branches 207/207, functions 127/127, statements 366/366. No `ignore` comments and no changes to source code.
  - Locally (Docker installed in the sandbox): `lint`, `typecheck`, `test:unit`, `test:integration` (4), `build` and `test:e2e` (5) exit 0.
  - Mutations:
    - an untested function makes `test:unit` exit 1 (threshold),
    - a changed empty-state text breaks the E2E test.
