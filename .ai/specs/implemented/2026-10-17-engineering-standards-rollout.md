# Wdrożenie `.ai/docs/engineering-standards.md`

- **Data:** 2026-10-17
- **Status:** wdrożona (2026-10-17) w zakresie kroków 1–3, 7 i 9 dokumentu. Kroki 4–6 (events, validators, kolejne koncepty) realizuje się przy pierwszej funkcji, która ich potrzebuje. Krok 8 jest niewykonalny (brak `docs/product-scope.md`).
- **Źródło (nadrzędne):** [`.ai/docs/engineering-standards.md`](../../docs/engineering-standards.md) (status „active”, decyzje potwierdzone z właścicielem projektu)
- **Punkt wyjścia:** commit `9554ec2` (monorepo po fazach 1–3 planu migracji). Wcześniejsza propozycja stacku (Better Auth, Server Actions, Cache Components) została usunięta z drzewa roboczego i nie obowiązuje.

## Mapowanie dokumentu na to repozytorium

Dokument opisuje stan wyjściowy innego bootstrapu. Poniżej przyjęte interpretacje:

| Dokument zakłada | Stan w repo | Decyzja |
| --- | --- | --- |
| `entities/user.entity.ts`, `base.entity.ts` | `db/src/entities/user.ts`, brak bazy | → `entities/auth/user.entity.ts` + `entities/base.entity.ts` (wspólne `id` UUID i `createdAt`). Schemat bez zmian, weryfikowany przez brak diffu migracji. |
| `entities/mentor-profile.entity.ts` | nie istnieje | Pomijamy, bo pojawi się z konceptem `mentors` (YAGNI, zgodnie z dokumentem). |
| `define.ts` | nie istnieje, cel nieopisany | Pomijamy i zgłaszamy jako niejasność. |
| `services/user.service.ts` w `core`; `container.ts` + `cradle.ts` w `core`; `withScope` | `UserService` w `db`; kontener z `ContainerModule` i rozszerzaniem `AppCradle`; `getRequestScope` w `app` | `core/src/services/auth/user.service.ts`; jawny `core/src/container/{container.ts,cradle.ts}`; `withScope(fn)` w `core`. Przy okazji naprawia to błąd z React `cache()` w akcjach i route handlerach. |
| Kierunek `app → core → db`; `@mikro-orm/*` tylko w `db` | `app → ui, db, core`; `db → core` | Odwracamy: `core → db`. `db` nie zależy od innych pakietów. `app` używa `core` i `ui`, a `db` tylko przez `core`. `db` re-eksportuje typy potrzebne `core` (`EntityManager`, wyjątki). Reguły ESLint przepisane. |
| `/admin/users` (strona demo) | `/backend` (lista użytkowników, shadcn) | Refaktor `/backend` według kroku 3: `api/users/route.ts` (`makeCrudRoute`) + `apiCall` + `DataTable`. URL `/backend` bez zmian. |
| `/api/health` | nie istnieje | Dodajemy `api/health/route.ts` przez `apiHandler`, bo krok 9 traktuje go jako test regresji. |
| Grupy tras person `(marketing)` itd. | `(frontend)` | `(frontend)` → `(marketing)` (landing S01). Pozostałe grupy powstaną z konceptami. |
| shadcn w `ui/src/components/ui/` | `ui/src/components/*.tsx` | Przenosimy prymitywy do `components/ui/` i aktualizujemy aliasy `components.json`. |
| `requireSession`/JWT | brak konceptu `auth` | `core/src/http/auth.ts` weryfikuje JWT HS256 (`AUTH_SECRET` ≥ 32 bajty z `env.ts`) i rzuca błędy *fail-closed*. Logowanie i rejestracja przyjdą z konceptem `auth`. |
| `api/users` chronione przez auth | logowania jeszcze nie ma | `GET /api/users` jest **jawnie publiczny** (oznaczony w kodzie) i odtwarza obecne zachowanie `/backend`. Nie wystawiamy `POST`/`PUT`/`DELETE`. Do zabezpieczenia razem z konceptem `auth`. |
| Reguła „frontend: czysty Tailwind, backend: shadcn” (AGENTS.md) | w ESLint | Godzimy z dokumentem: `(marketing)` nie importuje prymitywów `components/ui/*` ani `backend/*`; komponenty konceptów `components/<concept>/*` są dozwolone. |
| `docs/product-scope.md` (krok 8) | nie istnieje | Nie da się wykonać; zgłaszamy. |
| `events/`, `validators/` (kroki 4–5) | — | Zgodnie z dokumentem dopiero przy pierwszej funkcji, która ich potrzebuje. |

## Fazy

### Faza A — przeniesienie konceptu `auth` i odwrócenie zależności (krok 1) ✅
- [x] encja w `entities/auth/`, `base.entity.ts`, brak diffu migracji
- [x] `UserService` w `core/src/services/auth/`, jawny `container.ts` / `cradle.ts`, `withScope`
- [x] `core → db`, ESLint z nowymi granicami (sondy)
- [x] `lint`, `typecheck`, `test` (z bazą testową), `build`

### Faza B — warstwy wielokrotnego użytku (krok 2) ✅
- [x] `core/src/http/{errors,apiHandler,makeCrudRoute,auth}.ts`, `core/src/logger.ts`, `core/src/config/env.ts`, z testami
- [x] `ui/src/backend/{api,forms,tables,feedback}`, prymitywy shadcn w `components/ui/`, z testami
- [x] reguły ESLint: brak `fetch` poza `ui/src/backend/api`, brak `try/catch` w `route.ts`, `no-explicit-any`, `no-console`

### Faza C — przykład referencyjny (krok 3) i health ✅
- [x] `api/users/route.ts` (`makeCrudRoute`, tylko GET), `api/health/route.ts`, `/backend` przez `apiCall` + `DataTable`
- [x] aplikacja buduje się i startuje **bez dostępnej bazy**

### Faza D — dokumentacja (krok 7) i weryfikacja (krok 9) ✅
- [x] `AGENTS.md`: sekcje z §3 dokumentu, pogodzone z istniejącymi; README
- [x] pełna weryfikacja: `npm ci`, `lint`, `typecheck`, `test`, `build`, start z bazą i bez niej, `/backend` i `/api/health`

## Postęp

<!-- Najnowsze wpisy na górze. -->

- **Faza D ✅.**
  - Dokumentacja:
    - `AGENTS.md`: sekcje „Konwencja konceptów domenowych” i „Warstwa API i UI wielokrotnego użytku” (§3 dokumentu, po polsku), przepisane pakiety, kierunek zależności, reguły Next/DI/DB, sekcja bezpieczeństwa, `docs/` w strukturze `.ai/`,
    - `README.md`: architektura, koncepty, przepływ żądania,
    - `.env.example`: `LOG_LEVEL`, `AUTH_SECRET`.
  - Weryfikacja na czystej kopii po `npm ci`:
    - 0 `ERESOLVE`; `lint`, `typecheck` i `build` exit 0,
    - `npm test` z izolowaną bazą: core 37, db 2, ui 15, bez pominięć,
    - `npm audit --omit=dev`: 8 high, wyłącznie znany łańcuch `braces` (awilix, shadcn), bez poprawki upstream; nowe zależności niczego nie dodały,
    - podgląd dev (:3000): `/`, `/backend`, `/api/health` i `/api/users` zwracają 200; w Chromium stan pusty, 0 błędów JS.

- **Faza C ✅.**
  - Endpointy:
    - `api/users/route.ts`: `makeCrudRoute`, tylko `GET`, jawnie `access: "public"` z komentarzem, `force-dynamic`,
    - `api/health/route.ts`: `apiHandler`, bez bazy,
    - `/backend`: `UsersTable` (obok strony), korzysta z `useApiResource`, `apiCall` i `DataTable`.
  - Zmiany w `core` przy okazji:
    - `makeCrudRoute` zawsze zwraca GET/POST/PUT/DELETE, a nieskonfigurowane odpowiadają 405 (`MethodNotAllowedError`), żeby eksporty route'ów były w pełni typowane,
    - komunikaty `AppError` przetłumaczone na polski, bo trafiają do UI.
  - Build produkcyjny:
    - **bez bazy:** `/`, `/backend` i `/api/health` zwracają 200; `/api/users` zwraca 500 z ogólnym komunikatem, bez szczegółów, zalogowane w pino (`level 50`); `POST` daje 405,
    - **z bazą:** `/api/users` zwraca czysty JSON.
  - Chromium (Playwright, poza repo): tabela z danymi, stan błędu z „Spróbuj ponownie”, 0 błędów JS.
  - ESLint: sondy wykryły 6/6 naruszeń (`fetch`, `try/catch` w `route.ts`, `any`, `console`, prymitywy i bloki backendu w `(marketing)`), a plik z dozwolonymi importami dał 0 błędów.
- **Faza B ✅.**
  - `core`: `config/env.ts` (zod, leniwie), `logger.ts` (pino + redact), `http/{errors,envelope,validation,api-handler,auth,make-crud-route}.ts`. `UserService` mapuje naruszenie unikalności na `ConflictError`.
  - `ui`: prymitywy w `components/ui/` (aliasy `components.json`, nowe `input`/`label`/`field` z CLI), `backend/{api,feedback,tables,forms}`.
  - Testy: core 35 (+2 integracyjne), ui 15.
  - Mutacje wykryte: brak CSRF, walidacja przed autoryzacją, brak błędów pól z serwera.

- **Faza A ✅.**
  - `db`: `entities/auth/user.entity.ts` i `base.entity.ts`, `createOrm`, re-eksport typów ORM. `db` nie zależy od innych pakietów. CLI zgłasza „No changes required”.
  - `core`: `services/auth/user.service.ts`, `container/{container,cradle}.ts`, `withScope` (scope per wywołanie, z `dispose`). `getContainer` nie jest eksportowany.
  - `app`: bez `@devmentor/db`; `(frontend)` → `(marketing)`.
  - ESLint: nowe granice; sondy wykryły 14/14 naruszeń, a plik z dozwolonymi importami dał 0 błędów.
  - Wyniki: `lint`, `typecheck` i `build` exit 0; `test` z izolowaną bazą: core 4/4, db 2/2; podgląd `/` i `/backend` zwraca 200.
