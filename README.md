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

Standardy inżynieryjne, nazewnictwo i docelowa struktura są opisane w [`.ai/docs/engineering-standards.md`](.ai/docs/engineering-standards.md).

```
.
├── packages/
│   ├── app/    @devmentor/app   – Next.js: strony i route handlers (HTTP)
│   ├── core/   @devmentor/core  – reguły biznesowe: serwisy, DI, warstwa HTTP, env, logger
│   ├── db/     @devmentor/db    – persystencja: encje MikroORM, konfiguracja, migracje
│   └── ui/     @devmentor/ui    – prezentacja: shadcn-ui, komponenty konceptów, bloki panelu
├── tsconfig.base.json           – wspólna konfiguracja TypeScript
├── eslint.config.mjs            – ESLint dla całego repo (w tym granice pakietów)
├── docker-compose.yml           – lokalny PostgreSQL
└── .env.example                 – wzór konfiguracji środowiska
```

### Pakiety i zależności

```
   ┌──────────┐      ┌──────────┐
   │   app    │ ───▶ │    ui    │   shadcn-ui, DataTable, CrudForm, apiCall
   └────┬─────┘      └──────────┘
        ▼
   ┌──────────┐
   │   core   │   serwisy, Awilix, apiHandler/makeCrudRoute, auth, env, logger
   └────┬─────┘
        ▼
   ┌──────────┐
   │    db    │   jedyny pakiet z @mikro-orm/*: encje, konfiguracja, migracje
   └──────────┘
```

- **`app → core → db`**, a **`ui`** jest używany tylko przez `app`. Kierunek wymusza ESLint.
- Pakiety udostępniają źródła TypeScript bezpośrednio (pole `exports` w `package.json`), bez osobnego kroku budowania. Next.js transpiluje je automatycznie.

### Koncepty domenowe

Kod domenowy jest podzielony na koncepty (`auth`, `mentors`, `bookings`…), czyli podkatalogi o tej samej nazwie w każdej warstwie:

| Warstwa | Ścieżka |
| --- | --- |
| Encja | `packages/db/src/entities/<concept>/<name>.entity.ts` |
| Serwis | `packages/core/src/services/<concept>/<name>.service.ts` |
| Walidacja (Zod) | `packages/core/src/validators/<concept>/<name>-<action>.schema.ts` |
| API | `packages/app/src/app/api/<concept>/route.ts` |

Obecnie istnieje koncept `auth` (encja `User`, `UserService`).

### Strony i API

| Część | Ścieżka w kodzie | URL | Style |
| --- | --- | --- | --- |
| Strony publiczne | `packages/app/src/app/(marketing)` | `/` | Tailwind CSS |
| Panel administracyjny | `packages/app/src/app/backend` | `/backend` | shadcn-ui z `@devmentor/ui` |
| API | `packages/app/src/app/api` | `/api/health`, `/api/users` | — |

Każda część stron ma własny root layout i własny arkusz stylów. Przejście między nimi przeładowuje stronę.

**Przepływ żądania:**
1. Komponent kliencki woła `apiCall` lub `useApiResource` (`@devmentor/ui/backend/api`).
2. Route handler zbudowany z `apiHandler` lub `makeCrudRoute` (`@devmentor/core`) przyjmuje żądanie.
3. `withScope` tworzy scope DI z własnym `EntityManager`.
4. Serwis wykonuje operację.
5. Odpowiedź wraca w kopercie JSON `{ ok: true, data }` albo `{ ok: false, error: { code, message, fieldErrors? } }`.

```ts
// packages/app/src/app/api/users/route.ts
export const dynamic = "force-dynamic";
export const { GET } = makeCrudRoute({
  access: "public",
  list: ({ cradle }) => cradle.userService.list(),
});
```

Żądania zmieniające stan muszą mieć nagłówek `x-devmentor-request: 1`, który `apiCall` dodaje automatycznie (ochrona CSRF).

### Dependency Injection

Kontener Awilix (`packages/core/src/container/`) działa w trybie `PROXY` z `strict: true`. Każda zależność jest zarejestrowana jawnie w `container.ts`, a jej typ zapisany w `cradle.ts`:

- `orm`: singleton, zamykany przez `container.dispose()`,
- `em`: scoped (`orm.em.fork()`),
- serwisy, np. `userService`: scoped.

### Baza danych

- Encje są definiowane przez `defineEntity` (bez dekoratorów). Wspólne kolumny (`id` UUID, `createdAt`) pochodzą z `entities/base.entity.ts`.
- Migracje leżą w `packages/db/src/migrations`, razem ze snapshotem schematu `.snapshot.json`.
- Połączenie konfiguruje zmienna `DATABASE_URL`. Konfiguracja dla CLI jest w `packages/db/src/mikro-orm.config.ts`.
- Aplikacja buduje się i startuje bez dostępnej bazy. Dostęp do bazy mają tylko route'y z `force-dynamic`, a `/api/health` nie dotyka bazy.

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

- `packages/core`: testy jednostkowe kontenera DI i warstwy HTTP (`apiHandler`, `makeCrudRoute`, sesje) oraz test integracyjny `UserService`.
- `packages/db`: testy integracyjne na prawdziwym PostgreSQL. Sprawdzają, że migracje działają na pustej bazie i pokrywają encje.
- `packages/ui`: testy komponentów w jsdom (`apiCall`, `DataTable`, `CrudForm`).

Testy integracyjne łączą się przez `TEST_DATABASE_URL` z **osobną, jednorazową** bazą, bo kasują jej schemat. Bez tej zmiennej są pomijane. Plik `.env` nie jest wczytywany przez testy.

```bash
docker compose exec postgres createdb -U devmentor devmentor_test   # jednorazowo
TEST_DATABASE_URL=postgresql://devmentor:devmentor@localhost:5432/devmentor_test npm test
```

## Dla agentów AI

Zasady pracy, architektura obowiązująca agentów i struktura `.ai/` (specyfikacje, logi przebiegów, wnioski) są opisane w [`AGENTS.md`](AGENTS.md).
