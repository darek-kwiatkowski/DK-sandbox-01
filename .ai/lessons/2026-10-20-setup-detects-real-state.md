# Instalator sprawdza rzeczywisty stan, a nie konfigurację

- **Data:** 2026-10-20
- **Kontekst:** `npm run setup` (issue #3). Pierwsza wersja decydowała o uruchomieniu Dockera, porównując `DATABASE_URL` z adresem z `.env.example`. Użytkownik poprawił, że działający PostgreSQL pod `DATABASE_URL` ma być użyty bez Dockera, także pod domyślnym adresem.
- **Wniosek:** krok idempotentnego instalatora pomija się na podstawie sprawdzenia zasobu (np. połączenia z bazą), a nie na podstawie wartości w konfiguracji. Docker to fallback, nie wymóg. `mikro-orm migration:pending` nie nadaje się do sprawdzania połączenia: przy nieosiągalnej bazie kończy się kodem 0 i wypisuje wszystkie migracje jako oczekujące.
- **Jak stosować:** dostępność PostgreSQL sprawdzaj sondą TCP z SSLRequest (`probePostgres` w `scripts/setup/installer.mjs`). Sonda nie sprawdza haseł, więc błędne dane logowania wychodzą dopiero przy migracji. Komunikat błędu migracji musi wskazywać na `DATABASE_URL`.
