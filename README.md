# DevMentor

Aplikacja webowa DevMentor zbudowana jako monorepo na Next.js, React i TypeScript, z PostgreSQL (MikroORM) jako bazą danych.

## Stack

| Obszar | Technologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Język | TypeScript 6 (strict) |
| Baza danych | PostgreSQL + MikroORM 7 (migracje, pula połączeń) |
| Dependency Injection | Awilix 13 |
| Style — frontend | Tailwind CSS 4 |
| Style — backend | shadcn-ui (na Tailwind CSS 4) |
| Testy | Vitest |
| Monorepo | npm workspaces |

## Architektura

```
.
├── packages/
│   ├── app/    @devmentor/app   – aplikacja Next.js
│   ├── core/   @devmentor/core  – kod wielokrotnego użytku, infrastruktura DI
│   ├── db/     @devmentor/db    – MikroORM: konfiguracja, encje, migracje, serwisy danych
│   └── ui/     @devmentor/ui    – komponenty shadcn-ui i motyw
├── tsconfig.base.json           – wspólna konfiguracja TypeScript
├── eslint.config.mjs            – ESLint dla całego repo
├── docker-compose.yml           – lokalny PostgreSQL
└── .env.example                 – wzór konfiguracji środowiska
```

### Pakiety i zależności

```
        ┌──────────────┐
        │     app      │  Next.js: strony, routing, składanie kontenera DI
        └──┬────┬────┬─┘
           │    │    │
           ▼    │    ▼
       ┌──────┐ │ ┌──────┐
       │  ui  │ │ │  db  │  MikroORM, encje, migracje, serwisy danych
       └──────┘ │ └──┬───┘
                ▼    ▼
              ┌────────┐
              │  core  │  DI (Awilix), typy i narzędzia bez zależności od frameworka
              └────────┘
```

- **`app`** zależy od `ui`, `db` i `core`. To jedyne miejsce, w którym działa Next.js.
- **`db`** zależy tylko od `core`.
- **`ui`** i **`core`** nie zależą od innych pakietów workspace.

Pakiety udostępniają źródła TypeScript bezpośrednio (pole `exports` w `package.json`), bez osobnego kroku budowania. Next.js transpiluje je automatycznie.

### Strony: frontend i backend

| Część | Ścieżka w kodzie | URL | Style |
| --- | --- | --- | --- |
| Frontend (publiczny) | `packages/app/src/app/(frontend)` | `/` | Tailwind CSS |
| Backend (panel administracyjny) | `packages/app/src/app/backend` | `/backend` | shadcn-ui z `@devmentor/ui` |

Każda część ma własny root layout i własny arkusz stylów. Przejście między nimi przeładowuje stronę.

### Dependency Injection

Kontener Awilix działa w trybie `PROXY` z `strict: true`.

- `@devmentor/core` udostępnia `buildContainer()`, typ `ContainerModule` oraz interfejs `AppCradle`. Pakiety rozszerzają ten interfejs przez declaration merging.
- `@devmentor/db` rejestruje `dbModule`:
  - `orm` jako singleton (zamykany przez `container.dispose()`),
  - `em` jako scoped (`orm.em.fork()`),
  - serwisy danych, np. `userService`, jako scoped.
- `packages/app/src/server/container.ts` składa kontener raz na proces (`getContainer()`) i tworzy scope na żądanie (`getRequestScope()`):

```ts
const users = await getRequestScope().cradle.userService.list();
```

### Baza danych

- Encje są definiowane przez `defineEntity` w `packages/db/src/entities` (bez dekoratorów).
- Migracje leżą w `packages/db/src/migrations`, razem ze snapshotem schematu `.snapshot.json`.
- Połączenie konfiguruje zmienna `DATABASE_URL`. Konfiguracja dla CLI jest w `packages/db/src/mikro-orm.config.ts`.

## Uruchomienie

Wymagania: Node.js ≥ 22.17 oraz PostgreSQL (lokalnie albo przez Docker).

```bash
npm install
cp .env.example .env          # DATABASE_URL
docker compose up -d postgres # opcjonalnie: lokalny PostgreSQL
npm run db:migrate
npm run dev                   # http://localhost:3000, panel: /backend
```

Zmienne ustawione w środowisku mają pierwszeństwo przed `.env`.

## Komendy

| Komenda | Działanie |
| --- | --- |
| `npm run dev` | Serwer deweloperski |
| `npm run build` / `npm start` | Build produkcyjny i jego uruchomienie |
| `npm run lint` | ESLint dla całego repo |
| `npm run typecheck` | Sprawdzenie typów we wszystkich pakietach |
| `npm test` | Testy (Vitest) we wszystkich pakietach |
| `npm run db:migrate` | Zastosowanie migracji |
| `npm run db:migration:create` | Nowa migracja na podstawie zmian w encjach |
| `npm run db:migration:list` | Lista zastosowanych migracji |

Nowy komponent shadcn dodajesz poleceniem `npx shadcn@latest add <komponent>`, uruchomionym w `packages/ui`.

## Testy

Testy (Vitest) leżą obok kodu jako pliki `*.test.ts`:

- `packages/core`: testy jednostkowe kontenera DI.
- `packages/db`: testy integracyjne na prawdziwym PostgreSQL. Sprawdzają, że migracje działają na pustej bazie i pokrywają encje, oraz testują `UserService` przez DI.

Testy integracyjne łączą się przez `TEST_DATABASE_URL` z **osobną, jednorazową** bazą, bo kasują jej schemat. Bez tej zmiennej są pomijane. Plik `.env` nie jest wczytywany przez testy.

```bash
docker compose exec postgres createdb -U devmentor devmentor_test   # jednorazowo
TEST_DATABASE_URL=postgresql://devmentor:devmentor@localhost:5432/devmentor_test npm test
```

## Dla agentów AI

Zasady pracy, architektura obowiązująca agentów i struktura `.ai/` (specyfikacje, logi przebiegów, wnioski) są opisane w [`AGENTS.md`](AGENTS.md).
