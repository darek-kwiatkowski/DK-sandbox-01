# Przebieg: migracja do monorepo — faza 3 (testy)

- **Data:** 2026-10-17
- **Specyfikacja:** [.ai/specs/2026-10-17-monorepo-migration-plan.md](../specs/2026-10-17-monorepo-migration-plan.md)
- **Stan:** zakończony. Następna jest faza 4 (CI).

## Cel

Wdrożyć pierwszą nieukończoną fazę planu, czyli fazę 3 (testy automatyczne).

## Decyzje

- **Vitest 5.** Rekomendacja planu. Użytkownik nie wybrał innego frameworka i poprosił o kontynuację.
- **`TEST_DATABASE_URL` zamiast `DATABASE_URL`.** W sandboksie `DATABASE_URL` wskazuje dev-bazę `open-mercato` (patrz lessons), a testy kasują schemat. Bez tej zmiennej testy są pomijane, a przy równych adresach test się przerywa.
- **`createDbModule(overrides)`.** Testy nie muszą nadpisywać zmiennych środowiskowych.
- **ESLint 10 → 9.39.5.** Konflikt peer dependencies z wtyczkami `eslint-config-next`, wykryty przy instalacji Vitesta.

## Dziennik

- Stan wyjściowy: fazy 1–2 oznaczone ✅, `lint` i `typecheck` mają exit 0.
- Instalacja `vitest` w `core` i `db` ujawniła ostrzeżenia `ERESOLVE` dla `eslint` 10. Downgrade do 9.39.5 i `npm install` bez ostrzeżeń.
- `core/src/di/container.test.ts`: 5 testów. Mutacja `strict: false` dała 1 failed. Przywrócono.
- `db/src/db.integration.test.ts`: 4 testy na własnym PostgreSQL 17 (:5433, `/tmp/test-pg`):
  - mutacja (pole `bio` bez migracji) dała 1 failed z brakującym SQL,
  - bezpiecznik przy równych URL dał exit 1, tabela kontrolna przetrwała,
  - po przebiegu baza testowa ma 0 tabel.
- `console.warn` z pominiętego pliku nie jest wyświetlany przez Vitest. Usunięto go, a wymaganie przeniesiono do nazwy zestawu i dokumentacji.
- Sondy ESLint ponownie: reguły granic działają na ESLint 9, także w plikach `*.test.ts`. Sondy usunięte.
- Wyniki końcowe:
  - `lint`, `typecheck` i `NODE_ENV=production npm run build` mają exit 0,
  - `npm test`: exit 0, bez bazy 5 passed / 4 skipped, z `TEST_DATABASE_URL` 9/9,
  - podgląd `/` i `/backend` zwraca 200,
  - `db:migration:list` na dev-bazie (tylko odczyt) działa.
- Klaster testowy zatrzymany i usunięty.
- Zaktualizowano AGENTS.md (weryfikacja, testy, baza testowa, wersja ESLint), README (sekcja Testy), `.env.example` i plan.
