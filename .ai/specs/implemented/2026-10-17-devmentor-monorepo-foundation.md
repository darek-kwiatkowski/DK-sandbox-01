# DevMentor — monorepo foundation

- **Date:** 2026-10-17
- **Status:** implemented (2026-10-17)

## Goal

Turn the single-package Next.js starter into the DevMentor application monorepo with the target stack:
Next.js (App Router) + React + TypeScript, PostgreSQL + MikroORM, Awilix (DI), Tailwind (frontend), shadcn-ui (backend).

## Scope

1. **npm workspaces** in the `packages/*` directory. The root contains only orchestration: scripts, a shared `tsconfig.base.json` and documentation.
2. **Packages** (with TS sources, no build step, imported by package name):
   - `@devmentor/app`: the Next.js application (moved from the root).
   - `@devmentor/core`: reusable logic, with no dependency on Next/React; the DI container (Awilix) and its types.
   - `@devmentor/db`: MikroORM configuration, entities, migrations, registration of database services in DI.
   - `@devmentor/ui`: shadcn-ui components, `cn`, theme (CSS variables) for Tailwind v4.
3. **Dependency direction:** `app → ui, db, core`; `db → core`; `ui` and `core` do not depend on other workspace packages.
4. **Pages:** frontend (public, plain Tailwind) in the `(frontend)` group, backend (admin panel, shadcn-ui) under `/backend`.
5. **Database:** PostgreSQL via `DATABASE_URL`. MikroORM migrations in `packages/db/src/migrations`, `db:*` scripts in the root. A `docker-compose.yml` with a local Postgres and an `.env.example` file.
6. **DI:** one application container (singleton per process) plus a per-request scope with its own `EntityManager` (`em.fork()`).
7. **Sample vertical slice:** a `User` entity, an initial migration, a service in DI and a backend page listing users.
8. The root `npm run dev` still runs the application, because `openmercato.toml` uses it.

## Out of scope

Authorization, automated tests (test framework to be chosen later), CI, deployment.

## Acceptance criteria

- `npm run lint`, `npm run typecheck` and `npm run build` from the root pass.
- `npm run db:migrate` creates the schema on an empty PostgreSQL database.
- `/` renders the frontend page (Tailwind), and `/backend` renders the panel (shadcn) with a list of users from the database.
- `AGENTS.md` describes the architecture and rules, and `README.md` describes the architecture and how to run it.
