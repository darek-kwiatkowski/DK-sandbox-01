# POSTĘP: design system DevMentor i Storybook

Plik roboczy. Nowa sesja zaczyna od przeczytania go i kontynuuje od „Następny krok”.

## Etapy

| Etap | Stan |
|---|---|
| 0. Inwentaryzacja i plan | zakończony 2026-11-06 |
| 1. Fundamenty | zakończony 2026-11-06 |
| 2. Komponenty bazowe | zakończony 2026-11-06 (3 partie); czeka na decyzje G1–G5 i „dalej” |
| 3. Komponenty produktu, wzorce i ekrany | nie rozpoczęty |
| 4. Strony, które uczą | nie rozpoczęty |
| 5. Sprawdzenie i raport | nie rozpoczęty |

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

## Otwarte pytania (koniec etapu 2)

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

Etap 2 zakończony. Czekam na decyzje G1–G5 i „dalej”. Etap 3: komponenty produktu według epików, wzorce ze stanami danych i API (MSW) oraz ekrany z mapą stanów.
