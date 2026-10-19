# Code review rules — DevMentor

Applied automatically by `om-code-review` (and therefore `om-auto-review-pr`) on top of its built-in checklist. The binding source for every rule below is [`AGENTS.md`](AGENTS.md) and [`.ai/docs/engineering-standards.md`](.ai/docs/engineering-standards.md) (its "Code Review Checklist" section); when this file and those disagree, they win — fix this file.

## Review priorities

1. **Correctness** — the change does what its issue/spec says, including error, empty and concurrent paths.
2. **Security** — authentication, record-level authorization, input validation, secrets.
3. **Contracts** — nothing listed in [`BACKWARD_COMPATIBILITY.md`](BACKWARD_COMPATIBILITY.md) breaks without the required path.
4. **Architecture** — package boundaries and the concept-folder convention.
5. **Tests** — 100% unit coverage plus integration/E2E where required.
6. **Quality** — readability, no dead code, diff limited to the stated purpose.

## Repo-specific checks

### Architecture and boundaries

- Dependency direction is `app → core → db`; `ui` is imported only by `app`, and never imports `core` or `db`. Imports go through the package name and its `exports` (`@devmentor/core`, `@devmentor/ui/backend/tables`), never a relative path into another package or `@devmentor/<pkg>/src/...`. **blocker**
- No `eslint-disable`, no new `package.json` dependency added just to dodge a boundary rule. A fifth package or a technology swap (ORM, DI, UI/CSS library) without user approval. **blocker**
- Domain code follows `<concept>/` folders across layers (`db/src/entities/<concept>/`, `core/src/services/<concept>/`, `core/src/validators/<concept>/`, `app/src/app/api/<concept>/`); no `modules/`, no auto-discovery, no empty pre-created folders. **major**
- `packages/app` holds no business logic and no DB queries; services live in `core`; only `db` imports `@mikro-orm/*`. **blocker**

### HTTP layer

- Route handlers export `apiHandler(...)` or `makeCrudRoute(...)` — no hand-written `try/catch` or `NextResponse.json`. `makeCrudRoute` declares `access` explicitly. **blocker**
- Non-public routes use `access: "session"` / `requireSession`; a public route has `access: "public"` and a comment justifying it. **blocker**
- Mutations check ownership of the specific record (`assertOwnership`); any error during an authorization decision denies. **blocker**
- Services throw only `AppError` subclasses from `core/src/http/errors.ts`, never build HTTP responses; ORM exceptions (e.g. `UniqueConstraintViolationException`) are mapped to `AppError` (e.g. `ConflictError` with `fieldErrors`). **major**
- Input goes through a Zod schema (`parseInput`, shared under `core/src/validators/<concept>/`); only the parsed output reaches `em.create()` / `em.assign()`. **blocker**
- State-changing requests still require the `x-devmentor-request: 1` header (CSRF) — do not weaken it in `apiHandler`. **blocker**

### Data (MikroORM 7)

- Entities use `defineEntity` + `p`, UUID ids via `baseProperties()`, registered in `entities/index.ts`; no decorators or `reflect-metadata`. **major**
- Only the DI-scoped `em` is used (never a global `orm.em`); writes use `em.persist(x).flush()`. **major**
- Check-then-write on shared state (slots, booking status) runs in a transaction and/or is backed by a unique constraint. **blocker**
- Every schema change ships a new migration plus the updated `.snapshot.json`; applied migrations are never edited; no `schema:update`; no extra `.ts` files in `packages/db/src/migrations/`. **blocker**
- DB access only in routes/pages with `export const dynamic = "force-dynamic"`; the app must build and boot without a database (`/api/health` stays DB-free). **blocker**
- No raw SQL with interpolated input. **blocker**

### Dependency injection (Awilix)

- Each new dependency is one explicit line in `core/src/container/container.ts` (`asClass(...).scoped()` for anything using `em`) and one in `cradle.ts`. **major**
- Services are resolved via `withScope` once per request/render; `getContainer()` stays unexported; a singleton never depends on a scoped registration. **blocker**
- External integrations are a port in `core` with an adapter in `adapters/`. **major**

### UI

- Client components fetch only via `apiCall` / `useApiResource` — no raw `fetch()` to `/api/*`. **major**
- shadcn primitives are added only with `npx shadcn@latest add` in `packages/ui`, never hand-written. **major**
- `(marketing)` pages use plain Tailwind — no `@devmentor/ui/components/ui/*` or `@devmentor/ui/backend/*`. **major**
- Backend colours come from theme tokens in `packages/ui/src/styles/globals.css`; no hard-coded colours. **minor**
- New lists/forms reuse `DataTable` / `CrudForm` / feedback components unless the PR states why not. **minor**
- User-facing text and `AppError` messages are Polish; error `code`s stay English. **major**

### Security and secrets

- Session cookie flags (`httpOnly`, `secure` in prod, `sameSite=lax`) and 24 h HS256 JWT from `AUTH_SECRET` are preserved; nothing auth-related goes to `localStorage`. **blocker**
- No password, token or full JWT in logs, errors or client payloads; `logger` (pino, with `redact`) instead of `console`. **blocker**
- Login/register/password-reset changes keep a brute-force control and generic error messages. **major**
- Money is recomputed server-side; client-supplied price is never trusted. **blocker**

### Tests

- 100% unit coverage (lines, branches, functions, statements) over `packages/*/src`, measured by the full `npm run test:unit` — never by a per-project run. Lowering thresholds, widening `coverage.exclude`, `v8 ignore`/`istanbul ignore`, or assertion-free tests are **blockers**.
- Tests live next to the code (`foo.ts` → `foo.test.ts`); unit tests touch no DB or network; components are tested in jsdom with Testing Library.
- New entities, migrations and SQL-bearing queries have an `*.integration.test.ts`; race-sensitive flows have a concurrency integration test. **major**
- New pages or user flows have a `test/e2e/*.e2e.test.ts` scenario that asserts `pageErrors()` is empty and seeds data through `@devmentor/core` services. **major**
- A bug fix ships a test that fails without the fix. **major**

### Code quality

- No `any`, no empty `catch`, no dead or commented-out code; named constants with a comment when the value is not obvious. **minor** (lint-enforced items are **major**)
- `typescript` stays `~6.0`, `eslint` `^9`; dependencies are installed in the package that uses them; `npm install` reports no `ERESOLVE`. **major**
- The diff traces to the PR's stated purpose — no drive-by renames or formatting passes. **minor**

## Validation gate

The reviewer confirms the gate from `.ai/agentic.config.json` is green (CI runs the same jobs):

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration          # Testcontainers PostgreSQL (needs Docker)
NODE_ENV=production npm run build
npm run test:e2e                  # needs the production build + Docker
```

UI changes additionally need a browser check (screenshots as PR evidence).

## Severity guidance

- **blocker** — security hole, data loss/corruption risk, broken contract, broken boundary, broken gate, or missing required test. Verdict: request changes.
- **major** — convention or correctness problem that will cost later (wrong layer, missing integration/E2E test, Polish/English text rule). Request changes unless the PR states an accepted reason.
- **minor** — readability, naming, small duplication. Does not block on its own; may become a follow-up issue.
- **nit** — taste. Never blocks.

A finding cites the file/line and the rule above (or the section of `engineering-standards.md`) it violates.
