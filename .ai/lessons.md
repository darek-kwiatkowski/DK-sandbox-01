# Lessons

Indeks długoterminowej pamięci projektu. Przeczytaj go przed rozpoczęciem pracy.

Szczegółowe wpisy trafiają do `.ai/lessons/YYYY-MM-DD-slug.md`. Tutaj dodaj tylko jednolinijkowy wskaźnik.

## Format wpisu w indeksie

```
- [YYYY-MM-DD-slug](lessons/YYYY-MM-DD-slug.md) — jednozdaniowe podsumowanie, kiedy to stosować
```

## Format pliku w `lessons/`

```markdown
# Tytuł

- **Data:** YYYY-MM-DD
- **Kontekst:** co robiono / jaki błąd naprawiano
- **Wniosek:** co ustalono
- **Jak stosować:** konkretna reguła na przyszłość
```

## Wpisy

<!-- Dodawaj nowe wpisy poniżej, od najnowszych. -->

- [2026-10-31-review-shared-contracts-across-flows](lessons/2026-10-31-review-shared-contracts-across-flows.md) — review shared primitives through their first consumer and all competing identity/transaction paths; reconcile summaries and tests after changing a contract.

- [2026-10-31-page-guards-not-in-root-layouts](lessons/2026-10-31-page-guards-not-in-root-layouts.md) — role gates go in `page.tsx` via `pageScope`, not in group root layouts (`forbidden()` is experimental there, and layouts need a second scope).
- [2026-10-31-coverage-include-scripts-mjs-only](lessons/2026-10-31-coverage-include-scripts-mjs-only.md) — `coverage.include` counts only `scripts/**/*.mjs`; widen it when adding a `.ts` script.
- [2026-10-26-brief-table-edits-anchor-on-row-start](lessons/2026-10-26-brief-table-edits-anchor-on-row-start.md) — wiersze tabel briefu wyszukuj po prefiksie linii, bo id występują też w innych kolumnach.
- [2026-10-26-research-files-not-trustworthy-by-name](lessons/2026-10-26-research-files-not-trustworthy-by-name.md) — przed oceną briefu sprawdzaj istnienie i treść cytowanych plików oraz numery issue; część plików w `research/` ma treść niezgodną z nazwą.
- [2026-10-24-discovery-brief-citation-paths](lessons/2026-10-24-discovery-brief-citation-paths.md) — lokalne cytowania w briefie weryfikuj względem katalogu briefu.
- [2026-10-20-setup-detects-real-state](lessons/2026-10-20-setup-detects-real-state.md) — kroki instalatora pomijaj po sprawdzeniu zasobu (sonda PostgreSQL), nie po konfiguracji; `migration:pending` nie sprawdza połączenia.
- [2026-10-17-testing-pitfalls](lessons/2026-10-17-testing-pitfalls.md) — coverage per `--project` mierzy 0/0; nic w `db/src/migrations/` poza migracjami; Docker w sandboksie przez `sudo dockerd`, plugin `docker compose` z wydania GitHub.
- [2026-10-17-full-install-output](lessons/2026-10-17-full-install-output.md) — po instalacji sprawdzaj `ERESOLVE`/peer w pełnym logu; nie dobieraj wersji głównych bez sprawdzenia peerDependencies.
- [2026-10-17-sandbox-environment](lessons/2026-10-17-sandbox-environment.md) — sandbox: `NODE_ENV=development` psuje `next build`, `DATABASE_URL` wskazuje bazę `open-mercato`, podgląd zajmuje :3000, `mv` katalogów nie działa, brak `jq` (wymagany przez skille `om-*`); stosuj przy buildzie, migracjach i testach.
