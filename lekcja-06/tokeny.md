# Tokeny: DevMentor

- Data: 2026-11-06. Zatwierdziła: Oliwia. Źródło decyzji: `lekcja-06/referencje.md`.
- Plik tokenów: `packages/ui/src/tokens.css` nie istnieje; mapowanie wykonano na `packages/ui/src/styles/globals.css` (zmienne shadcn i `@theme inline`), jedyny plik z tokenami w repozytorium. Strony `(marketing)` nie importują tych tokenów (kolory na sztywno w `(marketing)/layout.tsx`).
- Nazwy shadcn (`background`, `primary`, `muted-foreground`…) opisują przeznaczenie, więc są warstwą znaczeniową; zmieniają się ich wartości. `accent` w shadcn to tło najechanego elementu, nie kolor marki: ciepły akcent to `primary`.
- Wartości bez referencji (odcień ochry, kroje systemowe, `--radius`, `--measure-reading`, gęstość wiersza, wcięcie sesji) zaproponował agent; zatwierdzone 2026-11-06.
- Kontrast liczony wzorem WCAG 2.x z wartości oklch po konwersji do sRGB. Wartości w tabeli: jasny / ciemny motyw.

| token | warstwa | wartość | pochodzenie | gdzie używać | gdzie nie używać |
|---|---|---|---|---|---|
| `--sand-0…950` | surowa | 0 `#fefdfb` oklch(0.995 0.003 80) · 50 `#fbf9f5` (0.982 0.006 80) · 100 `#f5f1ec` (0.960 0.008 80) · 200 `#e8e3dd` (0.918 0.010 78) · 300 `#d6d0c9` (0.860 0.012 75) · 400 `#a49d95` (0.700 0.014 72) · 500 `#867f77` (0.600 0.015 70) · 600 `#69625a` (0.500 0.015 68) · 700 `#4d4641` (0.400 0.013 65) · 800 `#2f2a26` (0.290 0.011 65) · 850 `#24201c` (0.245 0.010 65) · 900 `#1a1613` (0.205 0.009 65) · 950 `#100d0a` (0.160 0.008 65) | R01.4, P01 (ciepłe szarości) | tylko w pliku tokenów, jako źródło tokenów znaczeniowych | w komponentach i klasach (`bg-sand-100` zakazane) |
| `--ochre-100…700` | surowa | 100 `#fbecd9` (0.950 0.030 75) · 300 `#eaba83` (0.820 0.090 70) · 400 `#dc9c50` (0.740 0.120 68) · 500 `#c37829` (0.640 0.130 62) · 600 `#a15a16` (0.540 0.120 58) · 700 `#824717` (0.460 0.100 55) | R01.4 (ciepły akcent); odcień ochry zatwierdzony 2026-11-06 bez referencji koloru | tylko w pliku tokenów | w komponentach |
| `--red-700`, `--red-300` | surowa | `#c22826` oklch(0.530 0.190 27) / `#f2716a` oklch(0.700 0.160 25) | zastępuje obecny `destructive` spoza gamutu sRGB; kontrast | tylko w pliku tokenów | w komponentach |
| `--spacing` | surowa (istniejąca, Tailwind) | `0.25rem`; dozwolone kroki 1, 2, 3, 4, 6, 8, 12 = 4, 8, 12, 16, 24, 32, 48 px | jedna skala odstępów | wszystkie odstępy | wartości spoza skali (`p-5`, `gap-[10px]`) |
| `--radius` | surowa (istniejąca) | `0.625rem` → `0.375rem` (lg 6 px, xl ≈ 8 px, 2xl ≈ 11 px) | A01, P11 („`rounded-2xl` wszędzie”) | podstawa skali promieni | — |
| `--font-sans` | surowa (istniejąca, dziś samoodwołanie) | `ui-sans-serif, system-ui, sans-serif` | luka typografii; naprawa `--font-sans: var(--font-sans)` | cały tekst interfejsu | kod i identyfikatory |
| `--font-mono` | surowa (istniejąca, Tailwind) | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` | R01.2 (monospace) | kod, nazwy plików, gałęzie, wersje | proza, imiona, ceny |
| `--default-transition-duration` | surowa (istniejąca, Tailwind) | `150ms`; przy `prefers-reduced-motion` 0 | P18 | przejście stanu: wysłano, zapisano, hover | animacje ozdobne, wejścia sekcji |
| `--background` | znaczeniowa | sand-50 / sand-950 | R01.4, P01 | tło strony, list i sesji | — |
| `--foreground` | znaczeniowa | sand-900 / sand-50 | R01.4 | tekst podstawowy, imię mentora | — |
| `--card`, `--card-foreground` | znaczeniowa | = background / = foreground | R01.3 (linie zamiast kart) | gdzie prymityw shadcn wymaga `card` | jako wyróżnione pudełko na listach |
| `--popover`, `--popover-foreground` | znaczeniowa | sand-0 / sand-900; fg = foreground | nakładki muszą odróżniać się od tła | menu, dropdown, dialog | stałe panele |
| `--primary` | znaczeniowa | ochre-600 / ochre-400 | R01.4, R01.5, K3 | jedna główna akcja na ekranie | wiele przycisków na ekranie; błędy |
| `--primary-foreground` | znaczeniowa | sand-0 / sand-950 | kontrast | tekst na `primary` | na innych tłach |
| `--highlight-foreground` | znaczeniowa, nowa | ochre-700 / ochre-300 | R01.5, K3, P02 | czas do końca na ekranie trwającej sesji (wyróżnienie kolorem) | razem z `font-semibold`; w wierszach list (tam wyróżnia waga) |
| `--secondary`, `--secondary-foreground` | znaczeniowa | sand-100 / sand-800; fg sand-900 / sand-50 | R01.6 (jedna główna akcja) | akcje drugorzędne | główna akcja |
| `--muted`, `--muted-foreground` | znaczeniowa | sand-100 / sand-850; fg sand-600 / sand-400 | R02.3, R01.1 | metadane: godzina, stack, opisy pomocnicze | treść wiadomości, ceny, termin |
| `--accent`, `--accent-foreground` | znaczeniowa (nazwa shadcn) | sand-100 / sand-800; fg sand-900 / sand-50 | R01.1 (wiersz pod kursorem) | hover i aktywny wiersz, element menu | jako kolor marki (to `primary`) |
| `--destructive` | znaczeniowa | red-700 / red-300 | kontrast; poprawka gamutu | błędy, anulowanie | bez tekstu lub ikony (jasnością prawie równy `primary`, 1,11:1) |
| `--border` | znaczeniowa | sand-200 / sand-800 | R01.3 (cienkie linie) | linie między wierszami (`divide-y`), separatory | obrys pól formularza |
| `--input` | znaczeniowa | sand-500 / sand-600 | WCAG 1.4.11 (obecne 1,26:1) | obrys pól, pole wiadomości | linie między wierszami |
| `--ring` | znaczeniowa | sand-900 / sand-50 | WCAG 2.4.7, 1.4.11 (obecne 2,59:1; ochra z `/50` 1,75:1) | obwódka fokusu | dekoracja |
| `--code`, `--code-foreground` | znaczeniowa, nowa | sand-100 / sand-850; fg sand-900 / sand-50 | R01.2 | kod w linii i bloki kodu w sesji i notatce | zwykły tekst |
| `--sidebar-*` | znaczeniowa (istniejąca) | = background, foreground, primary, accent, border, ring | A01 (usuwa fiolet `oklch(0.488 0.243 264)` z ciemnego motywu), P07 | panel `/backend`, jeśli powstanie boczny pasek | ekran sesji |
| `--chart-*` | znaczeniowa (istniejąca) | bez zmian | brak decyzji | — | — |
| `--space-in-group` | znaczeniowa, nowa | `calc(var(--spacing) * 2)` = 8 px | R02.3 | autor i godzina, ikona i tekst, etykieta i wartość | między grupami |
| `--space-between-groups` | znaczeniowa, nowa | `calc(var(--spacing) * 4)` = 16 px | K1 | między wiadomościami, między polami formularza | wewnątrz grupy |
| `--space-panel` | znaczeniowa, nowa | `calc(var(--spacing) * 4)` = 16 px | K1 (gęsto na listach) | wcięcie paneli list i ekranów operatora | ekran sesji i notatka (`--session-padding`) |
| `--space-section` | znaczeniowa, nowa | `calc(var(--spacing) * 8)` = 32 px | jedna skala odstępów | między sekcjami strony | wewnątrz list |
| `--measure-reading` | znaczeniowa, nowa | `70ch` | K1, R02.1 | maksymalna szerokość rozmowy w sesji i notatki | listy, tabele |
| `--list-row-padding-y`, `--list-row-padding-x` | komponentu (`table`, `DataTable`) | 8 px / 12 px; tekst `text-sm` (wiersz ok. 36 px) | R01.1, K1 | wiersze list mentorów, sesji i operatora | sesja, formularze |
| `--session-padding` | komponentu (ekran sesji, notatka) | 24 px; tekst `text-base` z `leading-relaxed` | K1, R02.1 | ekran sesji i notatki | listy |

Rozmiary i interlinie fontu pochodzą z istniejących tokenów Tailwinda (`text-sm`, `text-base`, `leading-relaxed`); bez nowych tokenów.

## Pary kolorów i kontrast

Progi: tekst 4,5 : 1, elementy interfejsu (UI) 3 : 1.

| para | rodzaj | jasny | ciemny |
|---|---|---|---|
| foreground / background | tekst | 17,02 ✅ | 18,44 ✅ |
| foreground / popover | tekst | 17,67 ✅ | 17,02 ✅ |
| muted-foreground / background | tekst | 5,71 ✅ | 7,26 ✅ |
| muted-foreground / muted | tekst | 5,35 ✅ | 6,07 ✅ |
| muted-foreground / code | tekst | 5,35 ✅ | 6,07 ✅ |
| primary-foreground / primary | tekst | 5,18 ✅ | 8,23 ✅ |
| secondary-foreground / secondary | tekst | 15,96 ✅ | 13,42 ✅ |
| accent-foreground / accent | tekst | 15,96 ✅ | 13,42 ✅ |
| highlight-foreground / background | tekst | 7,00 ✅ | 10,98 ✅ |
| highlight-foreground / accent | tekst | 6,56 ✅ | 7,99 ✅ |
| code-foreground / code | tekst | 15,96 ✅ | 15,42 ✅ |
| destructive / background | tekst | 5,52 ✅ | 6,77 ✅ |
| destructive / destructive 10% (jasny) lub 20% (ciemny) nad tłem | tekst | 4,72 ✅ | 5,12 ✅ |
| primary / background | UI | 4,99 ✅ | 8,23 ✅ |
| input / background | UI | 3,76 ✅ | 3,23 ✅ |
| ring / background | UI | 17,02 ✅ | 18,44 ✅ |
| ring 50% (poświata shadcn) / background | UI | 3,37 ✅ | 5,12 ✅ |
| ring / primary (fokus na głównym przycisku) | UI | 3,41 ✅ | 2,24 ⚠️ → poprawka: `ring-offset` 2 px na przycisku `primary` (zasada 21) |
| border / background | dekoracja, bez progu | 1,21 | 1,37 |

Zastąpione wartości poniżej progu: obecny `ring` 2,59 : 1, `input` 1,26 : 1, `ring/50` ok. 1,6 : 1; pierwsza wersja `ring` w ochrze z `/50` 1,75 : 1. `primary` i `destructive` różnią się jasnością tylko 1,11 : 1, więc błąd zawsze ma tekst lub ikonę (zasada 13).

## Decyzje, które nie są tokenami

Zasady:
1. Jeden wyróżniony element na ekran: kolorem albo wagą fontu, nie oba (R01.5, K3, P02). Lista mentorów: najbliższy slot, `font-semibold`. Lista sesji: data i godzina, `font-semibold`. Ekran trwającej sesji: czas do końca, `highlight-foreground`.
2. Termin i czas jako fakt (dzień, godzina, minuty), bez „już za…” i „dostępny teraz” (R01.5, R14, K2).
3. Kolor akcentu (`primary` lub `highlight-foreground`) ma na ekranie dokładnie jeden element.
4. Listy bez kart i cieni; wiersze rozdziela `divide-y divide-border` (R01.3). Cień tylko na nakładkach (menu, dialog).
5. Bez liczników na zakładkach, rzędów ikon statusu i wielu akcji w nagłówku (R01.6, P03).
6. Monospace dla kodu, nazw plików, gałęzi i wersji; nigdy dla prozy, imion i cen (R01.2).
7. Bez sygnałów obecności poza sesją: kropki „online”, „dostępny teraz” (R02.7, K2).
8. Powiadomienia tylko o rezerwacji, starcie sesji i notatce do akceptacji; bez liczników nieprzeczytanych (R02.4, P05).
9. Ruch tylko jako potwierdzenie zmiany stanu; przy `prefers-reduced-motion` czas 0 (P18).
10. Ton: krótkie zdania, cena i brak zwrotów podane przed płatnością, bez obietnic szybkości, po polsku (P17, A06).
11. Zakazy do review (i ewentualnie lintu): `bg-clip-text` z gradientem, `backdrop-blur`, ikona `Sparkles`, poświaty, gwiazdki i oceny, paski postępu, odznaki, tabela planów, ikony kamery i mikrofonu, cena „od X zł” (A01–A06, P11–P16).
12. Każdy token ma wartość w obu motywach; kontrast sprawdzany w obu (tryb ciemny przyjęty).
13. Błąd zawsze z tekstem lub ikoną, nie samym kolorem (WCAG 1.4.1).

Cechy komponentów:
14. Lista (`table`, `DataTable`): wiersz = obiekt, gęstość z `--list-row-padding-*` (R01.1, K1).
15. Ekran sesji: rozmowa na środku, szerokość do `--measure-reading` (R02.1, K1).
16. Wiadomość: autor i godzina przy każdej, w `muted-foreground` (R02.3).
17. Pole pisania stale widoczne pod rozmową; Enter wysyła, Shift+Enter nowa linia (R02.2).
18. Jedna liniowa rozmowa, bez wątków i cytowania z odgałęzieniem (R02.8, K4).
19. Bez reakcji emoji i wybieraka emoji (R02.5, P06).
20. Panel sesji: tylko pytanie, druga osoba, czas do końca, informacja, że sesja jest tekstowa (R02.6, P07, R03 briefu).
21. Przycisk `primary` ma `ring-offset` 2 px przy fokusie (poprawka kontrastu w ciemnym motywie).

Uwagi do wdrożenia:
22. Naprawić samoodwołanie `--font-sans: var(--font-sans)` w `globals.css`.
23. Strony `(marketing)` mają dostać te same tokeny zamiast `bg-white text-slate-900`, np. przez wydzielenie `packages/ui/src/styles/tokens.css` importowanego w obu grupach; zmiana struktury, decyzja przy wdrożeniu.
