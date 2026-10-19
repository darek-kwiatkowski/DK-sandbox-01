# Backward compatibility — DevMentor

What this repository treats as a **protected contract surface**, and the path a change to one must follow. Review skills check every PR against this file; implementation skills warn when a change is not compliant. A PR that breaks a surface without its required path is a **blocker** in review.

DevMentor is a private, unreleased monorepo (`0.1.0`): there are no external consumers of the packages yet. The contracts below are therefore mostly **internal between packages and between the server and the browser**, plus the database, which is stateful and cannot be rolled back by reverting code.

## Surfaces

### 1. Database schema and migrations (`packages/db/src/migrations/`)

- **Breaking:** editing or deleting an applied migration; dropping or renaming a column/table, tightening nullability, or adding a unique constraint without handling existing rows; changing UUID id semantics; a schema change without a migration or without the updated `.snapshot.json`.
- **Required path:** a new migration created with `npm run db:migration:create`, committed with the snapshot; destructive changes split into expand → migrate data → contract across separate migrations; an integration test exercising the migration; a rollback plan in the PR body. Label `risk-high`.

### 2. HTTP API (`packages/app/src/app/api/*/route.ts`)

Current routes: `GET /api/health` (liveness, DB-free), `GET /api/users`.

- **Breaking:** removing or renaming a route or method; removing/renaming/retyping a field in `data`; changing a route's `access` from `public` to `session` without updating its callers; making `/api/health` depend on the database.
- **Required path:** additive changes only (new optional fields, new routes); a removal or rename first adds the replacement, migrates every caller in `packages/ui` / `packages/app`, then removes the old shape in a later PR. E2E covers the consuming page.

### 3. JSON envelope and error codes (`packages/core/src/http/envelope.ts`, `errors.ts`)

- `{ ok: true, data }` / `{ ok: false, error: { code, message, fieldErrors? } }`, mirrored in `packages/ui/src/backend/api/types.ts` (ui cannot import core).
- Error `code`s (`validation_error`, `unauthorized`, `forbidden`, `not_found`, `conflict`, `method_not_allowed`) and their HTTP statuses are matched by the client.
- **Breaking:** changing the envelope shape, renaming a `code`, changing a code's status, changing the `fieldErrors` shape.
- **Required path:** change `core` and the `ui` mirror in the same PR, with unit tests on both sides; new codes are additive. Messages (Polish) may change freely.

### 4. CSRF header and session cookie (`packages/core/src/http/auth.ts`, `envelope.ts`)

- `x-devmentor-request: 1` on state-changing requests; cookie `devmentor_session` (`httpOnly`, `secure` in prod, `sameSite=lax`, `path=/`, 24 h); JWT HS256 with claims `sub` (UUID) and `role` (`student` | `mentor`).
- **Breaking:** renaming the header or cookie, changing claims or algorithm (invalidates every live session), weakening any flag.
- **Required path:** `apiCall` and `apiHandler` change together; a cookie/claim change states in the PR body that existing sessions are logged out; `risk-high`, second reviewer.

### 5. Package public APIs (`exports` in each `package.json`)

- `@devmentor/core` → `src/index.ts`; `@devmentor/db` → `src/index.ts`; `@devmentor/ui` → `./globals.css`, `./lib/*`, `./components/*`, `./backend/*`.
- **Breaking:** removing or renaming an exported symbol or subpath, changing an exported function's signature or a component's required props.
- **Required path:** since every consumer is in this monorepo, update all call sites in the same PR and keep `npm run typecheck` green. Widening `exports` (e.g. exposing `src/` internals) is not allowed to work around a boundary.

### 6. Environment variables (`packages/core/src/config/env.ts`, `DATABASE_URL`)

- `DATABASE_URL`, `NODE_ENV`, `LOG_LEVEL`, `AUTH_SECRET` (≥ 32 bytes), and test-only `TEST_DATABASE_URL`.
- **Breaking:** renaming/removing a variable, making an optional one required, tightening validation, or requiring a runtime secret at `next build` time.
- **Required path:** document the change in `README.md` and the PR body, keep a sensible default or fail with a clear validation message, and keep the build working without a database or secrets.

### 7. Domain events (`packages/core/src/events/`, when introduced)

- Identifiers follow `concept.entity.action` (e.g. `bookings.booking.created`) and carry a typed payload.
- **Breaking:** renaming an event id or removing/retyping a payload field.
- **Required path:** add the new event alongside the old one, move all listeners, then remove the old one.

### 8. Repository commands and agent configuration

- Root `npm run` scripts listed in `AGENTS.md` (used by CI, the validation gate and agent skills), `.github/workflows/ci.yml` jobs, `.ai/agentic.config.json`, `.ai/trackers/`, `.ai/browsers/`.
- **Breaking:** renaming/removing a script or CI job, changing a script's meaning.
- **Required path:** update `AGENTS.md`, `SDLC.md`, `.ai/agentic.config.json` and the CI workflow in the same PR.

## Not protected

Internal service methods and module-private helpers, UI copy (Polish texts and error messages), styling, page layout, test helpers under `test/support/`, and files under `.ai/` other than those listed in §8.
