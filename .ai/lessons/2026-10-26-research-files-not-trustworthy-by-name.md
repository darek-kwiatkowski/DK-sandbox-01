# Pliki w `.ai/specs/research/` weryfikuj po treści, nie po nazwie

- **Data:** 2026-10-26
- **Kontekst:** Odświeżenie briefu (`om-discover --refresh`) i dry run `om-backlog`. Brief cytował 26 nieistniejących rekordów decyzji i nieistniejący `backlog.md`; commit 4366dca nadpisał dwa wywiady w `research/` (working-dev = kopia fintech, platform-dev = treść working-dev), a pięć plików w korzeniu `research/` (`D07-login.md`, `D21-…`, `D22-…`, `D27-…`, `N01-…`) ma treść niezgodną z nazwą. Oryginały są w `devmentor-synthetic-input/.ai/specs/research/` i w git `6ae2c3f`. Identyfikatory D01–D06 miały różne znaczenia w różnych wersjach briefu.
- **Wniosek:** Nazwa pliku, tag źródła ani deklaracja „active” w briefie nie dowodzą, że źródło istnieje i mówi to, co mu przypisano.
- **Jak stosować:** Przed oceną gotowości briefu sprawdź istnienie każdego cytowanego pliku, porównaj sumy kontrolne wywiadów (duplikaty), otwórz rekordy decyzji i zweryfikuj w trackerze numery issue, na które brief się powołuje. Nowy identyfikator decyzji nadawaj dopiero po sprawdzeniu `research/decisions/`, żeby nie zderzył się z istniejącym rekordem.
