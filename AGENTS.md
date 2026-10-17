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
2. **Weryfikacja przed zgłoszeniem.** Zanim uznasz zmianę za gotową, uruchom z roota `npm run lint`, `npm run typecheck`, `npm test` oraz `npm run build`. Przy zmianach w `packages/db` uruchom `npm test` z `TEST_DATABASE_URL`, bo bez tej zmiennej testy integracyjne są pomijane, a pominięcia nie raportuj jako sukcesu. Przy zmianach w schemacie bazy wygeneruj i zastosuj migrację. Przy zmianach w UI uruchom aplikację (`npm run dev`) i sprawdź efekt. Raportuj rzeczywiste wyniki. Jeśli coś pominięto albo nie przeszło, napisz to wprost.
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

Nie zmieniaj żadnej z tych technologii ani nie dodawaj alternatywnych (innego ORM-a, kontenera DI czy biblioteki UI/CSS) bez zgody użytkownika.

### Pakiety

| Pakiet | Katalog | Odpowiedzialność |
| --- | --- | --- |
| `@devmentor/app` | `packages/app` | Aplikacja Next.js: routing, strony, server actions, route handlers, składanie kontenera DI (`src/server/container.ts`). |
| `@devmentor/core` | `packages/core` | Kod wielokrotnego użytku niezależny od frameworka: infrastruktura DI (`buildContainer`, `AppCradle`, `ContainerModule`), typy i narzędzia. **Bez** importów z Next, React, MikroORM ani innych pakietów workspace. |
| `@devmentor/db` | `packages/db` | Dostęp do danych: konfiguracja MikroORM, encje, migracje, serwisy danych oraz `dbModule` rejestrujący je w DI. |
| `@devmentor/ui` | `packages/ui` | Komponenty shadcn-ui, motyw (`globals.css`) i `cn`. Tylko prezentacja, bez dostępu do danych. |

**Kierunek zależności:** `app → ui, db, core` oraz `db → core`. Pakiety `ui` i `core` nie zależą od innych pakietów workspace. Zabronione są cykle oraz importy „w górę”, np. `db → app`.

Granice pakietów wymusza `npm run lint` (sekcja „Architecture boundaries” w `eslint.config.mjs`). Te same reguły egzekwuje też DI i podział frontend/backend opisany niżej.
- Naruszenia napraw w kodzie. Nie wyłączaj reguł (`eslint-disable`) i nie dopisuj zależności do `package.json` tylko po to, żeby obejść granicę.
- Nie używaj `--fix` dla `import/no-relative-packages`, bo podsuwa ścieżkę `@devmentor/<pkg>/src/...` spoza `exports`.
- Nowy pakiet lub nowa strefa tras wymaga dopisania reguł do tej sekcji.

Pakiety udostępniają **surowe źródła TS** przez pole `exports` w `package.json`, bez kroku budowania. Importuj je wyłącznie przez nazwę pakietu (`@devmentor/db`, `@devmentor/ui/components/button`), nigdy ścieżką względną do innego pakietu. Nowy pakiet musi mieć nazwę `@devmentor/<nazwa>`, `"type": "module"`, `tsconfig.json` rozszerzający `tsconfig.base.json` oraz skrypt `typecheck`.

### Reguły

**Next.js**
- Frontend (publiczny) to grupa `src/app/(frontend)` z czystym Tailwindem, bez komponentów z `@devmentor/ui`. Backend (panel) to `src/app/backend` (URL `/backend`) z komponentami shadcn z `@devmentor/ui`.
- Każda z tych gałęzi ma własny root layout. Nie twórz `src/app/layout.tsx`.
- Strona, która czyta z bazy bez Request-time API, musi wywołać `await connection()` (`next/server`). Inaczej `next build` spróbuje ją prerenderować i połączyć się z bazą.
- Pakiety MikroORM muszą być w `serverExternalPackages` w `next.config.ts`. Po dodaniu nowego pakietu `@mikro-orm/*` dopisz go tam.

**Dependency Injection (Awilix)**
- Jeden kontener na proces: `getContainer()`. Na żądanie pobieraj scope przez `getRequestScope()` z `@/server/container` i rozwiązuj serwisy z `scope.cradle`. Nie twórz serwisów ręcznie (`new UserService(...)`) w kodzie aplikacji.
- Każdy pakiet rejestruje zależności przez `ContainerModule` i deklaruje ich typy, rozszerzając `AppCradle` przez `declare module "@devmentor/core"`.
- Tryb `PROXY` i `strict: true`: konstruktor przyjmuje obiekt `{ zależność }`. Singleton nie może zależeć od zależności scoped. Wszystko, co używa `em`, jest scoped.

**Baza danych (MikroORM)**
- Encje definiuj przez `defineEntity` + `p` z `@mikro-orm/postgresql`, bez dekoratorów i `reflect-metadata`. Każdą encję dopisz do `entities` w `packages/db/src/entities/index.ts`.
- Używaj wyłącznie `em` z DI (fork na żądanie), nigdy globalnego `orm.em`. W MikroORM 7 zapisuj przez `em.persist(x).flush()` (`persistAndFlush` nie istnieje).
- Każda zmiana schematu wymaga migracji: `npm run db:migration:create`, potem `npm run db:migrate`. Commituj wygenerowaną migrację razem z `.snapshot.json`. Nie edytuj migracji już zastosowanych, tylko dodaj nową. Nie używaj `schema:update` zamiast migracji.
- Połączenie konfiguruje wyłącznie `DATABASE_URL`. Zmienne środowiskowe mają pierwszeństwo przed `.env` w roocie.
- Testy integracyjne łączą się **wyłącznie** przez `TEST_DATABASE_URL` z osobną, jednorazową bazą, bo kasują schemat. Nigdy nie ustawiaj tam adresu bazy deweloperskiej ani produkcyjnej. Test odmawia działania, gdy `TEST_DATABASE_URL` jest równy `DATABASE_URL`.

**UI**
- Komponenty shadcn dodawaj CLI z katalogu `packages/ui`: `npx shadcn@latest add <komponent>`. Nie kopiuj ich ręcznie i nie twórz ich w `packages/app`.
- Kolorów i tokenów motywu backendu nie zapisuj na sztywno. Używaj zmiennych z `packages/ui/src/styles/globals.css` (`bg-background`, `text-muted-foreground` itd.).

**TypeScript i zależności**
- `typescript` pozostaje na `~6.0`, a `eslint` na `^9`, bo wtyczki z `eslint-config-next` (`typescript-eslint`, `eslint-plugin-import`, `jsx-a11y`, `react`) nie obsługują jeszcze TS 7 ani ESLint 10. Nie podbijaj tych wersji głównych, dopóki peer dependencies na to nie pozwolą. `npm install` nie powinien zgłaszać `ERESOLVE`.
- **Testy:** Vitest. Pliki `*.test.ts` umieszczaj obok testowanego kodu, a w pakiecie z testami dodaj `vitest` do devDependencies i skrypt `"test": "vitest run"`.
- Zależność instaluj w pakiecie, który jej używa (`npm install <pkg> -w @devmentor/<pakiet>`). Do roota trafiają tylko narzędzia całego repo.

### Komendy (z roota)

| Komenda | Działanie |
| --- | --- |
| `npm run dev` | Serwer deweloperski aplikacji. |
| `npm run build` / `npm start` | Build produkcyjny i jego uruchomienie. |
| `npm run lint` | ESLint dla całego monorepo. |
| `npm run typecheck` | `tsc --noEmit` we wszystkich pakietach. |
| `npm test` | Testy (Vitest) we wszystkich pakietach. Integracyjne testy `db` wymagają `TEST_DATABASE_URL`. |
| `npm run db:migrate` | Zastosowanie oczekujących migracji. |
| `npm run db:migration:create` | Nowa migracja z różnicy encji i snapshotu. |
| `npm run db:migration:list` | Lista zastosowanych migracji. |
