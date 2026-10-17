# Specyfika środowiska sandboksa (OpenMercato)

- **Data:** 2026-10-17
- **Kontekst:** konfiguracja monorepo DevMentor. Build, migracje i serwer dev zachowywały się inaczej, niż wynikało z kodu.
- **Wnioski:**
  1. Sandbox ustawia globalnie `NODE_ENV=development`. Z tą wartością `next build` pada na prerenderze `/_global-error` (`Cannot read properties of null (reading 'useContext')`). Problem nie leży w kodzie.
  2. Sandbox ustawia `DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/open-mercato`. To dedykowany PostgreSQL platformy, na którym działa baza deweloperska projektu. Ta zmienna ma pierwszeństwo przed `.env`, więc migracje i aplikacja zawsze trafiają do `open-mercato`. Na porcie 5432 nie da się postawić drugiego serwera.
  3. Platforma sama uruchamia podgląd (`npm run dev` z `openmercato.toml`) na porcie 3000 i restartuje go po zmianach. Next.js odmawia startu drugiego `next dev` w tym samym katalogu.
  4. `mv` / `git mv` katalogów zwraca `Invalid cross-device link` (overlay FS).
  5. Nie ma `ss`/`netstat`, więc `ss ... || echo free` daje fałszywe „wolne”. `pkill -f <wzorzec>` dopasowuje też powłokę narzędzia, która ma wzorzec w linii poleceń, i ją zabija (exit 144).
  6. W sandboksie nie ma przeglądarki. Playwright z Chromium instaluje się poza repo: `mkdir /tmp/pw && cd /tmp/pw && npm i playwright && npx playwright install chromium` (binaria lądują w `~/.cache/ms-playwright`). W lokatorach `getByRole("alert")` filtruj tekstem (`.filter({ hasText: /\S/ })`), bo Next.js renderuje pusty route announcer z `role="alert"`.
- **Jak stosować:**
  - Weryfikuj build poleceniem `NODE_ENV=production npm run build`.
  - Pamiętaj, że `npm run db:migrate` zmienia bazę `open-mercato`. Dane testowe usuwaj po sobie.
  - Testy HTTP rób na działającym `http://localhost:3000`, bez stawiania drugiego serwera.
  - Procesy znajduj przez `ps -eo pid,args` i `ls -l /proc/<pid>/cwd`, zabijaj po PID. Nie zabijaj podglądu platformy (`next-server` z cwd `/workspace/packages/app`).
  - Katalogi przenoś przez `cp -a`, potem `diff -r` i `rm -rf`. Git i tak wykryje rename.
