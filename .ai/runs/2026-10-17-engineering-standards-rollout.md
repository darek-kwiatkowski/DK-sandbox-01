# Przebieg: wdrożenie `.ai/docs/engineering-standards.md`

- **Data:** 2026-10-17
- **Specyfikacja:** [.ai/specs/implemented/2026-10-17-engineering-standards-rollout.md](../specs/implemented/2026-10-17-engineering-standards-rollout.md)
- **Stan:** zakończony. Kroki 4–6 dokumentu czekają na pierwsze funkcje; krok 8 jest niewykonalny.

## Decyzje

- Dokument opisuje inny bootstrap: mapowanie interpretacji jest w specyfikacji.
- `GET /api/users` jest jawnie publiczny, bo koncept `auth` jeszcze nie istnieje (zachowane zachowanie `/backend`).
- `makeCrudRoute` zwraca zawsze 4 metody (405 dla nieskonfigurowanych), żeby eksporty route'ów miały pełne typy.
- Komunikaty `AppError` są po polsku, bo trafiają do UI z `lang="pl"`.
- Wcześniejsza propozycja stacku i wpis lessons o `cache()` zostały usunięte z drzewa przez użytkownika (po commicie `9554ec2`). Nie odtwarzano ich; `withScope` i tak usuwa problem z `cache()`.

## Dziennik

- Kopia zapasowa: `/tmp/devmentor-backup-before-standards.tgz` (stan: commit `9554ec2` + `.ai/docs/`).
- **Faza A:**
  - koncept `auth` w podfolderach; odwrócenie zależności na `core → db`; jawny kontener i `withScope`,
  - brak diffu migracji; sondy ESLint 14/14,
  - `lint`, `typecheck`, `test` i `build` zielone.
- **Faza B:**
  - `core/http` (errors, envelope, validation, api-handler, auth, make-crud-route), `env`, `logger`,
  - `ui/backend` (api, feedback, tables, forms), shadcn w `components/ui/`,
  - testy: core 35, ui 15; mutacje (CSRF, kolejność auth, fieldErrors) wykryte,
  - poprawiony błąd: walidacja przed autoryzacją w `makeCrudRoute`.
- **Faza C:**
  - `api/users`, `api/health`, `/backend` przez `apiCall` i `DataTable`,
  - start produkcyjny bez bazy (200 na stronach i health, 500 bez wycieku na users) oraz z bazą (czysty JSON),
  - Chromium (Playwright w `/tmp/pw`): tabela, stan błędu, 0 błędów JS; sondy ESLint 6/6.
- **Faza D:**
  - `AGENTS.md`, `README.md` i `.env.example` zaktualizowane,
  - weryfikacja na czystej kopii (`npm ci`, `lint`, `typecheck`, 54 testy, `build`, `npm audit`) oraz podgląd :3000.
- Sprzątanie: klaster `/tmp/test-pg`, serwery :3200, `/tmp/verify` i `/tmp/pw` usunięte. Podgląd platformy (PID 21400) nietknięty.
