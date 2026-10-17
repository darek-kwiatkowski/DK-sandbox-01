# DevMentor — fundament monorepo

- **Data:** 2026-10-17
- **Status:** wdrożona (2026-10-17)

## Cel

Przekształcić jednopakietowy starter Next.js w monorepo aplikacji DevMentor z docelowym stackiem:
Next.js (App Router) + React + TypeScript, PostgreSQL + MikroORM, Awilix (DI), Tailwind (frontend), shadcn-ui (backend).

## Zakres

1. **npm workspaces** w katalogu `packages/*`. Root zawiera wyłącznie orkiestrację: skrypty, wspólny `tsconfig.base.json` i dokumentację.
2. **Pakiety** (ze źródłami TS, bez kroku budowania, z importem przez nazwę pakietu):
   - `@devmentor/app`: aplikacja Next.js (przeniesiona z roota).
   - `@devmentor/core`: logika wielokrotnego użytku, bez zależności od Next/React; kontener DI (Awilix) i jego typy.
   - `@devmentor/db`: konfiguracja MikroORM, encje, migracje, rejestracja serwisów bazodanowych w DI.
   - `@devmentor/ui`: komponenty shadcn-ui, `cn`, motyw (CSS variables) dla Tailwind v4.
3. **Kierunek zależności:** `app → ui, db, core`; `db → core`; `ui` i `core` nie zależą od innych pakietów workspace.
4. **Strony:** frontend (publiczny, czysty Tailwind) w grupie `(frontend)`, backend (panel administracyjny, shadcn-ui) pod `/backend`.
5. **Baza danych:** PostgreSQL przez `DATABASE_URL`. Migracje MikroORM w `packages/db/src/migrations`, skrypty `db:*` w roocie. `docker-compose.yml` z lokalnym Postgresem i plik `.env.example`.
6. **DI:** jeden kontener aplikacji (singleton na proces) oraz scope na żądanie z własnym `EntityManager` (`em.fork()`).
7. **Przykładowy pionowy przekrój:** encja `User`, migracja początkowa, serwis w DI i strona backendu listująca użytkowników.
8. Root `npm run dev` nadal uruchamia aplikację, bo korzysta z niego `openmercato.toml`.

## Poza zakresem

Autoryzacja, testy automatyczne (framework testowy do wyboru później), CI, deployment.

## Kryteria akceptacji

- `npm run lint`, `npm run typecheck` i `npm run build` z roota przechodzą.
- `npm run db:migrate` tworzy schemat na pustej bazie PostgreSQL.
- `/` renderuje stronę frontendu (Tailwind), a `/backend` renderuje panel (shadcn) z listą użytkowników z bazy.
- `AGENTS.md` opisuje architekturę i reguły, a `README.md` opisuje architekturę i uruchomienie.
