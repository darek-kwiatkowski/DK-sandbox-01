# POSTĘP: design system DevMentor i Storybook

## Aktualny checkpoint — 2026-11-16, test agenta i dokumentacja domknięte

- **Stan:** dokumentacja design systemu jest gotowa do użycia; test agenta ekranu anulowania mentee z E03-S03 wykonano poza tą sesją, a użytkownik przekazał jego luki. Te luki są jawnie oznaczone w Storybooku i nie są domyślnymi zachowaniami. Etapy 0–5 wykonane. Nie commitowano, nie pushowano ani nie publikowano.
- **Weryfikacja:** `npm run build-storybook` — OK; `npm run typecheck` — OK; `npm run lint` — 0 błędów i jedno ostrzeżenie wygenerowanego `coverage/block-navigation.js`; `npm run check:tokens` — zero znalezisk; `git diff --check` — OK; `NODE_ENV=production npm run build` — OK.
- **Storybook:** 339/339 stories zaliczonych w każdym motywie (34 pliki testów; `a11y: { test: 'error' }`). Łącznie 678 wykonań story tests. 72 story deklarują `play` z interakcją. Bez naruszeń a11y w przebiegach; jedyny wyjątek `aria-hidden-focus` dla już otwartego DropdownMenu jest ograniczony i opisany w `DropdownMenu.mdx` oraz story.
- **Przeglądarka:** wszystkie 99 pełnoekranowych stories E01–E05 × 3 szerokości (320/768/1440) × 2 motywy = 594 kontroli, bez błędów JS, przepełnień ani niezgodnego motywu. Dodatkowo 432 kontrole wybranych Product/Patterns/E02-screen stories oraz 50 stron docs w obu motywach; bez błędów JS, przepełnień i surowych tabel. 14 nowych stron etapu 4 sprawdzono osobno przy wszystkich 3 szerokościach i 2 motywach = 84 kontroli.
- **Pełna bramka repo:** `npm run test:unit -- --maxWorkers=2` — 269/269; 100% statements/branches/functions/lines. Produkcyjny build aplikacji — OK. Integracja i E2E nie ruszyły: Testcontainers nie znajduje runtime kontenerów (`Could not find a working container runtime strategy`), również po powtórzeniu poza sandboxem. Żadnego scenariusza z tych dwóch zestawów nie zaliczono.
- **Liczby:** 66 stron MDX, 41 wpisów katalogu komponentów/bloków, 339 stories, 34 pliki stories/testów, 72 stories z `play`.
- **Wynik testu agenta:** ekran jest skomponowany w Storybooku jako prezentacyjny fixture, a jego stany interakcji przechodzą story tests. Raportowane luki sprawdzono względem `.ai/specs/backlog.md`, briefu, decyzji i dokumentacji. Wszystkie są jawnie wymienione w sekcji E03-S03 strony `What is missing`; poprawiono błędne odwołania wzorca anulowania z E03-S02 na E03-S03 i dodano mapę stanów anulowania w `Screens/Epics`.
- **Nierozstrzygnięte kontrakty E03-S03 (nie są decyzjami domyślnymi):** dozwolone statusy i konflikt zmiany statusu; odwrócenie anulowania/odtworzenie rezerwacji; endpoint, schemat, autoryzacja i błędy; idempotencja/powtórzenia; timeout/utrata sieci i nieznany wynik wraz z bezpiecznym uzgadnianiem oraz ponowieniem; powód lub dodatkowe potwierdzenie; warunek/czas hold i powiadomienia obu stron; nawigacja, historia i dalszy dostęp do sesji. Nie implementować zachowań zależnych od tych decyzji bez specyfikacji.
- **Dodatkowa kontrola po raporcie:** Storybook zbudowano ponownie. Strony `What is missing`, E03, `Delete confirmation` i `Screens/Epics` przeszły 24 kontrole (4 strony × 3 szerokości × 2 motywy), bez przepełnień, surowych tabel ani błędów JavaScript.
- **Ograniczenia raportu:** integracja/E2E pozostają niezweryfikowane z powodu braku runtime kontenerów. Harness dawnego manualu Public work link liczy też nagłówki przykładowych bloków (16 zamiast 13); sam manual ma 13 numerowanych sekcji, więc nie jest to naruszenie dostępności.
- **Następny krok:** przed implementacją produkcyjnego anulowania trzeba zatwierdzić kontrakty E03-S03 (statusy, API, idempotencję, odzyskiwanie wyniku nieznanego, hold, powiadomienia i nawigację). Stories pozostają prezentacją i nie stanowią kontraktu serwera.

## Aktualny checkpoint — 2026-11-16, etap 4 zakończony

- **Stan:** etapy 0–4 zakończone. Etap 5 nie rozpoczęty; czekam na „dalej”. Nie commitowano, nie pushowano ani nie publikowano.
- **Etap 4:** dodano 8 stron instruktażowych Storybooka (Start here, Components, How to choose, Usage and accessibility, Content, What to avoid, What is missing, Contributing) oraz 6 stron epików E01–E06. Katalog prezentuje 41 działających wpisów opartych o prawdziwe stories. Start here zawiera tabelę 40 komponentów/bloków.
- Dodano przewodnik dla agentów w `.ai/docs/design-system.md` i odwołanie z głównego `AGENTS.md`. Zasady dokumentacji odsyłają do źródeł produktu/specyfikacji; nierozstrzygnięte zachowania pozostają brakami lub propozycjami.
- Do Storybooka dodano pomocniczy blok katalogu TSX oraz responsywne łamanie tabel i długich treści. Lekcja o lokalnych komponentach MDX została dopisana do `.ai/lessons/2026-11-06-storybook-design-system-pitfalls.md`.
- **Sprawdzone:** build Storybooka, typecheck, lint (znane ostrzeżenie tylko w wygenerowanym `coverage/block-navigation.js`), skaner tokenów (0 znalezisk), `git diff --check`. Przeglądarka: 14 stron × 3 szerokości (320/768/1440) × 2 motywy = 84 kontrole; bez błędów JS, przepełnień, błędnych motywów, surowych tabel Markdown i niedziałających linków.
- **Korekta harnessu:** tabela Start here ma 40 wierszy, nie 41; poprawiono asercję i końcowy przebieg przeszedł 84/84.
- **Następny krok:** etap 5 — pełna weryfikacja build/lint/typecheck, tokenów, dostępności stories, przeglądarka/klawiatura/nakładki oraz przygotowanie opisu testu agentem. Nie rozpoczynać przed kolejnym „dalej”.

Plik roboczy. Nowa sesja zaczyna od przeczytania go i kontynuuje od „Następny krok”.

## Wznowienie — 2026-11-16, audyt pokrycia etapu 3

Ta notatka uzupełnia checkpoint poniżej i jest aktualnym stanem.

- **Stan:** etap 3 zakończony 2026-11-16. Etapy 4 i 5 nie rozpoczęte; zatrzymać się tutaj do osobnego „dalej”. Nie publikowano, nie commitowano ani nie pushowano.
- **Zmiany po zatwierdzeniu H1:** wcześniejszy diff zachowany. Dodano do `Screens/Epics.mdx` mapę `ProfileStackKeyboardSelection` i `ProfileStackServerError`. Minimalna liczba zaznaczonych tagów pozostaje nieustalona.
- **Przegląd diffu:** nowe pole checkboxów w `CrudForm` używa tablic `string[]`, semantycznej grupy fieldset/legend, etykiet i opisów, walidacji grupy po opuszczeniu, fokusu przy błędzie oraz zachowania danych po błędzie serwera. Historie profilu odzwierciedlają wyłącznie zatwierdzone H1; brak kontraktu backendu jest jawny. `git diff --check` nie zgłasza błędów.
- **Sprawdzone teraz:** `npm run lint` — OK (jedno ostrzeżenie w wygenerowanym `coverage/block-navigation.js`); pełny `npm run typecheck` — OK; `npm run check:tokens` — 0 znalezisk; `npm run test:unit -- --maxWorkers=2` — 269/269, 100% statements/branches/functions/lines; `npm run build-storybook` — OK; `npm run test:storybook` — 339/339 w jasnym i 339/339 w ciemnym; `NODE_ENV=production npm run build` — OK.
- **Integracja i E2E:** oba polecenia ponowiono w sandboxie i poza nim. Testcontainers nie znajduje działającego runtime kontenerów (`Could not find a working container runtime strategy`); żaden scenariusz nie ruszył. Te bramki pozostają niezaliczone, mimo wcześniejszych przebiegów z 4/4 i 5/5 przed H1.
- **Przeglądarka:** harness dla zmienionych story/docs zakończył 482 kontrole (72 story × 3 szerokości × 2 motywy + 25 stron docs × 2 motywy): zero błędów JS i przepełnień, motyw poprawnie ustawiony na `<html>`, tabele renderują się jako tabele. Jedyny raportowany „failure” to licznik `h2` dla Public work link (16 zamiast 13), bo obejmuje nagłówki wyrenderowanych przykładów; sam manual ma wymagane numerowane sekcje 1–13. Brak ręcznego audytu całego Storybooka klawiaturą.
- **Audyt pokrycia:** historyczna lista luk z 2026-11-13 była nieaktualna. Obecne artefakty zawierają przepływy E01, E02 i E03 oraz recipe Sign-in, Access gate, Booking checkout, Text session i Co-edited note. 19 manuali komponentów produktu/panelu/patternów ma po 13 numerowanych sekcji; 5 pozostałych stron MDX dokumentuje wzorce i recipes, nie komponenty.
- **Zmiana dokumentacji:** `Screens/Epics.mdx` uzupełniono o pełne mapy stanów rejestracji/logowania/wylogowania i ról E01 oraz profilu, checkboxów stacku, cen, limitów, prowizji i dostępności E02. Mapa E03 już zawiera checkout, płatności, listę i szczegóły rezerwacji. Stories wskazane w mapach istnieją pod podanymi nazwami.
- **Granica decyzji:** prezentacje E01–E03 są pokryte. Nierozstrzygnięte kontrakty E03 płatności/warunków, E04 realtime/revisions, E05 Connect/rozliczeń pozostają wyraźnie oznaczone jako braki specyfikacji; nie dopisano zachowania backendu.
- **Weryfikacja mapy:** build Storybooka po edycji MDX przeszedł. 100 referencji do stories z mapy odpowiada istniejącym eksportom. Strona `Screens/Epics` wyrenderowała 5 tabel w jasnym i ciemnym motywie, wszystkie 11 kontrolowanych nazw było widoczne, brak błędów JS; motyw na `<html>` odpowiadał wyborowi.
- **Wynik etapu:** luki prezentacyjne E01/E02/E03 z audytu 2026-11-13 są pokryte istniejącymi przepływami i teraz kompletnie wskazane w mapie. Nierozstrzygnięte kontrakty domenowe pozostają wymienione jako braki/propozycje. Etap 3 zakończony; czekam na „dalej” przed etapem 4.

## Aktualny checkpoint — 2026-11-16, po zatwierdzeniu H1

Ta sekcja jest nadrzędna wobec historycznych list braków i pytań poniżej.

**Stan:** etap 3 w toku. Etapy 4 i 5 nie rozpoczęte. Użytkownik poprosił teraz o zapis bieżącego stanu. Niczego nie opublikowano, nie commitowano ani nie pushowano; wcześniejsze zmiany w drzewie roboczym zachowano.

**Decyzje:** H1 zatwierdzone przez użytkownika w tej rozmowie: grupa checkboxów w istniejącym CrudForm do edycji TypeScript, React, Python i AI agents. H1 nie jest już pytaniem otwartym. Nie ustalono minimalnej liczby tagów; przykładowy schemat dopuszcza pustą tablicę. Wcześniejsze zgody na G1–G5 i zawijanie GitHubButton nadal obowiązują.

**Dodatkowo wykonane od poprzedniego checkpointu:**

- `CrudForm.tsx`: typ pola `checkboxes`, tablice `string[]` w wartościach/defaultValues; fieldset/legend, osobne etykiety, powiązane opisy i błędy, walidacja dopiero przy opuszczeniu grupy, fokus na pierwszej błędnej opcji lub pustej grupie, zachowanie wyboru po błędzie, blokada podczas wysyłania. Pusta lista opcji ma widoczne wyjaśnienie. Zagnieżdżone błędy Zod dla elementów tablicy mapują się na grupę. Dodano `CrudForm.checkboxes.test.tsx` (7 testów).
- `OfferFlows.stories.tsx`: 41 stories (wcześniej 11); pełniejsze podglądy danych i odpowiedzi formularzy, checkboxy stacku w profilu, klawiatura i zachowane zaznaczenia po błędzie serwera. Przykłady E02 nadal jawnie są propozycjami, nie kontraktami backendu.
- `MentorParts.stories.tsx`: osobne playgroundy i podglądy wiersza mentora, publicznej pracy, tagów i filtrów; długi/niepełny/pusty stan oraz klawiatura i zamrożone stany linków. Cztery manuale mentorów mają dedykowane podglądy tych części.
- Patterns/Form: widoczne potwierdzenie odpowiedzi serwera i trwały podgląd oczekiwania. Patterns/Filtered list: filtry, licznik i aktywne filtry w jednej kompozycji, działające czyszczenie braku dopasowań.
- Nowe manuale z 13 sekcjami: `patterns/CrudForm.mdx`, `patterns/DataTable.mdx`, `product/AccessDenied.mdx`. Nowe mapy wzorców `patterns/Form.mdx` i `patterns/FilteredList.mdx`. ProductFlows ma klikalne odwołania. Poprawiono nieaktualne „open G5/status proposals” w PayoutList i Epics.
- `vitest.storybook.config.ts`: `test.fileParallelism: false`, aby ograniczyć równoległe strony Chromium bez podnoszenia timeoutów i bez pomijania testów.

**Rzeczywiste sprawdzenia:**

- Pełne jednostkowe po H1: `npm run test:unit -- --maxWorkers=2` — **269/269**, 47 plików; **100%** statements 765/765, branches 538/538, functions 292/292, lines 716/716. Log `.ai/runs/2026-11-16-h1-unit.log`.
- Test celowany E02 po H1: **41/41** stories w jasnym motywie, z a11y error; celowane UI typecheck i ESLint OK.
- Wcześniejszy pełny przebieg Storybooka po ograniczeniu równoległości: light **337/337**, dark **339/339**. Liczby różnią się, bo H1 dodano w trakcie; nie traktuj tego jako końcowej weryfikacji identycznego drzewa. Oba przebiegi zgłosiły timeout zamykania Chromium/Vite, mimo zaliczonych stories. Trzeba uruchomić stabilny pełny przebieg po wszystkich zmianach i potwierdzić kod wyjścia. Log `.ai/runs/2026-11-16-stage3-completion-stories-serial.log`.
- Build Storybooka przeszedł **przed końcowymi zmianami H1**, więc trzeba go powtórzyć. Pełny typecheck podczas obciążenia zakończył core błędem 134 (`Zone Allocation failed - process out of memory`); późniejszy celowany typecheck UI przeszedł. Trzeba powtórzyć pełne sprawdzenia kolejno przy mniejszym obciążeniu.
- Integracja **4/4**, E2E **5/5**, lint/typecheck/build były zielone po naprawie runnerów **przed H1**. Nie przedstawiaj ich jako ponowionych po H1. Docker Desktop uruchomiono i używano efemerycznych Testcontainers; nie podmieniano bazy na developerską.
- Końcowy przegląd przeglądarkowy najnowszych zmian jeszcze **niewykonany**. Gotowy harness: `.ai/qa/artifacts_2026-11-16-stage3-completion/browser-focused.cjs`; czeka na nowy build. Poprzednie 490 kontroli z wcześniejszej kontynuacji nie obejmuje tego checkpointu.

**Pozostałe ograniczenia, bez nowych decyzji domyślnych:** checkbox defaults muszą być `string[]`, zwykłe pola `string`; błędy serwera powinny używać nazwy grupy `stack`, nie `stack.0`. Brak jednostki/walidacji prowizji i kontraktów domenowych API/realtime/Connect pozostaje jawnie opisany; nie trzeba implementować backendu w etapie prezentacji ani zgadywać tych reguł.

**Następny krok po wznowieniu:** przejrzeć finalny diff H1 i dokumentację; uruchomić kolejno pełny lint, typecheck, skaner tokenów, testy jednostkowe (już zielone powtarzać tylko po zmianie), produkcyjny build, integrację i E2E; zbudować Storybook, wykonać pełny przebieg obu motywów z potwierdzonym zakończeniem procesu, potem harness przeglądarkowy 320/768/1440 i oba motywy dla zmienionych stories/docs. Zweryfikować 13 sekcji nowych manuali i tabele. Uzupełnić mapę E02 o nowe nazwy stories, raport braków i stan etapu 3. Nie przechodzić do etapu 4 bez nowego „dalej”.

Log przebiegu: `.ai/runs/2026-11-16-design-system-stage3-completion.md`. W drzewie jest dużo wcześniejszych niecommitowanych zmian; nie resetować ich.

## Etapy

| Etap | Stan |
|---|---|
| 0. Inwentaryzacja i plan | zakończony 2026-11-06 |
| 1. Fundamenty | zakończony 2026-11-06 |
| 2. Komponenty bazowe | zakończony 2026-11-06 (3 partie); G1–G5 zatwierdzone 2026-11-13 |
| 3. Komponenty produktu, wzorce i ekrany | zakończony 2026-11-16; pełna mapa E01–E05 i audyt pokrycia |
| 4. Strony, które uczą | zakończony 2026-11-16; 14 stron docs + przewodnik agenta |
| 5. Sprawdzenie i raport | zakończony 2026-11-16; bramki i test agenta opisane powyżej |

## Materiały przeczytane (etap 0)

- `lekcja-06/referencje.md`, `lekcja-06/tokeny.md` (decyzje zatwierdzone 2026-11-06 przez Oliwię).
- `.ai/specs/product-brief.md` (scope, key flows, business rules R01–R35, N01–N02), wywiady w `.ai/specs/research/` (dwa nadpisane czytane z `devmentor-synthetic-input/`).
- `.ai/specs/backlog.md` (E01–E06, 12 stories, 3 tasks; nic nie jest „adopted”), `.ai/specs/2026-10-31-e01-s01-accounts-and-role-access.md` (jedyna spec z ekranami), `.ai/specs/2026-10-31-platform-primitives.md` (P3, P7, P14–P18: AccessDenied, AppShell, formatPln, useApiList, ConflictNotice, formatDateTime, typy pól CrudForm), `.ai/docs/engineering-standards.md` (CrudForm/DataTable/feedback obowiązkowe; umiejscowienie komponentów).

## Stan repozytorium (etap 0)

- npm workspaces, Node ≥ 22.17; Next.js 16.4.2, React 19.3.1, TypeScript ~6.0, Tailwind 4.3.3, Vitest 5, ESLint 9 (z jsx-a11y i regułami granic pakietów).
- `packages/ui`: shadcn (styl `radix-nova`, `baseColor: neutral`, lucide, Radix przez pakiet `radix-ui`), prymitywy: badge, button, card, field, input, label, separator, table; bloki: `backend/api` (apiCall, useApiResource), `backend/feedback` (LoadingMessage, ErrorMessage, EmptyState), `backend/forms/CrudForm`, `backend/tables/DataTable`. Tokeny: `src/styles/globals.css` (domyślne neutralne shadcn, `.dark`). Brak Storybooka, brak `tokens.css`.
- Teksty istniejących komponentów i całej specyfikacji E01-S01 są po polsku (AGENTS.md: teksty UI po polsku).
- Pokrycie: `coverage.include` obejmuje `packages/*/src/**/*.{ts,tsx}` z progiem 100%, więc pliki `*.stories.tsx` w `src/` obniżyłyby pokrycie.
- Dostępne wersje: storybook 10.6.6 (react-vite, addon-docs, addon-a11y, addon-vitest), vite 8.3, @tailwindcss/vite 4.3, @vitest/browser-playwright 5.1, playwright 1.65 (Chromium w `~/.cache/ms-playwright`), msw 3.0, msw-storybook-addon 3.0, remark-gfm 4.0. Peer dependencies zgodne z Vitest 5 i Vite 8.

## Decyzje zatwierdzone

- 2026-11-06: tokeny i zasady z `lekcja-06/tokeny.md` (Oliwia).
- 2026-11-06, etap 0 (Oliwia):
  - Q1 = a: teksty interfejsu i przykłady w Storybooku po polsku (AGENTS.md, spec E01-S01); dokumentacja Storybooka po angielsku.
  - Q2 = a: komponenty i ekrany E02–E05 budowane z briefu i referencji, każdy oznaczony jako propozycja do decyzji.
  - Q3 = a: stories w `packages/ui/stories/` (układ jak `src/`); próg pokrycia i `coverage.exclude` bez zmian.
  - Q4 = całość: (1) wartości `globals.css` → `tokens.css` z `tokeny.md`; (2) naprawa `--font-sans`; (3) usunięcie fioletu z `--sidebar-primary` (dark); (4) przestylowanie prymitywów (szczegóły przed etapem 2); (5) eksport `./tokens.css`; (6) pola CrudForm `textarea`, `select`, `money`; (7) teksty istniejących komponentów zostają po polsku.
  - Q5 = a: awatar z inicjałami (wiadomość, wiersz mentora); bez przełącznika, zakładek, popovera i toastu, wpisane do „What is missing” z uzasadnieniem.

## Etap 1: co zrobiono (2026-11-06)

- Zależności dev w `@devmentor/ui`: storybook, @storybook/react-vite, addon-docs, addon-a11y, addon-vitest (10.6.6), @vitest/browser-playwright 5.0.5, playwright 1.65, vite 8, @tailwindcss/vite i tailwindcss 4.3.3, remark-gfm 4, msw 3, msw-storybook-addon 3. Bez ERESOLVE; nic spoza planu.
- `src/styles/tokens.css`: trzy warstwy (surowa, znaczeniowa light/dark ze źródłem w komentarzu, komponentowa) i podłączenie do Tailwinda (`@theme inline`): kolory, odstępy według relacji (`gap-in-group`, `gap-between-groups`, `p-panel`, `p-session`, `gap-section`, `py-list-row-y`, `px-list-row-x`), `max-w-reading`, `max-w-page`, promienie, `shadow-overlay`, fonty systemowe, 150 ms. `.light` pozwala pokazać jasny motyw wewnątrz ciemnego (dokumentacja).
- `globals.css`: tylko importy, wariant `dark`, `@source`, warstwa base i `prefers-reduced-motion`. Naprawione samoodwołanie `--font-sans`, usunięty fiolet z ciemnego `--sidebar-primary`. Eksport `./tokens.css`.
- `.storybook/`: `main.ts` (stories w `../stories`, remark-gfm, a11y, vitest, telemetria, checklista i komunikaty wyłączone), `manager.ts` (tylko nazwa DevMentor, także w tytule karty, nagłówku dla czytników i menu ustawień), `preview.tsx` (przełącznik motywu na `<html>` dla stories i stron docs, MSW, `a11y.test: "error"`, szerokości 320/768/1440), `blocks/` (pomocnicze bloki docs), `NOTES.md` (notatka techniczna z pochodzeniem bazy), `public/mockServiceWorker.js`.
- `vitest.storybook.config.ts` i skrypty: `storybook`, `build-storybook`, `test:storybook` (jasny, potem ciemny), w rootcie także `check:tokens`.
- Foundations (MDX): Color (role + kontrast mierzony w przeglądarce w obu motywach), Typography (role, pomiar długości linii), Spacing and layout, Shape and depth, Motion, Icons, Themes.
- `scripts/check-design-tokens.mjs` + `scripts/check-design-tokens/scan.mjs` z testami (100% pokrycia).
- CI: job „Design system” (check:tokens, build-storybook, Chromium, test:storybook).
- Konfiguracja: `eslint.config.mjs` (devDependencies w `.storybook` i `stories`, ignorowanie `storybook-static` i workera MSW), `.gitignore` (`storybook-static/`), `packages/ui/tsconfig.json` (stories, .storybook, typy vite/client).

## Etap 1: co sprawdzono

- Kontrast przeliczony z wartości zapisanych w `tokens.css` przed zapisem: wszystkie pary przechodzą; jedyna para poniżej progu to znana para ring/primary w ciemnym motywie (2,24 : 1), rozwiązana zatwierdzoną zasadą 21 (`ring-offset-2` na przycisku primary, etap 2). Ten sam wynik mierzy strona Color w przeglądarce.
- `npm run build-storybook`: OK. Wszystkie 7 stron Foundations w Chromium w obu motywach: tabele renderują się (0 surowych kresek), 0 błędów JS, `<html>` dostaje `.dark`.
- Testy stories: sonda (usunięta) potwierdziła, że naruszenie a11y kończy test błędem i że przebieg ciemny ustawia `.dark`.
- `npm run lint`: 0 błędów (1 ostrzeżenie z wygenerowanego `coverage/block-navigation.js`, istniało wcześniej). `npm run typecheck`: OK. `npm run test:unit`: 186 testów, 100% pokrycia.
- `NODE_ENV=production npm run build` aplikacji: OK; `/backend` w przeglądarce ma ciepłe tło, krój systemowy i `--radius` 0.375rem.
- `npm run check:tokens`: 27 znalezisk, wszystkie w obecnych prymitywach shadcn (`badge`, `button`, `card`, `field`, `input`): odstępy spoza skali i wartości arbitralne. Do usunięcia w etapie 2. Do tego czasu nowy job CI będzie czerwony.

## Decyzje etapu 1 i przed partią 1 etapu 2 (2026-11-06, Oliwia)

- F1–F5 przyjęte: `--container-reading` 56ch (zmierzone 61–69 znaków); role typografii (tytuł strony `text-xl font-semibold`, sekcji `text-base font-semibold`, etykieta `text-sm font-medium`, metadane `text-sm`, `tabular-nums`); `max-w-page` 64rem i panel sesji obok rozmowy od 768 px; `shadow-overlay`; ikony 16 px / 20 px.
- F6: lokalny SVG znaku GitHub w `currentColor` (potwierdzone przez Oliwię 2026-11-06).
- F7, F8: bez zmian (Chromium w CI; `--chart-*` szare).
- Tabela różnic względem shadcn (14 punktów) przyjęta w całości, w tym propozycje 7 (bez przesunięcia przy wciśnięciu), 8 (`--primary-hover`), 9 (`--secondary-hover`).
- Usunięte warianty: Button `xs`, `lg`, `icon-xs`, `icon-lg`; Badge `default`, `ghost`, `link` (w partii 2).
- Nowe tokeny `--primary-hover` (ochre-700 / ochre-300) i `--secondary-hover` (sand-200 / sand-700).

## Etap 2, partia 1 (2026-11-06)

- CLI: `npx shadcn@latest add textarea checkbox radio-group` (shadcn 4.23.0). Dodał tylko 3 pliki; `package.json` i `package-lock.json` bez zmian.
- Przestylowane: `button` (32/24 px, `rounded-md`, `gap-in-group`, `px-3`, fokus `ring-2 ring-ring ring-offset-2`, hover z tokenów, link w kolorze atramentu z podkreśleniem, bez wysokości i paddingu), `input`, `textarea`, `checkbox`, `radio-group` (zaznaczenie atramentem, nie akcentem), `field`, `label` (odstępy ze skali).
- Reguła z testów a11y: hover `destructive` z ciemniejszym tłem spadał do 4,0 : 1 (jasny, 20%) i 4,2 : 1 (ciemny, 30%), więc hover i wciśnięcie dodają czerwoną ramkę, a tło zostaje (WCAG 1.4.3).
- Zamrożone stany: w `.storybook/preview.css` warianty `hover`, `focus-visible`, `active` dopasowują też `[data-preview-state]`, więc macierz używa tych samych klas co komponent (tylko w Storybooku).
- Ciemny motyw na stronach docs: `.docs-story` dostaje `bg-background`.
- Testy jednostkowe: `src/components/ui/form-controls.test.tsx` (link, rozmiary, Textarea, Checkbox, RadioGroup).
- Stories (51) i strony docs z 13 sekcjami: Button, Link, Input, Textarea, Field (z Label), Checkbox, Radio group. Bloki docs: `DoDont`, `StateGrid`.
- `vitest.storybook.config.ts`: `optimizeDeps.include`, bo pierwsze uruchomienie po zmianie importów padało przy przeładowaniu zależności.

## Etap 2, partia 1: co sprawdzono

- `npm run test:storybook`: 51/51 w jasnym i 51/51 w ciemnym (a11y `error`, testy interakcji: kliknięcie, Enter/Spacja, Tab, wpisywanie, etykieta ustawia fokus, błąd ogłaszany, strzałki w radio).
- `npm run test:unit`: 192 testy, 100% pokrycia. `npm run lint`: 0 błędów. `npm run typecheck`: OK. `npm run build` aplikacji: OK. `npm run build-storybook`: OK.
- Strony docs w Chromium, oba motywy: 13 sekcji na każdej stronie komponentu, tabele bez surowych kresek, 0 błędów JS. Typography mierzy 61 / 69 / 65 / 54 znaki w linii przy 56ch.
- `npm run check:tokens`: 0 znalezisk w plikach partii 1; zostało 6 w `badge` i `card` (partia 2).

## Etap 2, partia 2 (2026-11-06)

- CLI: `npx shadcn@latest add select avatar alert`. Dodał tylko 3 pliki; `package.json` i `package-lock.json` bez zmian.
- Przestylowane: `select` (32/24 px, `rounded-md`, fokus jak w partii 1, lista z `shadow-overlay`, `border-border`, tylko zanikanie bez powiększania), `badge` (24 px, `rounded-sm` zamiast pigułki, `text-sm`; warianty `secondary` domyślny, `outline`, `destructive`; usunięte `default`, `ghost`, `link` zgodnie z decyzją), `avatar` (32/24 px; usunięte z nowego pliku CLI: `AvatarBadge` jako kropka statusu sprzeczna z R02.7/K2, `AvatarGroup`, `AvatarGroupCount`, rozmiar `lg`), `alert` (`rounded-md`, `border-border`, ikona 20 px zgodnie z F5, akcje pod tekstem zamiast nakładki `pr-18`), `card` (`border-border` zamiast ring, `rounded-lg`, `p-panel`, tytuł `font-semibold`), `separator` bez zmian.
- Nowe tokeny komponentów (warstwa 3, `@theme`): `--grid-template-columns-content-action`, `--grid-template-rows-title-description`, `--grid-template-columns-icon-content`, zamiast arbitralnych `grid-cols-[…]`.
- Testy jednostkowe: `display.test.tsx` (Alert, Avatar, Select), zaktualizowane testy Badge w `primitives.test.tsx`.
- Stories (35) i strony docs z 13 sekcjami: Select, Badge, Avatar, Card, Alert, Separator. Lokalny obrazek `.storybook/public/avatars/anna-kowalska.svg` zamiast awatara z GitHuba (testy bez sieci).

## Etap 2, partia 2: co sprawdzono

- `npm run test:storybook`: 86/86 w jasnym i 86/86 w ciemnym (a11y `error`; interakcje: Select klawiaturą i Escape, fokus Badge-linku, fallback Avatara, akcja w Card i Alert, Separator dekoracyjny/semantyczny).
- `npm run test:unit`: 198 testów, 100% pokrycia. `lint`: 0 błędów. `typecheck`: OK. Build aplikacji i Storybooka: OK. `/backend` działa.
- `npm run check:tokens`: 0 znalezisk w całym design systemie.
- Strony docs w Chromium, oba motywy: 13 sekcji, tabele poprawne. Jedyny błąd konsoli to celowe 404 obrazka w stanie „Picture failed” Avatara.
- Lista Select w portalu w ciemnym motywie ma tło `--popover` (zasada 9).

## Etap 2, partia 3 (2026-11-06)

- CLI: `npx shadcn@latest add dropdown-menu tooltip skeleton` i `yes n | npx shadcn@latest add dialog alert-dialog` (pytanie o nadpisanie `button.tsx` odrzucone; przycisk nietknięty). `package.json` i `package-lock.json` bez zmian.
- Przestylowane: `dialog`, `alert-dialog` (scrim `bg-overlay` bez rozmycia, `rounded-lg`, `border-border`, `shadow-overlay`, `p-panel`, marginesy 16 px na telefonie, max 24 rem, samo zanikanie, tytuł `font-semibold`, „Zamknij” po polsku, stopka z linią bez wypełnienia), `dropdown-menu` (pozycje ≥ 28 px, `shadow-overlay`, zanikanie; usunięte z nowego pliku: pozycje checkbox/radio, skróty, podmenu), `tooltip` (atrament na tle strony, `text-sm`, bez strzałki, opóźnienie 300 ms, odsunięcie 4 px), `skeleton` (`aria-hidden`, `rounded-sm`), `table` (wiersze `py-list-row-y px-list-row-x` ≈ 36 px, nagłówki 36 px, hover i zaznaczenie `--accent`). Z `alert-dialog` usunięte `AlertDialogMedia` i rozmiar `sm`.
- `card`: stopka bez wypełnienia `bg-muted` (sama linia), jak w dialogach.
- Nowy token `--overlay` (jasny: atrament 40%, ciemny: czarny 60%) i `--color-overlay`.
- Bloki `backend/feedback` (LoadingMessage, ErrorMessage, EmptyState) bez zmian w kodzie (zasada 12); dostały stories i stronę.
- Testy jednostkowe: `overlays.test.tsx`.
- Stories (40) i strony z 13 sekcjami: Dialog, Alert dialog, Dropdown menu, Tooltip, Skeleton, Table, Feedback.
- Lekcja: `.ai/lessons/2026-11-06-storybook-design-system-pitfalls.md`.

## Etap 2, partia 3: co sprawdzono

- Testy a11y znalazły: przycisk `destructive` na szarej stopce dialogu 4,42 : 1 → stopki bez wypełnienia; `aria-hidden-focus` w stories z menu otwartym od startu → opisany wyjątek tylko dla tych 3 stories (Radix ukrywa stronę i więzi fokus). Dwa testy zamykania nakładek padały przez porzucone portale z nieudanych stories; po poprawkach przechodzą.
- Sonda potwierdziła, że axe sprawdza treść w portalach.
- `npm run test:storybook`: 126/126 w jasnym i 126/126 w ciemnym. `npm run test:unit`: 205 testów, 100% pokrycia. `lint`: 0 błędów. `typecheck`: OK. `check:tokens`: 0 znalezisk. Build aplikacji i Storybooka: OK; `/backend` działa.
- Strony docs w Chromium, oba motywy: 20 stron komponentów, każda z 13 sekcjami, tabele poprawne; jedyny błąd konsoli to celowe 404 w stanie „Picture failed” Avatara. Alert dialog w ciemnym motywie: panel i scrim z tokenów, fokus na „Zostaw rezerwację”.

## Etap 2: podsumowanie

- 20 stron komponentów (Button, Link, Input, Textarea, Field z Label, Checkbox, Radio group, Select, Badge, Avatar, Card, Alert, Separator, Dialog, Alert dialog, Dropdown menu, Tooltip, Skeleton, Table, Feedback), 126 stories, z czego 26 z testem interakcji (play).
- Zestaw minimalny bez przełącznika, popovera, zakładek i toastu (decyzja Q5); trafią do „What is missing” w etapie 4.

## Decyzje w etapie 3 (2026-11-06, Oliwia)

- H1: CrudForm dostaje walidację po opuszczeniu pola i fokus na pierwszym błędzie po nieudanym wysłaniu (zgoda). Pole `checkboxes` na stack tagi: bez decyzji (nie wdrożone).
- H2 = a: CrudForm dostaje `submitVariant`; na /login formularz e-mail ma przycisk `outline`, a „Zaloguj się przez GitHub” jest główny (spec).
- H3: DataTable dostaje `emptyAction`.
- H4: ekrany w gałęzi Screens to kompozycje prawdziwych komponentów pakietu; strony `page.tsx` powstaną w historiach backlogu.
- H5: przyjęte teksty: `github_no_verified_email`, `github_already_linked`, `github_unavailable`, błąd wylogowania z odpowiedzi serwera, link „Przejdź do treści”.

## Etap 3, część 1 (2026-11-06)

- `src/lib/format.ts` (`formatPln`, `formatDateTime`) z testami.
- E01: `components/auth/{GitHubButton,SignOutButton,AuthMessage,auth-messages}`, `backend/feedback/AccessDenied`, `backend/layout/{AppShell,NavLinks}` z testami (220 testów, 100%).
- Poprawione dni tygodnia w przykładach (13.11.2026 to piątek).

## Etap 3, kontynuacja (2026-11-06)

- Dodane stories produktowe, wyłącznie na bazie eksportów pakietu: `Product/E01 Accounts and access`, `Product/E02 Mentor offer and E03 Finding a mentor`. E01 pokazuje wybór logowania, błąd OAuth, konto, role i odmowę dostępu. E02/E03 pokazują rzeczywiste komponenty `MentorProfile`, `MentorList` i `StackFilter` z gotowym, ładowanym, błędnym, pustym, odfiltrowanym pustym i długim stanem listy.
- Dodane wzorce `Patterns/Form` (walidacja, oczekiwanie, błąd pola, błąd serwera, brak sieci, potwierdzony sukces; odpowiedź serwera symulowana przez `onSubmit` istniejącego `CrudForm`) i `Patterns/Filtered list` (wyniki, ładowanie, błąd, brak danych, brak dopasowań, paginacja).
- Dodane pełnoekranowe stories `Screens/Key backlog screens` dla E01–E05 oraz `Screens/Epics` z przepływami, źródłami decyzji i mapą stanów. E02–E05 są jawnie opisane jako propozycje; brakujące stany oraz brak kontraktu checkout/session/Connect wypisano na stronie. E06 pominięte jako Later zgodnie z D34.
- Naprawiono skaner tokenów dla Windows: separator ścieżki zwracanej przez `path.relative()` jest normalizowany przed porównaniem z `tokens.css`. Dodano test regresyjny. Uodporniono asercje ścieżek w testach skanera i instalatora na separator systemowy; lekcja zapisana w `.ai/lessons/2026-11-06-windows-paths-in-scans-and-tests.md`.
- Zastąpiono uniksowe przypisanie `STORYBOOK_THEME=...` w skrypcie Storybooka małym `.storybook/test-stories.mjs`, który uruchamia Vitest kolejno w obu motywach na Windows i Unix bez nowej zależności.

## Etap 3: weryfikacja kontynuacji (2026-11-06)

- `npm install --ignore-scripts`: zakończony kodem 0 po ponowieniu; `package.json` i `package-lock.json` bez zmian. Pierwsza próba z rejestrem skonfigurowanym w npm zwróciła 404 dla Storybooka; publiczny registry nie odpowiedział. Ponowienie przywróciło zależności, ale binding natywny Rolldown nie ładuje się na Windows (`ERR_DLOPEN_FAILED`, „not a valid Win32 application”).
- `npm run typecheck`: OK po dodaniu domyślnych `args` w stories.
- `npm run check:tokens`: OK, 0 znalezisk.
- Testy celowane skanera tokenów i instalatora: 46/46 OK. Pełny `npm run test:unit` wcześniej wykrył trzy problemy przenośności ścieżek; poprawki przeszły w przebiegu celowanym, ale pełnego biegu nie udało się powtórzyć po uszkodzeniu `node_modules` podczas instalacji.
- `npm run test:storybook`: nie uruchomił się przez wadliwy plik `.node` Rolldown. `build-storybook` i przegląd stron w Chromium: niewykonane.
- `npm run lint`: zatrzymuje się na istniejącym `AppShell.tsx:28` (`@next/next/no-html-link-for-pages`, link `<a href="/">`); plik nie był częścią tej kontynuacji.
- `git diff --check`: OK.

## Stan kompletności etapu 3

- To nie jest etap zakończony. Stories przeszły testy obu motywów po naprawie środowiska (wyniki poniżej). Nadal brakuje ręcznego przeglądu wszystkich stron i szerokości, osobnych komponentów produktu dla E04/E05, pełnych stanów danych E04/E05 oraz konkretnych kontraktów checkout/session/note/Connect z brakujących specyfikacji. Nie wymyślaj tych zachowań — pozostają jawnie oznaczone jako brakujące/propozycje.
- Otwarte decyzje G1–G5 pozostają otwarte. Zmiany z G1–G3 nie naruszają bazowego CSS komponentów; G4 nie zmienia istniejących `EmptyState`/`ErrorMessage`; copy z G5 nie zostało przyjęte jako kanoniczne.
- `npm install` zgłosił 24 podatności w całym drzewie zależności. Nie uruchamiano `npm audit fix` ani nie zmieniano wersji.

## Pytania z końca etapu 2 (historyczne; rozstrzygnięte 2026-11-13)

- G1: Nowy token `--overlay` (scrim dialogów): atrament 40% / czarny 60%, bez rozmycia (A01). Propozycja.
- G2: Tooltip: opóźnienie 300 ms, odsunięcie 4 px, bez strzałki. Propozycja.
- G3: Stopki dialogów i kart z samą linią, bez wypełnienia (kontrast `destructive`, R01.3). Wynika z testu a11y; do potwierdzenia.
- G4: EmptyState i ErrorMessage są wyśrodkowane; „What to avoid” odradza centrowanie wszystkiego. Zostawić czy wyrównać do lewej (zmiana istniejącego bloku, zasada 12)?
- G5: Nazwy statusów w przykładach („Opłacona”, „Anulowana”, „Zakończona”, „Wypłata wstrzymana”) i akcje zaproszeń („Kopiuj link zaproszenia”, „Wyślij ponownie”, „Cofnij zaproszenie”) to propozycje do czasu specyfikacji E01-S02, E03 i E05.



## Propozycje agenta: decyzje (2026-11-06, Oliwia)

- P-S1 tak: specyfikacja `.ai/specs/2026-11-06-design-system-storybook.md` (zapisana 2026-11-06).
- P-S2 tak: job CI „Storybook” (build, a11y i interakcje w obu motywach, skrypt tokenów).
- P-S3 tak: plik dla agentów `.ai/docs/design-system.md` z odwołaniem w AGENTS.md.
- P-S4 tak: przełącznik motywu jako własny dekorator (bez `@storybook/addon-themes`).
- P-S5 tak: bez toastu i bez `sonner`.
- P-S6 tak: skrypt tokenów w `scripts/check-design-tokens.mjs` z testem jednostkowym.
- P-S7 tak: telemetria Storybooka wyłączona.

## Następny krok

Dokończyć brakujące prezentacje etapu 3 dla E01–E03 (lista poniżej), dokumentację komponentów auth/mentors i mapę wszystkich ekranów. Najpierw oprzeć te ekrany na materiałach; brakujące decyzje przedstawiać jako propozycje zgodnie z Q2, nie jako gotowe kontrakty produktu. Nie przechodzić do etapu 4 przed pełnym etapem 3 i nowym „dalej”. G1–G5 są rozstrzygnięte.

Aktualizacja 2026-11-16: plan kontynuacji zatwierdzony przez użytkownika. Dodano 11 stron komponentów auth/layout/mentors (po 13 sekcji), mapę Patterns/Product flows i 75 stories E01–E03/Auth states. Uzupełniono mapę Screens/Epics. Użytkownik zatwierdził również poprawkę istniejącego GitHubButton: zawijanie długiej etykiety i wysokość automatyczna od minimum 32 px. Nowy test regresyjny zachowuje 100% pokrycia. Bieżące wyniki i braki są zapisane w sekcji kontynuacji 2026-11-16 poniżej; starsze stwierdzenia o brakujących prezentacjach traktuj historycznie.

## Kontynuacja 2026-11-16

### Naprawa testów po kontynuacji

Na osobne polecenie użytkownika naprawiono konfigurację startu integracji: `fsModuleCache: false` musi obejmować także główny projekt Vitesta uruchamiający globalSetup. Uruchomiono zainstalowany Docker Desktop i potwierdzono gotowość silnika. Końcowe rzeczywiste wyniki: integracja 4/4, E2E 5/5, jednostkowe 262/262 i 100% pokrycia; lint, typecheck i produkcyjny build OK. Testy korzystały z efemerycznych baz Testcontainers, bez podmieniania na bazę deweloperską. Historyczne błędy środowiska poniżej zostały tym samym usunięte. Log: `.ai/runs/2026-11-16-repair-test-runners.md`. Braki etapu 3 i decyzja H1 pozostają bez zmian.

- Nowe manuale: GitHubButton, AuthMessage, SignOutButton, AppShell, NavLinks, MentorList, MentorListRow, MentorProfile, PublicWorkLink, StackFilter, StackTags. Dokumentacja po angielsku, przykłady UI po polsku zgodnie z zatwierdzonym Q1.
- Nowe stories: AccountFlows 27, OfferFlows 11, BookingFlows 16, AuthStates 21. Rejestracja, błędy GitHub, role, zaproszenia, profil/ceny/dostępność, checkout i rezerwacje. Niespecyfikowane układy są propozycjami, nie kontraktami API. SignOut używa MSW i wstrzykniętej nawigacji.
- Poprawiono asynchroniczną asercję wylogowania (`waitFor`). Przegląd przy 320 px wykrył przepełnienie długiego GitHubButton; poprawka zatwierdzona przez użytkownika i wdrożona bez zmiany tokenów ani zależności.
- Weryfikacja po poprawce przycisku: 292/292 stories w każdym motywie (a11y error, wcześniejsze opisane wyjątki bez zmian). Build Storybooka i produkcyjny build aplikacji po poprawce OK. Testy jednostkowe: 262/262 i 100% wszystkich czterech metryk.
- Lint, typecheck, skaner tokenów i diff whitespace po poprawce OK. Integracja nie startuje przez Vite `code.charCodeAt is not a function`. E2E nie startuje przez brak działającego runtime kontenerów (również próba poza sandboxem). Nie zaliczono żadnego scenariusza integracyjnego/E2E.
- Otwarte braki: wybór pola do edycji wielu tagów profilu (H1 nadal bez decyzji), jednostka i walidacja prowizji, pełne stany danych formularzy E02, specyfikacje zaproszeń i walidacji terminów, checkout/płatności, realtime/reconnect i wersjonowanie notatki oraz Connect. Nie przyjmuj ich jako rozstrzygniętych przez przykłady.
- H1 przedstawiono do decyzji 2026-11-16: propozycja pola grupy checkboxów w istniejącym CrudForm dla TypeScript, React, Python i AI agents. Zgoda na poprawkę GitHubButton nie oznacza zgody na H1. Kolejny krok po tym przebiegu: rozstrzygnąć H1, uzupełnić edycję profilu i pozostałe stany E02 bez wymyślania jednostki prowizji, następnie domknąć przegląd etapu 3. Nie przechodzić do etapu 4.
- Etap 3 nadal otwarty; etapów 4/5 nie rozpoczęto. Żadnej publikacji ani pushowania. Log: `.ai/runs/2026-11-16-design-system-stage-3.md`.
- Końcowa przeglądarka po poprawce: 75 nowych stories × 320/768/1440 px × oba motywy = 450 kontroli oraz 20 stron MDX × oba motywy = 40; razem 490. Brak błędów JS, przepełnień strony, błędnego motywu i surowych tabel Markdown. Strony Product mają po 13 sekcji i renderowane tabele. Wizualnie sprawdzono etykietę GitHub i publikację dostępności przy 320 px w obu motywach oraz checkout w jasnym. Nie jest to pełny audyt wszystkich wcześniejszych stories ani pełny ręczny audyt klawiaturą. Wyniki: `.ai/qa/artifacts_2026-11-16-stage3/browser-focused-results.json`.

## Decyzje podczas kontynuacji 2026-11-13

- Użytkownik zatwierdził G1–G3: scrim atrament 40% / czarny 60%, tooltip 300 ms / 4 px / bez strzałki, stopki kart i dialogów z samą linią bez wypełnienia.
- Użytkownik zatwierdził G5: nazwy statusów i akcje zaproszeń z pytania G5 są docelowe. Nie oznacza to zatwierdzenia nowych stanów technicznych ani kontraktów API E04/E05.
- G4: po doprecyzowaniu użytkownik wybrał „Pozostaw wyśrodkowane”. EmptyState i ErrorMessage zachowują istniejący układ.

## Kontynuacja etapu 3 — zakres wykonany 2026-11-13

- Zachowano wszystkie wcześniejsze zmiany. Uzupełniono jednostkowe testy mentorów oraz pięciu roboczych komponentów E04/E05: MessageComposer, SessionTranscript, PrivateNote, ConnectStatus, PayoutList.
- Dodano 35 produktowych stories E04/E05: stany ładowania, pustki, błędu, częściowych danych, długiej/dużej treści, wysyłania, potwierdzenia, konfliktu notatki, zatwierdzania, konfiguracji Connect i wstrzymania wypłaty. Interakcje nie udają utrwalenia danych.
- Dodano pięć stron produktu z 13 sekcjami każda, API i źródłami reguł. Kompozycje E04/E05 na ekranach używają rzeczywistych eksportów pakietu; dodano 10 pełnoekranowych wariantów stanów i zaktualizowano mapy epików.
- Dodano Patterns/Detail view i Patterns/Delete confirmation (realny przykład: anulowanie płatnej rezerwacji, R27), wraz z dokumentacją i testami klawiatury/fokusu. Formularz ma automatycznie uruchamiane podglądy odpowiedzi serwera, zachowanych danych i fokusu błędów.
- Dopisano widoczne wyjaśnienia blokady pustej wiadomości i pustej notatki. Usunięto komunikat o udostępnianiu treści sprzeczny z R31/D44. Naprawiono uszkodzone polskie znaki w roboczych ekranach.
- Reguła Next `no-html-link-for-pages` działa nadal w aplikacji, ale nie w niezależnym pakiecie UI renderowanym także przez Storybook. AppShell zachowuje natywny link; nie dodano zależności UI od Next. Reguły granic architektury bez zmian.
- Bez nowych zależności, bez zmian aplikacji, bez publikacji i pushowania.

## Historyczna lista luk etapu 3 (audyt 2026-11-13; superseded 2026-11-16)

To lista braków, nie zgoda na wymyślanie ich kontraktów.

1. E01: pełne stany rejestracji, powiązanego konta GitHub/błędów łączenia, paneli ról oraz lista/tworzenie/przyjęcie zaproszenia. Dokumentacja komponentów auth/layout z 13 sekcjami.
2. E02: edycja/publikacja profilu, formularze cen 25/50 min i limitów operatora, ustawienie prowizji, publikowanie dostępności. Dokumentacja komponentów mentors z 13 sekcjami.
3. E03: wybór terminu i checkout z ceną, warunkami bez zwrotu i odpowiedziami płatności; kontekst listy/szczegółów rezerwacji dla anulowania. Obecny formularz jest demonstracją mechaniki, nie kontraktem checkout.
4. Mapa zaakceptowanych wzorców Sign-in, Access gate, Booking checkout, Text session i Co-edited note: część zachowań istnieje w Product; trzeba wskazać te kompozycje lub dodać brakujące prezentacje bez kopiowania komponentów.
5. Brakujące kontrakty wdrożeniowe: checkout/płatności, realtime/reconnect i potwierdzenie wiadomości, wersje/porównanie/zatwierdzanie notatki, powrót Connect, mapowanie statusów dostawcy i wyliczenia rozliczeń. Samo istnienie stories nie oznacza implementacji backendu ani tych kontraktów.

Stan z 2026-11-13: etap 3 nie był zakończony. Lista została przeaudytowana i jej luki prezentacyjne E01–E03 pokryto do 2026-11-16; aktualny status znajduje się w checkpointcie na początku pliku. Nierozstrzygnięte kontrakty produktu nadal są opisane jako braki.

## Weryfikacja kontynuacji 2026-11-13

- `npm run test:unit`: 258/258 testów, 100% statements / branches / functions / lines dla całego zakresu konfiguracji (753/514/288/704). Progów i wykluczeń nie zmieniano.
- `npm run test:storybook`: 217/217 stories w jasnym i 217/217 w ciemnym motywie; `a11y.test: error`. Istniejące trzy opisane wyjątki Radix pozostają, nie dodano nowych wyłączeń.
- `npm run lint`, `npm run typecheck`, `npm run check:tokens`, `npm run build-storybook`, `git diff --check`: OK. Skaner tokenów: 0 znalezisk. W części wcześniejszych przebiegów lint ostrzegał o wygenerowanym `coverage/block-navigation.js`, bez błędu źródeł.
- `$env:NODE_ENV='production'; npm run build`: OK (aplikacja). Brak zmian schematu bazy, więc migracji nie generowano.
- `npm run test:integration` oraz `npm run test:e2e`: NIEPRZECHODZĄCE. Runner zatrzymuje się przy starcie z `TypeError: code.charCodeAt is not a function` w Vite/source-map. Żaden scenariusz nie otrzymał statusu zaliczonego; komunikat „No test files found” towarzyszył błędowi startowemu.
- Chromium na stabilnym buildzie: 91 stories z Product/Patterns/Screens × 320/768/1440 px × 2 motywy oraz 8 stron docs × 2 motywy = 562 kontrole, 0 błędów JS, 0 przepełnień strony, poprawny motyw na `<html>`. Sprawdzono wizualnie zrzuty sesji i wypłat w obu motywach przy 320 px. Tabela wypłat przewija się we własnym kontenerze. Każda z pięciu nowych stron komponentów ma w przeglądarce 13 sekcji i działające tabele.
- Klawiaturę, fokus i nakładki sprawdzają play functions (m.in. Enter wysyła, Escape zamyka, powrót fokusu, bezpieczna domyślna rezygnacja); nie deklarujemy pełnego ręcznego audytu całego Storybooka z etapu 5.
- Po zatwierdzeniu G1–G5 zaktualizowano również źródła w dokumentacji Tooltip/Badge/Card/Dialog/Feedback i komentarze tokenu overlay; ponownie zbudowano Storybook i sprawdzono te 5 stron w obu motywach (10/10, bez błędów JS).
- Szczegółowe logi, pomiary i zrzuty są lokalnie w ignorowanym `.ai/qa/artifacts_2026-11-13-stage3/`. Nie zostały opublikowane.

## Naprawa środowiska (2026-11-06, po kontynuacji)

- Rolldown: plik natywny x64 był ucięty (5 102 500 zamiast 23 133 184 bajtów). Ponownie pobrano dokładnie `@rolldown/binding-win32-x64-msvc@1.2.16` przez `npm pack` i zastąpiono uszkodzony plik. Bez zmian wersji i lockfile; import bindingu działa.
- Poprawiono import `@storybook/blocks` w `stories/screens/Epics.mdx` na eksport z zainstalowanego `@storybook/addon-docs/blocks`.
- `npm run build-storybook`: OK. Zainstalowano Chromium/Headless Shell 1254 przez `npx playwright install chromium`.
- `npm run test:storybook`: OK, 25 plików i 160/160 stories w jasnym oraz 25 plików i 160/160 stories w ciemnym motywie. Kontrola a11y w trybie `error`, z wcześniej opisanymi wyjątkami istniejących stories. Pierwsze próby zatrzymano podczas wolnego startu; końcowy pełny przebieg zakończył się kodem 0.
- Pełne `npm run test:unit`: 228/228 asercyjnych testów przechodzi, ale komenda kończy się błędem progu pokrycia: statements 95,63%, branches 89,04%, functions 93,68%, lines 95,66%. Istniejący katalog `src/components/mentors` ma 0% pokrycia; to brak etapu 3, niezależny od środowiska. Progów nie zmieniano.
