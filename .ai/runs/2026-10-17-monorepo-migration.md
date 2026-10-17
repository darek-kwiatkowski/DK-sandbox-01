# Przebieg: migracja do monorepo (fazy 1–2)

- **Data:** 2026-10-17
- **Specyfikacja:** [.ai/specs/2026-10-17-monorepo-migration-plan.md](../specs/2026-10-17-monorepo-migration-plan.md)
- **Stan:** zakończony (fazy 1–2); faza 3 czeka na decyzję człowieka (framework testowy)

## Cel

Zweryfikować i domknąć fazę 1 (struktura monorepo), a następnie wdrożyć pierwszą nieukończoną fazę planu.

## Dziennik

- Stan wyjściowy: struktura `packages/{app,core,db,ui}` istnieje w drzewie roboczym (niezacommitowana) z poprzedniego kroku. Specyfikacja bazowa była już w `implemented/`, ale bez planu z fazami. Utworzono plan.
- Audyt importów: każdy pakiet importuje tylko zadeklarowane zależności, kierunek zależności zgodny z AGENTS.md, brak importów względnych między pakietami.
- Faza 1, weryfikacja w kopii `/tmp/verify` po `npm ci`:
  - `lint`, `typecheck` i `build` przechodzą (build z `NODE_ENV=production`, patrz lessons),
  - własny pusty PostgreSQL na :5433: `db:migrate` tworzy `users`, a `migration:create` zgłasza „No changes required” (snapshot o stałej nazwie działa przy innej nazwie bazy),
  - `npm start`: `/` 200, `/backend` 200 (pusty stan, a po insercie dane), `/nope` 404.

  Klaster i serwer sprzątnięte, podgląd platformy (:3000) nietknięty.
- Incydent: `pkill -f "next start --port 3200"` zabił powłokę narzędzia (exit 144). Proces znaleziono potem przez `/proc/<pid>/cwd` i zabito po PID. Dopisano do lessons.
- Faza 2: reguły granic w `eslint.config.mjs`.
  - Sondy z naruszeniami w każdym zakresie dały 18/18 błędów, plik z dozwolonymi importami 0 błędów. Sondy usunięte.
  - `lint`, `typecheck` i `build` mają exit 0, podgląd `/` i `/backend` zwraca 200.
- AGENTS.md: dopisana reguła o egzekwowaniu granic i ostrzeżenie o `--fix`. Zaktualizowany plan.
- Komendy uruchamiane na kopii i lokalnie: `npm ci`, `npm run lint`, `npm run typecheck`, `NODE_ENV=production npm run build`, `npm run db:migrate`, `npm run db:migration:create`, `npm start`, `npx eslint <sondy>`.
