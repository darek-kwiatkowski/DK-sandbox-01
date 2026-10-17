# CI na GitHub Actions, testy jednostkowe ze 100% pokryciem, integracja (Testcontainers) i E2E (agent-browser)

- **Data:** 2026-10-17
- **Status:** wdrożona lokalnie (2026-10-17); czeka na pierwszy przebieg na GitHubie (wymaga wypchnięcia gałęzi)
- **Zastępuje:** fazę 4 (CI) z [planu migracji](2026-10-17-monorepo-migration-plan.md)

## Cel

Każdy pull request przechodzi automatycznie:
- build,
- lint (+ typecheck),
- testy jednostkowe ze **100% pokryciem** (lines/branches/functions/statements),
- testy integracyjne na efemerycznym PostgreSQL z **Testcontainers**,
- testy E2E na efemerycznie uruchomionej aplikacji, sterowanej przez **agent-browser** (Vercel Labs).

## Decyzje

| Obszar | Wybór | Uzasadnienie |
| --- | --- | --- |
| Testy jednostkowe | Vitest 5 (już w repo) + `@vitest/coverage-v8` 5.0.5 | Peer `vitest` musi mieć dokładnie tę samą wersję. |
| Zakres pokrycia | `packages/*/src/**/*.{ts,tsx}` bez plików testowych | Cały kod aplikacji, łącznie z wygenerowanymi prymitywami shadcn, migracjami i `mikro-orm.config.ts`. Poza `src` zostają tylko pliki konfiguracji narzędzi (`next.config.ts`, `postcss.config.mjs`), weryfikowane przez build i lint. |
| Progi | 100% dla wszystkich metryk, liczone łącznie w jednym `vitest.config.ts` | 100% łącznie oznacza 100% w każdym pliku, więc słabe pokrycie jednego pakietu nie chowa się w średniej. Nie trzeba powielać konfiguracji per pakiet. |
| Integracja | Root `vitest.integration.config.ts`, `globalSetup` z `@testcontainers/postgresql` | Kontener PostgreSQL 17 na czas przebiegu. `TEST_DATABASE_URL` w środowisku zastępuje kontener (np. gdy brak Dockera). Testy integracyjne nie są już pomijane, tylko failują bez bazy. |
| E2E | Root `test/e2e`, Vitest steruje CLI `agent-browser` (`--json`, osobna sesja) | `globalSetup` stawia kontener, uruchamia migracje przez prawdziwe CLI (`npm run db:migrate`), dane seeduje i czyści przez serwisy `@devmentor/core` i startuje `next start` z buildu produkcyjnego na losowym porcie. |
| Infrastruktura testów | Katalog `test/` w roocie (nie pakiet workspace) | Piąty pakiet wymaga zgody (AGENTS.md); narzędzia repo żyją w roocie. |
| CI | `.github/workflows/ci.yml`, `pull_request`, Node 24, 5 równoległych jobów | `actions/checkout@v7`, `actions/setup-node@v7` (cache npm), `actions/upload-artifact@v7`. Docker jest dostępny na `ubuntu-latest`. |

## Kryteria ukończenia

- [x] `npm run test:unit` (alias `npm test`) przechodzi z progiem 100% w każdym pakiecie
- [x] `npm run test:integration` przechodzi na kontenerze Testcontainers (lokalnie, przez Docker)
- [x] `npm run test:e2e` przechodzi: aplikacja startuje efemerycznie, a agent-browser weryfikuje `/`, `/backend` (dane, stan pusty) i brak błędów JS
- [x] workflow CI ma joby build, lint, unit, integration i e2e; plik jest poprawny składniowo, a kroki są odtworzone lokalnie
- [x] AGENTS.md wymaga 100% pokrycia testami jednostkowymi dla każdej nowej funkcji; README opisuje komendy
- [ ] przebieg CI na GitHubie: wymaga wypchnięcia gałęzi (zgoda użytkownika)

## Postęp

<!-- Najnowsze wpisy na górze. -->

- **2026-10-17 — wdrożenie.**
  - `vitest.config.ts`: projekty `app`, `core`, `db`, `ui`; coverage v8, próg 100% łącznie (czyli w każdym pakiecie).
  - `vitest.integration.config.ts` + `test/integration/global-setup.ts`: Testcontainers `postgres:17-alpine`.
  - `vitest.e2e.config.ts` + `test/e2e/global-setup.ts`: kontener → `npm run db:migrate` → `next start` na wolnym porcie → `/api/health`. Do tego `test/support/agent-browser.ts` i 5 scenariuszy w `test/e2e/app.e2e.test.ts`.
  - `.github/workflows/ci.yml`: 5 jobów; actionlint OK.
  - 26 nowych lub rozszerzonych plików testów jednostkowych, 139 testów. Pokrycie: lines 354/354, branches 207/207, functions 127/127, statements 366/366. Bez komentarzy `ignore` i bez zmian w kodzie źródłowym.
  - Lokalnie (Docker zainstalowany w sandboksie): `lint`, `typecheck`, `test:unit`, `test:integration` (4), `build` i `test:e2e` (5) mają exit 0.
  - Mutacje:
    - nieprzetestowana funkcja daje `test:unit` exit 1 (próg),
    - zmieniony tekst stanu pustego wywraca test E2E.
