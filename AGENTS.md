<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Struktura `.ai/` i obowiązkowy workflow

Katalog `.ai/` to pamięć i warsztat agentów AI w tym repozytorium. Korzystanie z niego jest **obowiązkowe**.

```
.ai/
├── specs/                  # specyfikacje dla SDD (Spec-Driven Development)
│   ├── YYYY-MM-DD-slug.md  # aktywne specyfikacje
│   ├── implemented/        # specyfikacje w pełni wdrożone
│   └── archive/            # specyfikacje porzucone lub zastąpione
├── docs/                   # trwałe standardy projektu (np. engineering-standards.md); nadrzędne wobec specs
├── runs/                   # logi autonomicznych przebiegów AI
│   └── YYYY-MM-DD-slug.md
├── lessons.md              # indeks wniosków (pamięć długoterminowa)
└── lessons/                # szczegółowe wpisy
    └── YYYY-MM-DD-slug.md
```

Nazwy plików: `YYYY-MM-DD-slug.md`, gdzie data to dzień utworzenia, a `slug` to krótki opis małymi literami, cyframi i myślnikami (np. `2026-10-17-add-order-export.md`). Nie zmieniaj daty po utworzeniu.

### Zasady (MUSISZ je stosować)

1. **Na starcie zadania** przeczytaj `.ai/lessons.md` oraz wpisy z `.ai/lessons/` istotne dla zadania.
2. **Specyfikacje (SDD):**
   - Przy nietrywialnej funkcji lub zmianie zachowania najpierw sprawdź `.ai/specs/`. Jeśli pasująca specyfikacja istnieje, realizuj ją i nie odchodź od niej bez zgody użytkownika.
   - Jeśli jej nie ma, a zadanie jest nietrywialne, zaproponuj lub utwórz specyfikację w `.ai/specs/` przed pisaniem kodu.
   - Po pełnym wdrożeniu przenieś plik do `.ai/specs/implemented/`. Specyfikacje porzucone lub zastąpione przenieś do `.ai/specs/archive/`. Nie usuwaj specyfikacji.
3. **Przebiegi autonomiczne:** każdy przebieg bez bieżącego nadzoru człowieka musi mieć log w `.ai/runs/YYYY-MM-DD-slug.md`. Utwórz go na początku i aktualizuj w trakcie. Zapisuj: cel, powiązaną specyfikację, podjęte decyzje, wykonane kroki, uruchomione komendy i wyniki testów, problemy oraz stan końcowy (zakończony / przerwany / wymaga decyzji człowieka).
4. **Wnioski:** po naprawieniu błędu, po korekcie od użytkownika, po odkryciu nieoczywistej własności projektu lub wtedy, gdy użytkownik prosi o zapamiętanie czegoś, zapisz wpis w `.ai/lessons/YYYY-MM-DD-slug.md` i dodaj jednolinijkowy wskaźnik do `.ai/lessons.md`. Przed dodaniem sprawdź, czy istniejący wpis nie pokrywa tematu. Jeśli tak, zaktualizuj go. Wpisy błędne usuń.
5. **Nie zapisuj** w lessons tego, co wynika wprost z kodu lub historii git. Nie zapisuj też sekretów, kluczy ani danych osobowych.
6. Nie modyfikuj cudzych podkatalogów w `.ai/` (np. `.ai/<nazwa-użytkownika>/`), chyba że użytkownik o to poprosi.

## Zasady pracy

1. **Plan przed kodem.** Zadanie wieloetapowe, obejmujące kilka plików lub z kilkoma sensownymi podejściami zacznij od planu i uzgodnij go z użytkownikiem. Plan opieraj na specyfikacji z `.ai/specs/` (sekcja „Struktura `.ai/`”, zasada 2). Jeśli implementacja zaczyna się sypać, przerwij, zaktualizuj plan lub specyfikację i dopiero wtedy kontynuuj. Nie łataj na siłę.
2. **Weryfikacja przed zgłoszeniem.** Zanim uznasz zmianę za gotową, uruchom z roota to samo, co CI: `npm run lint`, `npm run typecheck`, `npm run test:unit` (próg 100% pokrycia), `npm run test:integration`, `NODE_ENV=production npm run build` i `npm run test:e2e`. Przy zmianach w schemacie bazy wygeneruj i zastosuj migrację. Przy zmianach w UI dodatkowo sprawdź aplikację w przeglądarce. Raportuj rzeczywiste wyniki. Jeśli coś pominięto albo nie przeszło, napisz to wprost.
3. **Krytyczny przegląd.** Po nietrywialnej poprawce przejrzyj diff tak, jak zrobiłby to recenzent. Jeśli rozwiązanie jest prowizoryczne, zastąp je eleganckim, skoro znasz już pełny kontekst.
4. **Wnioski po poprawkach.** Po każdej korekcie od użytkownika lub naprawie błędu sformułuj regułę, która zapobiegnie powtórce, i zapisz ją zgodnie z zasadą 4 sekcji „Struktura `.ai/`”. Jeśli reguła dotyczy wszystkich przyszłych zadań, zaproponuj dopisanie jej do tego pliku.
5. **Samodzielne naprawianie błędów.** Gdy dostajesz zgłoszenie błędu lub nieprzechodzący build, sam zbadaj logi i kod, znajdź przyczynę i ją napraw. Nie czekaj na instrukcje, jak to zrobić.
6. **Subagenci przy szerokim researchu.** Przeszukiwanie wielu plików lub niezależne wątki pracy deleguj do subagentów, żeby nie zaśmiecać głównego kontekstu.
7. **Powtarzalne czynności jako skille.** Procedurę wykonywaną regularnie zapisz jako skill lub komendę w `.claude/` i dodaj ją do repozytorium.

## Architektura DevMentor (obowiązująca)

DevMentor to monorepo oparte na **npm workspaces** (`packages/*`). Stack:

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript 6** (strict)
- **PostgreSQL** + **MikroORM 7**
- **Awilix 13** (DI)
- **Tailwind CSS 4** na stronach frontendowych, **shadcn-ui** na stronach backendowych
- **Zod 4** (walidacja i env), **pino** (logi), **jose** (sesje JWT)

Nie zmieniaj żadnej z tych technologii ani nie dodawaj alternatywnych (innego ORM-a, kontenera DI czy biblioteki UI/CSS) bez zgody użytkownika.

Pełne standardy (nazewnictwo, zasady SRP/DRY/DIP/YAGNI, minimum bezpieczeństwa, checklista code review, docelowa struktura) są w **[`.ai/docs/engineering-standards.md`](.ai/docs/engineering-standards.md)**. Ten dokument jest obowiązujący. Poniżej są reguły egzekwowane w kodzie.

### Pakiety

| Pakiet | Katalog | Odpowiedzialność |
| --- | --- | --- |
| `@devmentor/app` | `packages/app` | Next.js: strony, route handlers (`src/app/api/<concept>/route.ts`), okablowanie HTTP. Bez logiki biznesowej i bez zapytań do bazy. |
| `@devmentor/core` | `packages/core` | Reguły biznesowe: serwisy (`services/<concept>/`), kontener DI (`container/{container,cradle}.ts`, `withScope`), warstwa HTTP (`http/`), `config/env.ts`, `logger.ts`. Bez Next i Reacta. |
| `@devmentor/db` | `packages/db` | Persystencja: encje (`entities/<concept>/<name>.entity.ts`), konfiguracja MikroORM, migracje. **Jedyny** pakiet importujący `@mikro-orm/*`; re-eksportuje typy potrzebne `core`. |
| `@devmentor/ui` | `packages/ui` | Prezentacja: prymitywy shadcn (`components/ui/`), komponenty konceptów (`components/<concept>/`), bloki panelu (`backend/`). |

**Kierunek zależności:** `app → core → db`, a `ui` jest importowany tylko przez `app`. `db` nie zależy od żadnego pakietu workspace, a `ui` nie importuje `core` ani `db`. Tej granicy nie luzujemy dla wygody.

Granice wymusza `npm run lint` (sekcja „Architecture boundaries” w `eslint.config.mjs`).
- Naruszenia napraw w kodzie. Nie wyłączaj reguł (`eslint-disable`) i nie dopisuj zależności do `package.json` tylko po to, żeby obejść granicę.
- Nie używaj `--fix` dla `import/no-relative-packages`, bo podsuwa ścieżkę `@devmentor/<pkg>/src/...` spoza `exports`.
- Nowy pakiet lub nowa grupa tras wymaga dopisania reguł do tej sekcji. Piąty pakiet (np. `packages/shared`) to zmiana architektury, która wymaga zgody użytkownika.

Pakiety udostępniają **surowe źródła TS** przez pole `exports` w `package.json`, bez kroku budowania. Importuj je wyłącznie przez nazwę pakietu (`@devmentor/core`, `@devmentor/ui/components/ui/button`, `@devmentor/ui/backend/tables`), nigdy ścieżką względną do innego pakietu. Nowy pakiet musi mieć nazwę `@devmentor/<nazwa>`, `"type": "module"`, `tsconfig.json` rozszerzający `tsconfig.base.json` oraz skrypt `typecheck`.

### Konwencja konceptów domenowych

Kod domenowy **nie** jest organizowany w `modules/`. Każdy koncept (`auth`, `mentors`, `availability`, `bookings`, `payments`, `messages`, `favorites`, `reviews`…) to podkatalog o tej samej nazwie, powtarzany w warstwach, które go potrzebują:

- `packages/db/src/entities/<concept>/<name>.entity.ts` (rejestracja w `entities/index.ts`; wspólne kolumny z `entities/base.entity.ts`)
- `packages/core/src/services/<concept>/<name>.service.ts` (jawna rejestracja w `container.ts` jako `asClass(...).scoped()` i typ w `cradle.ts`)
- `packages/core/src/validators/<concept>/<name>-<action>.schema.ts` (wspólne schematy Zod dla route i formularza)
- `packages/app/src/app/api/<concept>/route.ts` oraz `page.tsx` w odpowiedniej grupie person (`(marketing)`, `(auth)`, `(student)`, `(mentor)`)

Folder konceptu tworzysz dopiero przy jego pierwszym pliku; nigdy nie tworzysz pustych zawczasu. To konwencja katalogów, a nie runtime modułów: bez `setup.ts`/`acl.ts` per koncept i bez auto-discovery (np. `loadModules`).

Zdarzenia domenowe mają identyfikatory `concept.entity.action` (np. `bookings.booking.created`). Emitowane są przez typowany emitter w `packages/core/src/events`, zarejestrowany w `Cradle`. Działa on tylko w procesie; projekt nie ma kolejek ani workerów. `events/` i `validators/` powstają przy pierwszej funkcji, która ich potrzebuje.

### Warstwa API i UI wielokrotnego użytku

Każdy route i każda strona korzystają z dwóch wspólnych warstw, zamiast powielać fetch, walidację, autoryzację i obsługę błędów:

- **`packages/core/src/http/`:**
  - `errors.ts`: hierarchia `AppError`. Serwisy rzucają wyłącznie te błędy i nie budują odpowiedzi HTTP.
  - `api-handler.ts` (`apiHandler`): mapuje błędy na status i kopertę `{ ok, data } / { ok: false, error: { code, message, fieldErrors? } }`, loguje nieoczekiwane błędy i wymaga nagłówka `x-devmentor-request: 1` przy metodach zmieniających stan (CSRF).
  - `make-crud-route.ts` (`makeCrudRoute`): zwykły CRUD z konfiguracji. Wymaga jawnego `access: "public" | "session"`; nieskonfigurowane metody zwracają 405.
  - `auth.ts`: `requireSession`, `requireRole`, `assertOwnership`; *fail closed*.
  - `validation.ts`: `parseInput`, `readJsonBody`.
- **`packages/ui/src/backend/`:**
  - `api/` (`apiCall`, `apiCallOrThrow`, `useApiResource`): jedyne miejsce z `fetch()` do `/api/*`.
  - `forms/CrudForm.tsx`, `tables/DataTable.tsx`, `feedback/{LoadingMessage,ErrorMessage,EmptyState}.tsx`.

Gdzie trafia nowy komponent:
1. Prymityw shadcn → `ui/src/components/ui/`, wyłącznie przez `npx shadcn@latest add <name>` uruchomione w `packages/ui`. Nigdy nie piszesz go ręcznie.
2. Generyczny wzorzec panelu, niezależny od konceptu → `ui/src/backend/<category>/`.
3. Komponent związany z kształtem jednego konceptu → `ui/src/components/<concept>/`, z tą samą nazwą folderu co w `db` i `core`.
4. Komponent używany przez jedną stronę → obok tego `page.tsx`, dopóki nie pojawi się drugi konsument.

### Reguły

**Next.js**
- Grupa `src/app/(marketing)` to publiczne strony w czystym Tailwindzie, bez prymitywów `@devmentor/ui/components/ui/*` i bez bloków `@devmentor/ui/backend/*`. Komponenty konceptów są dozwolone. Panel administracyjny to `src/app/backend` (URL `/backend`) z shadcn.
- Każda gałąź ma własny root layout. Nie twórz `src/app/layout.tsx`.
- Dostęp do bazy tylko w route'ach i stronach z `export const dynamic = "force-dynamic"`. Aplikacja musi się budować i startować bez dostępnej bazy (`/api/health` nie dotyka bazy).
- Route handler eksportuje wynik `apiHandler` lub `makeCrudRoute`. Nie pisze własnego `try/catch` ani ręcznego `NextResponse.json` (lint).
- Komponenty klienckie pobierają dane przez `apiCall` lub `useApiResource`, nigdy przez surowy `fetch` (lint).
- Pakiety MikroORM muszą być w `serverExternalPackages` w `next.config.ts`. Po dodaniu nowego pakietu `@mikro-orm/*` dopisz go tam.

**Dependency Injection (Awilix)**
- Każda zależność to jedna jawna linia w `core/src/container/container.ts` i jedna w `cradle.ts`. Bez auto-discovery.
- Serwisy rozwiązujesz przez `withScope((cradle) => …)`: jeden scope (własny `EntityManager`) na żądanie, render lub job, zwalniany po wywołaniu. Wywołuj go raz i przekazuj serwisy dalej. `getContainer()` nie jest eksportowany, bo rozwiązanie serwisu scoped na korzeniu dzieliłoby `em` między żądaniami.
- Tryb `PROXY` i `strict: true`: konstruktor przyjmuje obiekt `{ zależność }`. Singleton nie może zależeć od zależności scoped. Wszystko, co używa `em`, jest scoped.
- Integracje zewnętrzne (płatności, powiadomienia) to port w `core` (`<name>.port.ts`) z adapterem w `adapters/`; dla MVP jest adapter mock lub in-memory.

**Baza danych (MikroORM)**
- Encje definiuj przez `defineEntity` + `p` z `@mikro-orm/postgresql`, bez dekoratorów i `reflect-metadata`. Id to UUID (`baseProperties()`).
- Używaj wyłącznie `em` z DI, nigdy globalnego `orm.em`. W MikroORM 7 zapisuj przez `em.persist(x).flush()` (`persistAndFlush` nie istnieje).
- Wyjątki ORM (np. `UniqueConstraintViolationException`) serwis mapuje na `AppError` (np. `ConflictError` z `fieldErrors`).
- Operacje typu sprawdź-i-zapisz na współdzielonym stanie (sloty, statusy rezerwacji) wykonujesz w transakcji i/lub zabezpieczasz unikalnym ograniczeniem.
- Do `em.create()` lub `em.assign()` trafia wyłącznie wynik schematu Zod (`parseInput`), nigdy surowe body. Nie używaj surowego SQL z interpolowanym wejściem.
- Każda zmiana schematu wymaga migracji: `npm run db:migration:create`, potem `npm run db:migrate`. Commituj wygenerowaną migrację razem z `.snapshot.json`. Nie edytuj migracji już zastosowanych, tylko dodaj nową. Nie używaj `schema:update` zamiast migracji.
- Połączenie konfiguruje wyłącznie `DATABASE_URL`. Zmienne środowiskowe mają pierwszeństwo przed `.env` w roocie.
- Testy integracyjne i E2E dostają efemeryczny PostgreSQL z Testcontainers (`test/support/postgres.ts`). Ustawiony `TEST_DATABASE_URL` zastępuje kontener i musi wskazywać osobną, jednorazową bazę, bo testy kasują schemat. Nigdy nie wskazuj tam bazy deweloperskiej ani produkcyjnej. Testy odmawiają działania, gdy ten adres jest równy `DATABASE_URL`.

**Bezpieczeństwo** (minimum; pełna lista i checklista review w `.ai/docs/engineering-standards.md`)
- **Uwierzytelnianie:** każdy route niepubliczny ma `access: "session"` lub `requireSession`. Route publiczny ma `access: "public"` i komentarz z uzasadnieniem.
- **Autoryzacja:** dotyczy konkretnego rekordu (`assertOwnership`). Błąd w trakcie sprawdzania uprawnień oznacza odmowę.
- **Sesje:** JWT HS256 z `AUTH_SECRET` (≥ 32 bajty, z `env.ts`), ważne 24 h, cookie `httpOnly`/`secure` (prod)/`sameSite=lax`. Nigdy w `localStorage`.
- **Logi:** nie logujesz haseł, tokenów ani pełnych JWT (`redact` w `logger.ts`). Używasz `logger` zamiast `console` (lint).

**UI**
- Kolorów i tokenów motywu backendu nie zapisuj na sztywno. Używaj zmiennych z `packages/ui/src/styles/globals.css` (`bg-background`, `text-muted-foreground` itd.).
- Teksty interfejsu i komunikaty `AppError` widoczne dla użytkownika piszesz po polsku. Kody błędów (`code`) zostają po angielsku.

**TypeScript i zależności**
- `typescript` pozostaje na `~6.0`, a `eslint` na `^9`, bo wtyczki z `eslint-config-next` (`typescript-eslint`, `eslint-plugin-import`, `jsx-a11y`, `react`) nie obsługują jeszcze TS 7 ani ESLint 10. Nie podbijaj tych wersji głównych, dopóki peer dependencies na to nie pozwolą. `npm install` nie powinien zgłaszać `ERESOLVE`.
- Szczegóły testów są w sekcji „Testy i CI” poniżej.
- **Kod:** bez `any` (lint), bez pustych `catch`, bez martwego i zakomentowanego kodu. Stałe mają nazwy i, gdy wartość nie jest oczywista, komentarz z uzasadnieniem.
- Zależność instaluj w pakiecie, który jej używa (`npm install <pkg> -w @devmentor/<pakiet>`). Do roota trafiają tylko narzędzia całego repo.

### Testy i CI (obowiązkowe)

**Każda nowa funkcja i każda zmiana kodu musi mieć 100% pokrycia testami jednostkowymi:** lines, branches, functions i statements, dla całego kodu w `packages/*/src` oraz skryptów w `scripts/`. CI blokuje pull request, który obniża pokrycie poniżej 100%.
- Testy jednostkowe piszesz **w tym samym PR** co kod. Funkcja bez testów nie jest skończona. Naprawa błędu dodaje test, który bez poprawki failuje.
- Pokrycie liczą wyłącznie testy jednostkowe (`*.test.ts(x)`), bez integracyjnych i E2E. Każda gałąź (`if`, `??`, `?.`, parametr domyślny, `catch`) ma test, który ją wykonuje.
- **Zakazane bez zgody użytkownika:** obniżanie progów w `vitest.config.ts`, rozszerzanie `coverage.exclude`, komentarze `/* v8 ignore */` i `istanbul ignore` oraz testy, które wykonują kod bez asercji tylko po to, żeby podbić pokrycie.
- Kod, którego nie da się pokryć bez sztuczek, refaktoruj tak, żeby był testowalny (np. wstrzyknij zależność przez DI albo wydziel czystą funkcję).
- Testy leżą obok kodu (`foo.ts` → `foo.test.ts`). Komponenty testujesz w jsdom (`// @vitest-environment jsdom`) przez Testing Library, a zależności zewnętrzne mockujesz (`vi.mock`, `vi.stubGlobal("fetch", …)`). Testy jednostkowe nie łączą się z bazą ani siecią.

**Testy integracyjne** (`*.integration.test.ts`, `npm run test:integration`) sprawdzają zachowanie wymagające prawdziwego PostgreSQL: migracje, zapytania, ograniczenia unikalności, transakcje. Uruchamia je `vitest.integration.config.ts`, którego `globalSetup` startuje kontener Testcontainers. Każda nowa encja, migracja i zapytanie z logiką SQL ma test integracyjny.

**Testy E2E** (`test/e2e/*.e2e.test.ts`, `npm run test:e2e`) sprawdzają przepływy użytkownika na efemerycznie uruchomionej aplikacji. `globalSetup` stawia kontener z bazą, uruchamia migracje przez CLI i odpala `next start` z buildu produkcyjnego. Przeglądarką steruje **agent-browser** przez helper `test/support/agent-browser.ts`. Każda nowa strona lub przepływ widoczny dla użytkownika ma scenariusz E2E. Scenariusz sprawdza też, że strona nie zgłasza błędów JS (`pageErrors()`). Dane seedujesz przez serwisy `@devmentor/core`, a nie surowym SQL.

**CI** (`.github/workflows/ci.yml`) uruchamia na każdym pull requeście równolegle:
- lint i typecheck,
- build,
- testy jednostkowe z progiem 100% i artefaktem `coverage`,
- testy integracyjne,
- testy E2E.

Wszystkie joby muszą być zielone. Nie wyłączaj ani nie omijaj jobów, a nowy rodzaj sprawdzenia dodawaj jako krok w tym workflow.

### Komendy (z roota)

| Komenda | Działanie |
| --- | --- |
| `npm run setup` | Idempotentna instalacja lokalna (zależności, `.env`, PostgreSQL, migracje). Używa bazy z `DATABASE_URL`, a Dockera tylko wtedy, gdy ona nie odpowiada. Pomija kroki już wykonane. |
| `npm run dev` | Serwer deweloperski aplikacji. |
| `npm run build` / `npm start` | Build produkcyjny i jego uruchomienie. |
| `npm run lint` | ESLint dla całego monorepo. |
| `npm run typecheck` | `tsc --noEmit` we wszystkich pakietach. |
| `npm test` / `npm run test:unit` | Testy jednostkowe wszystkich pakietów z pokryciem (próg 100%, raport w `coverage/`). |
| `npm run test:integration` | Testy integracyjne na PostgreSQL z Testcontainers (wymaga Dockera albo `TEST_DATABASE_URL`). |
| `npm run test:e2e` | Testy E2E: efemeryczna aplikacja i baza, sterowane przez agent-browser (wymaga wcześniejszego `npm run build` oraz Dockera albo `TEST_DATABASE_URL`). |
| `npm run db:migrate` | Zastosowanie oczekujących migracji. |
| `npm run db:migration:create` | Nowa migracja z różnicy encji i snapshotu. |
| `npm run db:migration:list` | Lista zastosowanych migracji. |
