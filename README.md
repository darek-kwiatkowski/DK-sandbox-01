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
| Testy | Vitest (unit, 100% pokrycia), Testcontainers (integracja), agent-browser (E2E) |
| CI | GitHub Actions |
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

### Instalator (zalecane)

```bash
npm run setup
npm run dev                   # http://localhost:3000, panel: /backend
```

`npm run setup` wykonuje po kolei kroki instalacji ręcznej:

1. instaluje zależności (`npm install`),
2. tworzy `.env` z `.env.example`,
3. sprawdza, czy pod `DATABASE_URL` działa PostgreSQL. Jeśli nie, uruchamia go z `docker-compose.yml` i czeka, aż baza przyjmie połączenia,
4. stosuje migracje (`npm run db:migrate`).

Instalator można uruchamiać wielokrotnie. Kroki już wykonane są pomijane, a przy każdym z nich instalator podaje powód:

- zależności są zgodne z `package-lock.json`,
- `.env` już istnieje (nigdy nie jest nadpisywany),
- PostgreSQL pod `DATABASE_URL` przyjmuje połączenia,
- brak oczekujących migracji.

Docker nie jest potrzebny, jeśli masz już PostgreSQL: ustaw `DATABASE_URL` w środowisku albo w `.env`, a instalator połączy się z tą bazą i nie uruchomi kontenera. Docker jest używany tylko wtedy, gdy pod `DATABASE_URL` nic nie odpowiada, a adres jest domyślny z `.env.example`. Po błędzie usuń jego przyczynę i uruchom `npm run setup` ponownie: instalator zacznie od nieudanego kroku.

### Instalacja ręczna

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
| `npm run setup` | Idempotentna instalacja środowiska lokalnego (zależności, `.env`, PostgreSQL, migracje) |
| `npm run dev` | Serwer deweloperski |
| `npm run build` / `npm start` | Build produkcyjny i jego uruchomienie |
| `npm run lint` | ESLint dla całego repo |
| `npm run typecheck` | Sprawdzenie typów we wszystkich pakietach |
| `npm test` | Testy jednostkowe z pokryciem 100% |
| `npm run test:integration` | Testy integracyjne (Testcontainers) |
| `npm run test:e2e` | Testy E2E (agent-browser, po `npm run build`) |
| `npm run db:migrate` | Zastosowanie migracji |
| `npm run db:migration:create` | Nowa migracja na podstawie zmian w encjach |
| `npm run db:migration:list` | Lista zastosowanych migracji |

Nowy komponent shadcn dodajesz poleceniem `npx shadcn@latest add <komponent>`, uruchomionym w `packages/ui`.

## Testy i CI

| Rodzaj | Komenda | Co sprawdza |
| --- | --- | --- |
| Jednostkowe | `npm test` (`npm run test:unit`) | Cały kod w `packages/*/src` i `scripts/`, z wymaganym **100% pokryciem** (raport w `coverage/`). |
| Integracyjne | `npm run test:integration` | Migracje i serwisy na prawdziwym PostgreSQL, uruchamianym efemerycznie przez **Testcontainers**. |
| E2E | `npm run build && npm run test:e2e` | Aplikacja uruchomiona efemerycznie (`next start` + PostgreSQL z Testcontainers), sterowana przez **[agent-browser](https://github.com/vercel-labs/agent-browser)**. |

- **Testy jednostkowe** (Vitest, `*.test.ts(x)` obok kodu) mockują zależności zewnętrzne i nie potrzebują bazy.
- **Testy integracyjne i E2E** wymagają Dockera. Zamiast niego możesz ustawić `TEST_DATABASE_URL`, który musi wskazywać **osobną, jednorazową** bazę, bo testy kasują jej schemat.
- **agent-browser** potrzebuje przeglądarki Chrome. Pobierasz ją jednorazowo:

  ```bash
  npx agent-browser install            # na Linuksie: --with-deps
  ```

**CI** (`.github/workflows/ci.yml`) uruchamia na każdym pull requeście równolegle: lint i typecheck, build, testy jednostkowe (próg 100%), integracyjne i E2E.

## Dla agentów AI

Zasady pracy, architektura obowiązująca agentów i struktura `.ai/` (specyfikacje, logi przebiegów, wnioski) są opisane w [`AGENTS.md`](AGENTS.md).
