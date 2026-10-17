# Plan migracji do monorepo DevMentor

- **Data:** 2026-10-17
- **Status:** w realizacji
- **Specyfikacja bazowa:** [implemented/2026-10-17-devmentor-monorepo-foundation.md](implemented/2026-10-17-devmentor-monorepo-foundation.md)
- **Architektura:** `AGENTS.md` (sekcja „Architektura DevMentor”), `README.md`

## Fazy

### Faza 1 — Struktura monorepo i przeniesienie aplikacji ✅

Zakres:
- npm workspaces,
- przeniesienie aplikacji do `packages/app`,
- wydzielenie `core` (DI), `db` (MikroORM, encje, migracje) i `ui` (shadcn),
- zależności między pakietami, importy przez nazwy pakietów,
- skrypty w roocie i migracja początkowa.

Kryteria ukończenia:
- [x] `npm run lint`, `npm run typecheck`, `npm run build` z roota przechodzą
- [x] `npm run db:migrate` tworzy schemat na **pustej**, odizolowanej bazie, a `db:migration:create` nie wykrywa różnic
- [x] `npm run dev` (komenda podglądu z `openmercato.toml`) serwuje `/` (Tailwind) i `/backend` (shadcn, dane z bazy przez DI)
- [x] żaden pakiet nie importuje niezadeklarowanych zależności ani innego pakietu ścieżką względną

### Faza 2 — Egzekwowanie granic architektury ✅

Zakres: reguły z AGENTS.md (kierunek zależności, frontend bez `@devmentor/ui`, `core` niezależny od frameworka, brak importów względnych między pakietami) wymuszane przez ESLint, nie tylko przez dokumentację.

Kryteria ukończenia:
- [x] naruszenie każdej reguły daje błąd `npm run lint` (sprawdzone na celowo złym kodzie)
- [x] obecny kod przechodzi `npm run lint` bez wyjątków i wyłączeń

### Faza 3 — Testy automatyczne ✅

Zakres: framework testowy: Vitest (rekomendacja planu, przyjęta przy braku innej decyzji użytkownika), skrypt `npm test`, testy jednostkowe `core` (kontener, scope) i test integracyjny `db` (migracja i `UserService` na izolowanej bazie).

Kryteria ukończenia:
- [x] `npm test` z roota przechodzi
- [x] zasada weryfikacji w AGENTS.md obejmuje `npm test`

### Faza 4 — CI (przeniesiona do [2026-10-17-ci-and-test-coverage.md](2026-10-17-ci-and-test-coverage.md))

Zakres: pipeline z `lint`, `typecheck`, `build`, migracjami na serwisie PostgreSQL i testami.

Kryteria ukończenia:
- [ ] pipeline przechodzi na czystym checkoucie

## Postęp

<!-- Najnowsze wpisy na górze. -->

- **2026-10-17 — Faza 3 ukończona.**
  - Vitest 5 w `core` i `db`; `npm test` w roocie uruchamia testy we wszystkich pakietach.
  - `core`: 5 testów jednostkowych DI (kolejność modułów, PROXY, singleton/scoped, strict, dispose). Mutacja `strict: false` wykryta.
  - `db`: 4 testy integracyjne na PostgreSQL przez `TEST_DATABASE_URL`:
    - migracje działają na pustej bazie,
    - migracje pokrywają encje (mutacja: pole bez migracji wykryta, test pokazał brakujący SQL),
    - `UserService` przez DI z osobnymi `em` per scope,
    - duplikat e-maila odrzucony.
  - Bezpiecznik `TEST_DATABASE_URL == DATABASE_URL` przerywa test (exit 1), a schemat zostaje nietknięty (sprawdzone tabelą kontrolną).
  - Refaktor `db`:
    - `createOrmConfig` honoruje `clientUrl` z overrides,
    - nowy `createDbModule(overrides)`,
    - opcje migratora w `migrator-config.ts`, wspólne dla CLI i testów.
  - Poprawka: `eslint` 10 → 9.39.5, bo wtyczki `eslint-config-next` deklarują peer `eslint ^9`. `npm install` nie zgłasza już `ERESOLVE`. Reguły granic z fazy 2 sprawdzone ponownie sondami.
  - Wyniki: `lint`, `typecheck`, `build` i `npm test` mają exit 0 (bez bazy 5 passed / 4 skipped, z izolowaną bazą 9/9), podgląd `/` i `/backend` zwraca 200.
- **Następny etap: Faza 4 (CI)**, ostatnia. Repo ma `origin` na GitHubie, więc pipeline to GitHub Actions. Musi ustawić `TEST_DATABASE_URL` na serwis PostgreSQL. Kryterium „przechodzi na czystym checkoucie” wymaga wypchnięcia gałęzi (wymaga zgody użytkownika).

- **2026-10-17 — Faza 2 ukończona.** `eslint.config.mjs` wymusza teraz:
  - `import/no-relative-packages`,
  - `import/no-extraneous-dependencies` (devDependencies tylko w plikach `*.config.*`),
  - `@typescript-eslint/no-restricted-imports` per zakres: `core`, `db`, `ui`, trasy `app` (dane tylko przez DI, typy dozwolone) i `(frontend)` (bez `@devmentor/ui`).

  Weryfikacja:
  - sondy z celowymi naruszeniami w każdym zakresie dały 18/18 oczekiwanych błędów,
  - plik z dozwolonymi importami dał 0 błędów,
  - sondy usunięto,
  - `lint`, `typecheck` i `build` przechodzą (exit 0), podgląd `/` i `/backend` zwraca 200.

  Uwaga: `--fix` reguły `no-relative-packages` podsuwa ścieżkę spoza `exports` (opisane w AGENTS.md).


- **2026-10-17 — Faza 1 ukończona.** Weryfikacja na kopii drzewa po `npm ci` (bez lokalnego stanu):
  - `lint`, `typecheck` i `build` przechodzą,
  - na pustym, odizolowanym PostgreSQL migracja tworzy schemat `users`, a `migration:create` zgłasza „No changes required”,
  - build produkcyjny (`npm start`): `/` 200, `/backend` 200 (stan pusty, potem dane po insercie), nieznana ścieżka 404,
  - podgląd `npm run dev` na :3000 zwraca 200,
  - audyt importów nie wykazał niezadeklarowanych zależności ani importów względnych między pakietami.
