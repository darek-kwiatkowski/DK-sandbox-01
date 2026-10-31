# Rollout of `.ai/docs/engineering-standards.md`

- **Date:** 2026-10-17
- **Status:** implemented (2026-10-17) for steps 1–3, 7 and 9 of the document. Steps 4–6 (events, validators, further concepts) are carried out with the first feature that needs them. Step 8 cannot be done (no `docs/product-scope.md`).
- **Source (authoritative):** [`.ai/docs/engineering-standards.md`](../../docs/engineering-standards.md) (status "active", decisions confirmed with the project owner)
- **Starting point:** commit `9554ec2` (the monorepo after phases 1–3 of the migration plan). The earlier stack proposal (Better Auth, Server Actions, Cache Components) was removed from the working tree and no longer applies.

## Mapping the document onto this repository

The document describes the initial state of a different bootstrap. The interpretations adopted are below:

| The document assumes | State in the repo | Decision |
| --- | --- | --- |
| `entities/user.entity.ts`, `base.entity.ts` | `db/src/entities/user.ts`, no base | → `entities/auth/user.entity.ts` + `entities/base.entity.ts` (shared UUID `id` and `createdAt`). Schema unchanged, verified by the absence of a migration diff. |
| `entities/mentor-profile.entity.ts` | does not exist | We skip it, because it will arrive with the `mentors` concept (YAGNI, in line with the document). |
| `define.ts` | does not exist, purpose not described | We skip it and report it as an ambiguity. |
| `services/user.service.ts` in `core`; `container.ts` + `cradle.ts` in `core`; `withScope` | `UserService` in `db`; a container with `ContainerModule` and `AppCradle` extension; `getRequestScope` in `app` | `core/src/services/auth/user.service.ts`; explicit `core/src/container/{container.ts,cradle.ts}`; `withScope(fn)` in `core`. Along the way this fixes the bug with React `cache()` in actions and route handlers. |
| Direction `app → core → db`; `@mikro-orm/*` only in `db` | `app → ui, db, core`; `db → core` | We invert it: `core → db`. `db` does not depend on other packages. `app` uses `core` and `ui`, and `db` only through `core`. `db` re-exports the types `core` needs (`EntityManager`, exceptions). ESLint rules rewritten. |
| `/admin/users` (demo page) | `/backend` (user list, shadcn) | Refactor `/backend` according to step 3: `api/users/route.ts` (`makeCrudRoute`) + `apiCall` + `DataTable`. The `/backend` URL is unchanged. |
| `/api/health` | does not exist | We add `api/health/route.ts` via `apiHandler`, because step 9 treats it as a regression test. |
| Persona route groups `(marketing)` etc. | `(frontend)` | `(frontend)` → `(marketing)` (landing S01). The remaining groups will be created with their concepts. |
| shadcn in `ui/src/components/ui/` | `ui/src/components/*.tsx` | We move the primitives to `components/ui/` and update the `components.json` aliases. |
| `requireSession`/JWT | no `auth` concept | `core/src/http/auth.ts` verifies JWT HS256 (`AUTH_SECRET` ≥ 32 bytes from `env.ts`) and throws *fail-closed* errors. Login and registration will come with the `auth` concept. |
| `api/users` protected by auth | there is no login yet | `GET /api/users` is **explicitly public** (marked in the code) and reproduces the current behavior of `/backend`. We do not expose `POST`/`PUT`/`DELETE`. To be secured together with the `auth` concept. |
| The "frontend: plain Tailwind, backend: shadcn" rule (AGENTS.md) | in ESLint | We reconcile it with the document: `(marketing)` does not import `components/ui/*` primitives or `backend/*`; concept components `components/<concept>/*` are allowed. |
| `docs/product-scope.md` (step 8) | does not exist | Cannot be done; we report it. |
| `events/`, `validators/` (steps 4–5) | — | In line with the document, only with the first feature that needs them. |

## Phases

### Phase A — moving the `auth` concept and inverting the dependency (step 1) ✅
- [x] entity in `entities/auth/`, `base.entity.ts`, no migration diff
- [x] `UserService` in `core/src/services/auth/`, explicit `container.ts` / `cradle.ts`, `withScope`
- [x] `core → db`, ESLint with the new boundaries (probes)
- [x] `lint`, `typecheck`, `test` (with a test database), `build`

### Phase B — reusable layers (step 2) ✅
- [x] `core/src/http/{errors,apiHandler,makeCrudRoute,auth}.ts`, `core/src/logger.ts`, `core/src/config/env.ts`, with tests
- [x] `ui/src/backend/{api,forms,tables,feedback}`, shadcn primitives in `components/ui/`, with tests
- [x] ESLint rules: no `fetch` outside `ui/src/backend/api`, no `try/catch` in `route.ts`, `no-explicit-any`, `no-console`

### Phase C — reference example (step 3) and health ✅
- [x] `api/users/route.ts` (`makeCrudRoute`, GET only), `api/health/route.ts`, `/backend` via `apiCall` + `DataTable`
- [x] the application builds and starts **without an available database**

### Phase D — documentation (step 7) and verification (step 9) ✅
- [x] `AGENTS.md`: sections from §3 of the document, reconciled with the existing ones; README
- [x] full verification: `npm ci`, `lint`, `typecheck`, `test`, `build`, start with and without a database, `/backend` and `/api/health`

## Progress

<!-- Newest entries at the top. -->

- **Phase D ✅.**
  - Documentation:
    - `AGENTS.md`: sections „Konwencja konceptów domenowych” (Domain concept convention) and „Warstwa API i UI wielokrotnego użytku” (Reusable API and UI layer) (§3 of the document, in Polish), rewritten packages, dependency direction, Next/DI/DB rules, security section, `docs/` in the `.ai/` structure,
    - `README.md`: architecture, concepts, request flow,
    - `.env.example`: `LOG_LEVEL`, `AUTH_SECRET`.
  - Verification on a clean copy after `npm ci`:
    - 0 `ERESOLVE`; `lint`, `typecheck` and `build` exit 0,
    - `npm test` with an isolated database: core 37, db 2, ui 15, no skips,
    - `npm audit --omit=dev`: 8 high, solely the known `braces` chain (awilix, shadcn), no upstream fix; the new dependencies added nothing,
    - dev preview (:3000): `/`, `/backend`, `/api/health` and `/api/users` return 200; in Chromium empty state, 0 JS errors.

- **Phase C ✅.**
  - Endpoints:
    - `api/users/route.ts`: `makeCrudRoute`, `GET` only, explicitly `access: "public"` with a comment, `force-dynamic`,
    - `api/health/route.ts`: `apiHandler`, no database,
    - `/backend`: `UsersTable` (next to the page), uses `useApiResource`, `apiCall` and `DataTable`.
  - Changes in `core` along the way:
    - `makeCrudRoute` always returns GET/POST/PUT/DELETE, and unconfigured ones respond 405 (`MethodNotAllowedError`), so that route exports are fully typed,
    - `AppError` messages translated into Polish, because they reach the UI.
  - Production build:
    - **without a database:** `/`, `/backend` and `/api/health` return 200; `/api/users` returns 500 with a generic message, no details, logged in pino (`level 50`); `POST` gives 405,
    - **with a database:** `/api/users` returns clean JSON.
  - Chromium (Playwright, outside the repo): table with data, error state with „Spróbuj ponownie” (Try again), 0 JS errors.
  - ESLint: probes detected 6/6 violations (`fetch`, `try/catch` in `route.ts`, `any`, `console`, backend primitives and blocks in `(marketing)`), and a file with allowed imports produced 0 errors.
- **Phase B ✅.**
  - `core`: `config/env.ts` (zod, lazily), `logger.ts` (pino + redact), `http/{errors,envelope,validation,api-handler,auth,make-crud-route}.ts`. `UserService` maps a uniqueness violation to `ConflictError`.
  - `ui`: primitives in `components/ui/` (`components.json` aliases, new `input`/`label`/`field` from the CLI), `backend/{api,feedback,tables,forms}`.
  - Tests: core 35 (+2 integration), ui 15.
  - Mutations detected: missing CSRF, validation before authorization, missing field errors from the server.

- **Phase A ✅.**
  - `db`: `entities/auth/user.entity.ts` and `base.entity.ts`, `createOrm`, re-export of ORM types. `db` does not depend on other packages. The CLI reports "No changes required".
  - `core`: `services/auth/user.service.ts`, `container/{container,cradle}.ts`, `withScope` (scope per call, with `dispose`). `getContainer` is not exported.
  - `app`: without `@devmentor/db`; `(frontend)` → `(marketing)`.
  - ESLint: new boundaries; probes detected 14/14 violations, and a file with allowed imports produced 0 errors.
  - Results: `lint`, `typecheck` and `build` exit 0; `test` with an isolated database: core 4/4, db 2/2; the `/` and `/backend` preview returns 200.
