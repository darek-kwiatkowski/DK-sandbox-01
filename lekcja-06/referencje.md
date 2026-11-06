# Referencje: DevMentor

- Data: 2026-11-06
- Kto wybierał: Oliwia; zapis i propozycje: agent (Claude Code).
- Słowa charakteru (potwierdzone 2026-11-06, P09): rzeczowy, czytelny, ciepły, skupiony, warsztatowy.
- Antycharakter (potwierdzony 2026-11-06, P10): generyczny, efekciarski, hałaśliwy, chłodny, chaotyczny.
- Materiał: karty R01, R02, A01; brief `.ai/specs/product-brief.md`; wywiady w `.ai/specs/research/` (dwa nadpisane wywiady czytane z oryginałów w `devmentor-synthetic-input/.ai/specs/research/`).
- Zrzuty: brak (zapowiedziane 2026-11-06, jeszcze niedostarczone). Linki: brak (karty podają nazwy produktów, nie adresy), nic nie zostało otwarte. Każda obserwacja jest parafrazą opisu z karty; to, czego opis nie rozstrzyga, jest oznaczone „nie wiadomo”.
- Stan obecny w kodzie: `packages/ui/src/styles/globals.css` to domyślny motyw shadcn „neutral”, wszystkie kolory bez nasycenia (`oklch(… 0 0)`), czyli dokładnie „wszystko szare” z R01.

Nic w tym pliku nie jest jeszcze regułą. Zasady i tokeny powstają w następnym kroku, z tego pliku, i każda z nich jest zatwierdzana osobno.

## Referencje

| # | Referencja | Źródło | Kto wybrał | Obserwacja | Bierzemy | Nie bierzemy | Robimy zamiast tego | Dlaczego pasuje do produktu | Rodzina | Waga | Status (propozycja / przyjęte) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R01.1 | GitHub: lista PR i strona repozytorium | karta R01, bez zrzutu | Oliwia | Wiele wierszy na jednym ekranie, jeden wiersz = jeden obiekt; mimo gęstości tekst się czyta. Nie wiadomo: wysokość wiersza, liczba wierszy na ekranie, co zawiera wiersz. | Gęste listy, wiersz na obiekt. | — | Gęstość tylko na ekranach list (lista mentorów, lista sesji, ekrany operatora); sesja i notatka czytane spokojniej (R02.1). | Developer przegląda listę mentorów filtrowaną po stacku (R13) i swoje sesje tak jak listę PR; operator przegląda zaproszenia, wypłaty i spory. | kompozycja i gęstość | musi być | przyjęte (karta); zakres „tylko listy” przyjęty w K1 |
| R01.2 | GitHub | karta R01, bez zrzutu | Oliwia | Kod i nazwy plików w innym foncie niż reszta tekstu (słowa z karty). Ten inny font to krój o stałej szerokości (monospace), potwierdzone 2026-11-06. Nie wiadomo: jakie kroje i rozmiary. | Osobny font dla kodu i nazw plików. Także inne identyfikatory (np. nazwy gałęzi, wersje), przyjęte 2026-11-06. | — | — | Sesja jest tekstowa i ludzie wklejają kod („wkleję yamla”, wywiad fintech); odpowiedź trafia do runbooka, więc kod musi być rozpoznawalny i kopiowalny. | typografia | musi być | osobny font dla kodu i nazw plików: przyjęte (karta); monospace i identyfikatory: przyjęte 2026-11-06 |
| R01.3 | GitHub | karta R01, bez zrzutu | Oliwia | Wiersze rozdziela cienka pozioma linia, a nie karty, cienie ani duże odstępy. Nie wiadomo: grubość i kontrast linii. | Cienkie linie między wierszami zamiast kart. | — | — | Linia porządkuje gęstą listę bez dokładania tła i cieni; utrzymuje gęstość z R01.1. | komponenty | musi być | przyjęte (karta) |
| R01.4 | GitHub | karta R01 („wszystko szare, mało ciepła”) | Oliwia | Interfejs w całości w szarościach bez odcienia. | — | Szarości bez odcienia (także obecny motyw shadcn „neutral”). | Ciepłe szarości tła, linii i tekstu: lekki odcień w stronę żółci lub brązu (P01). Kolor akcentu (kolor wyróżnionego elementu z R01.5) też ciepły (2026-11-06); jaki konkretnie, nie wiadomo: brak referencji koloru. | Uzasadnienie produktowe nie wynika z badań; to preferencja z karty. Pośrednio: produkt łączy ludzi z nazwanym człowiekiem, nie z narzędziem. | kolor | musi być | odrzucenie szarości: przyjęte (karta); ciepłe szarości: przyjęte (P01, 2026-11-06); ciepły akcent: przyjęte 2026-11-06, wartość otwarta |
| R01.5 | GitHub | karta R01 („trudno się zorientować, co jest najważniejsze”) | Oliwia | Wszystkie elementy ekranu mają podobną wagę wizualną; nic nie prowadzi wzroku. | — | Równa waga wszystkich elementów. | Jeden wyróżniony element na ekran, kolorem albo wagą fontu, nie jednym i drugim naraz (P02). Wyróżnionym elementem jest **termin** (decyzja 2026-11-06). Odczytanie na ekranach: lista mentorów: najbliższy opublikowany slot; lista sesji: data i godzina sesji; ekran trwającej sesji: czas do końca sesji. | Mentee przychodzi z jednym problemem i jedną decyzją (wybrać mentora, zarezerwować, odpisać); gęstość z R01.1 bez hierarchii utrudniłaby tę decyzję. Termin jako pierwszy element zgadza się z R13 (lista ułożona według najnowszej opublikowanej dostępności) i z tym, że sesja trwa 25 lub 50 minut. Granica z R14: termin pokazujemy jako fakt (dzień, godzina), bez sformułowań o szybkości („już za…”, „dostępny teraz”). | kompozycja i gęstość | musi być | przyjęte (K3); element „termin” przyjęty 2026-11-06; odczytanie na wszystkich trzech ekranach przyjęte 2026-11-06 |
| R01.6 | GitHub | propozycja agenta | agent | Nie wiadomo bez zrzutu, co z ekranu GitHuba realnie występuje; propozycja dotyczy elementów typowych dla tych widoków. | — | Liczniki na zakładkach, rzędy ikon statusu, wiele akcji w nagłówku (P03). | Jedna główna akcja na ekran (wynika z R01.5). | Mentee nie zarządza repozytorium, tylko jedną sesją; liczniki i statusy to szum dla tego zadania. | komponenty | — | przyjęte (P03, 2026-11-06) |
| R02.1 | Slack: widok kanału z wątkiem | karta R02, bez zrzutu | Oliwia | Rozmowa zajmuje środek i większość szerokości ekranu; pozostałe elementy są na marginesie. | Rozmowa w centrum ekranu sesji. | — | Ekran sesji i notatka: ograniczona szerokość tekstu i większy odstęp niż na listach (K1). | Tekstowa sesja wewnątrz DevMentor (R20) to rdzeń produktu; ekran sesji musi być o rozmowie. | kompozycja i gęstość | warto | przyjęte (karta); ograniczona szerokość przyjęta w K1 |
| R02.2 | Slack | karta R02, bez zrzutu | Oliwia | Szybko się pisze i odpisuje (słowa z karty). Pole pisania stale widoczne pod rozmową (potwierdzone 2026-11-06), wysłanie bez dodatkowych kroków. Nie wiadomo: jak wkleja się kod. | Stałe pole pisania, wysyłanie bez dodatkowych kroków; Enter wysyła wiadomość (2026-11-06). Nowa linia: Shift+Enter (2026-11-06). | — | — | Sesja trwa 25 lub 50 minut (R01 briefu); każda sekunda na obsługę interfejsu jest odejmowana od odpowiedzi. | komponenty | warto | szybkie pisanie i odpisywanie: przyjęte (karta); stałe pole pisania: przyjęte 2026-11-06; Enter wysyła, Shift+Enter nowa linia: przyjęte 2026-11-06 |
| R02.3 | Slack | karta R02, bez zrzutu | Oliwia | Przy każdej wiadomości widać autora i godzinę. Nie wiadomo: czy z awatarem, jak grupowane są kolejne wiadomości jednej osoby. | Autor i godzina przy każdej wiadomości. | — | — | W sesji są dwie strony i czas ograniczony; notatkę współedytują obie (R26), a operator rozstrzyga spory i niestawienia (R30), więc „kto i kiedy” musi być czytelne. | komponenty | warto | przyjęte (karta) |
| R02.4 | Slack | karta R02 („za dużo powiadomień”) | Oliwia | Liczne powiadomienia i liczniki nieprzeczytanych. | — | Powiadomienia o wszystkim, liczniki nieprzeczytanych. | Powiadomienia tylko o zdarzeniach sesji: rezerwacja, start, notatka do akceptacji (P05). | Produkt nie jest komunikatorem; użytkownik wraca do niego przy konkretnej sesji. | ruch i reakcja | warto | odrzucenie: przyjęte (karta); zamiennik: przyjęte (P05, 2026-11-06) |
| R02.5 | Slack | karta R02 („emoji wszędzie”) | Oliwia | Emoji w wiadomościach i jako reakcje pod wiadomościami. | — | Reakcje emoji, wybierak emoji w sesji. | Ciepło z koloru (R01.4) i tonu wypowiedzi, nie z emoji (P06). | Sesja to płatna, ograniczona w czasie konsultacja techniczna, nie czat towarzyski. | komponenty | warto | odrzucenie: przyjęte (karta); zamiennik: przyjęte (P06, 2026-11-06) |
| R02.6 | Slack | karta R02 („bałagan w bocznym pasku”) | Oliwia | Boczny pasek z wieloma kanałami, sekcjami i oznaczeniami. | — | Boczny pasek z listą kanałów i rozmów. | Na ekranie sesji tylko informacje o tej sesji: pytanie, druga osoba, pozostały czas, przypomnienie, że sesja jest tekstowa (R03 briefu) (P07). | Jedna sesja = jedna rozmowa; R03 wymaga informacji o tekstowym charakterze na każdym ekranie sesji. | kompozycja i gęstość | warto | odrzucenie: przyjęte (karta); zamiennik: przyjęte (P07, 2026-11-06) |
| R02.7 | Slack | propozycja agenta, rozstrzygnięta w K2 | agent; decyzja: Oliwia | Sygnały obecności typowe dla komunikatora (kropka „online”, „dostępny teraz”). Bez zrzutu nie wiadomo, czy są na wybranym widoku. | — | Kropka „online”, „dostępny teraz” i inne sygnały dostępności poza sesją. | Szybkość dotyczy tylko pisania wewnątrz trwającej sesji. | R14: slot co najmniej dwie godziny naprzód i żadnej obietnicy szybkości w 1.0. | ruch i reakcja | — | przyjęte (K2) |
| R02.8 | Slack | karta R02 („widok kanału z wątkiem”); P08; K4 | Oliwia | Wątek odchodzący od wiadomości w kanale. Nie wiadomo bez zrzutu: czy chodzi o odpowiedź na konkretną wiadomość, czy o osobny panel wątku. | — | Wątki: ani osobny panel wątku, ani wątki w wątkach, ani cytowanie z odgałęzieniem (K4). | Jedna liniowa rozmowa na sesję (K4). | Sesja to jedna rozmowa o jednym pytaniu. | komponenty | warto | przyjęte (P08, K4, 2026-11-06) |

## Antyreferencje

| # | Wygląd | Dlaczego nie | Podpis do uniknięcia | Źródło (gust / badania / propozycja) |
|---|---|---|---|---|
| A01 | Typowa strona startupu AI, połączona z „generycznym wyglądem AI” | „Wygląda jak wszystko inne” (karta A01). | Fioletowy gradient, szklane karty, iskierki (karta). Dodatkowo (P11, przyjęte 2026-11-06): tekst z gradientem (`bg-clip-text text-transparent`, `from-purple-* to-indigo-*`); `backdrop-blur` na półprzezroczystych kartach z jasną obwódką; ikona `Sparkles` (lucide) lub ✨ przy funkcjach; wycentrowany hero z dużym nagłówkiem, przyciskiem „Get started” i rzędem logo „trusted by”; siatka trzech kart z ikonami; poświata (glow) za elementami; `rounded-2xl` na wszystkim; nietknięty domyślny motyw shadcn. | gust (karta); rozszerzenie podpisu: przyjęte (P11, 2026-11-06) |
| A02 | Kurs i ścieżka nauki | „I don't want a course, I want an answer” (working dev); „nie szukam mentora tylko kogoś, kto sprawdzi jedną rzecz”, „mentorship journey lol” (freelancer); „ścieżka nauki… chcę żeby ingress wstał” (fintech). | Paski postępu, „mentorship journey”, odznaki, certyfikaty, moduły lub lekcje, procent ukończenia. | badania; przyjęte (P12, 2026-11-06) |
| A03 | Marketplace gwiazdek | „każdy ma pięć gwiazdek” (fintech), „każdy ma 4.9” (freelancer), „nie róbcie ocen. serio” (Python), „byłam oceniana” (staff); N02 i R04 briefu. | Gwiazdki, średnia ocen („4.9”), liczba opinii, plakietki „Top mentor”, kolejność według wyniku. | badania; przyjęte (P13, 2026-11-06) |
| A04 | Subskrypcja i community | „subskrypcja. community.” (fintech); „jak to subskrypcja, to nie otworzę drugi raz” (platform dev); „community” (freelancer). | Tabela planów cenowych, „Dołącz do społeczności”, feed aktywności, licznik członków. | badania; przyjęte (P14, 2026-11-06) |
| A05 | Wideorozmowa | N01 i R03 briefu; Codementor: „chciał calla i mi mikrofon nie działał” (fintech); „text is fine, faster” (working dev). | Ikony kamery i mikrofonu, przycisk „Dołącz do rozmowy”, siatka kafelków wideo. | badania; przyjęte (P15, 2026-11-06) |
| A06 | Sprzedażowy ton | „to jest coś sprzedażowego?” (Python); „chcę znać cenę zanim cokolwiek napiszę” (freelancer); R14 zakazuje obietnicy szybkości. | Cena ukryta lub „od X zł”, wykrzykniki, „3 osoby oglądają”, odliczanie, „odpowiedź w 5 minut”. | badania; przyjęte (P16, 2026-11-06) |

## Konflikty i rozstrzygnięcia

| Konflikt | Referencje | Rozstrzygnięcie | Kto zdecydował |
|---|---|---|---|
| K1: gęsta lista kontra wygodne czytanie rozmowy | R01.1, R02.1 | Gęstość zależy od typu ekranu: listy gęsto jak w R01, sesja i notatka z ograniczoną szerokością tekstu i większym odstępem. | Oliwia, 2026-11-06 |
| K2: szybkie pisanie i odpisywanie kontra brak obietnicy szybkości (R14 briefu) | R02.2, R02.7, brief R14 | Szybkość dotyczy tylko pisania wewnątrz trwającej sesji; bez sygnałów dostępności poza nią. | Oliwia, 2026-11-06 |
| K3: dużo informacji kontra jasność, co najważniejsze | R01.1, R01.5 | Jeden wyróżniony element na ekran, kolorem albo wagą fontu, nie jednym i drugim naraz. | Oliwia, 2026-11-06 |
| K4: wątek z R02 kontra „jedna liniowa rozmowa, bez wątków w wątkach” (P08) | R02.8, P08 | Jedna liniowa rozmowa na sesję; wątku z R02 nie przenosimy. Propozycja cytowania wiadomości odrzucona. | Oliwia, 2026-11-06 |

## Luki

Rodziny bez referencji:
- **Kolor:** żadna referencja nie mówi, jaki kolor *jest* nasz, tylko jaki nie jest (szary bez odcienia, fioletowy gradient). Przyjęte: ciepłe szarości (P01) i ciepły akcent (2026-11-06). Brak referencji dla konkretnego koloru akcentu; referencja zapowiedziana.
- **Tryb ciemny:** przyjęty 2026-11-06. Brak referencji, jak ma wyglądać; ciepłe szarości (P01) muszą mieć ciemny odpowiednik.
- **Typografia:** poza krojem monospace dla kodu (R01.2) brak referencji dla kroju podstawowego, rozmiarów i interlinii; referencja zapowiedziana 2026-11-06.
- **Ruch i reakcja:** brak referencji (zapowiedziana 2026-11-06). Przyjęte bez referencji (P18, 2026-11-06): ruch tylko jako potwierdzenie stanu (wysłano, zapisano), bez animacji ozdobnych.
- **Ton wypowiedzi:** brak referencji (zapowiedziana 2026-11-06). Przyjęte bez referencji, z badań (P17, 2026-11-06): krótkie zdania, cena i zasady (brak zwrotów, R27) podane przed płatnością, bez obietnic szybkości, po polsku.

Pytania bez odpowiedzi:
1. Zrzuty R01 i R02 oraz referencje koloru akcentu, typografii, ruchu, tonu i trybu ciemnego: zapowiedziane, jeszcze niedostarczone.

Propozycje: wszystkie P01–P18 przyjęte 2026-11-06 (P02 przez K3, P04 przez K1, część P08 przez K2, P05–P18 odpowiedzią „tak na wszystko”).

## Obrazy

Brak plików. Oczekiwane, po dostarczeniu zrzutów:
- `R01-lista-pr.png`
- `R01-repo.png`
- `R02-kanal-watek.png`
- `A01-strona-startupu-ai.png` (opcjonalnie)
