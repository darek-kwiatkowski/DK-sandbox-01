# Pułapki testów (Vitest projects, migracje, Docker w sandboksie)

- **Data:** 2026-10-17
- **Kontekst:** konfiguracja CI z progiem 100% pokrycia, Testcontainers i agent-browser.
- **Wnioski:**
  1. `vitest run --project <x> --coverage --coverage.include=...` z roota zwraca **0/0 plików** i exit 0, bo globy liczą się od roota projektu. Taki wynik nic nie mierzy. Wiarygodny jest tylko pełny `npm run test:unit` (próg 100% w `vitest.config.ts`) albo `npx vitest run --root packages/<x> --coverage --coverage.include='src/**/*.{ts,tsx}'`.
  2. Równoległe przebiegi coverage nadpisują wspólny katalog `coverage/`. Przy pracy równoległej używaj `--coverage.reportsDirectory=/tmp/...`.
  3. **Nie umieszczaj żadnych plików `.ts`, w tym testów, w `packages/db/src/migrations/`.** Migrator traktuje każdy plik `.ts` w tym katalogu jako migrację. Test migracji leży w `packages/db/src/migrations.test.ts`.
  4. Sandbox domyślnie nie ma Dockera, ale `sudo` działa. Docker można uruchomić tak: `sudo apt-get install -y docker.io`, potem `sudo dockerd &` i `sudo chmod 666 /var/run/docker.sock`. Kontenery działają z losowymi portami (`-p 127.0.0.1::5432`); stały port hosta może kolidować. Po restarcie sandboksa `dockerd` trzeba uruchomić ponownie. Pakiet `docker.io` nie ma pluginu `docker compose`, a apt nie ma `docker-compose-v2`/`docker-compose-plugin`. Plugin instalujesz z wydania GitHub do `~/.docker/cli-plugins/docker-compose`. `docker-compose.yml` testuj na kopii z innym portem, bo 5432 zajmuje PostgreSQL platformy.
  5. agent-browser 0.39 działa bez swojego `postinstall` (blokowanego przez npm 11), bo binaria są w paczce. Przeglądarkę wykrywa automatycznie (np. Chromium z `~/.cache/ms-playwright`). W CI instaluje ją `npx agent-browser install --with-deps`. `CardTitle` z shadcn to `div`, a nie heading, więc w E2E szukaj tekstu, a nie roli `heading`.
- **Jak stosować:** przed raportowaniem pokrycia uruchom pełny `npm run test:unit`. Testy integracyjne i E2E uruchamiaj lokalnie przez Testcontainers. `TEST_DATABASE_URL` służy tylko jako fallback.
