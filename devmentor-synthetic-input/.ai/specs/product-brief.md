# DevMentor: wybór sesji z mentorem

- Date: 2026-09-24
- Mode: own
- Refreshed: 2026-10-25
- Status: po panelu; materiał do przygotowania badań.
- Owner aktualizacji: użytkownik prowadzący sesję; zakres i ścieżka zatwierdzone w rozmowie 2026-10-25.
- Evidence basis: trzy dostarczone notatki (dwie dla person, jedna hold-out), sześć dokumentów decyzji i jedna sesja syntetyczna; niezależność rozmów i ich autentyczność niepotwierdzone. Kopie i cytaty nie zwiększają liczby źródeł.
- Coverage: 30 claims — 22 sourced (interview 7, data 0, document 15, product 0, benchmark 0), 0 synthetic, 8 assumed
- Synthetic hypotheses outside Coverage: 3 (sekcja Hypotheses wyłączona z licznika Coverage).
- Zakres: wycinek opisu produktu przygotowany na podstawie dołączonych materiałów. Nie zastępuje pełnego briefu ani aktualnego stanu aplikacji.
- Pochodzenie: [SOURCES.md](research/SOURCES.md). Notatki i decyzje są materiałami dostarczonymi. Nie potwierdzono niezależnie opisanych rozmów.

## Decision summary

Aktualizacja zatwierdzona przez użytkownika obejmuje H01–H03 i Q01: kompetencje mentora, płatnika, nakład przekazania kontekstu i wystarczalność tekstu. Dotyczy wyłącznie tego briefu demonstracyjnego. Zachowuje istniejący flow, R01–R05, A02/A04 i decyzję N01; nie przyznaje gotowości do implementacji.

Now: zapis obserwacji Seen once i przygotowanie trzech tematów do rozmów z Collection plan (bez ustalonej liczby uczestników). Later: decyzja o zmianach produktu po zebraniu materiałów. Non-goals pozostają poniżej. Najważniejsze braki to rzeczywiste decyzje zakupowe i przebieg konsultacji; właściciel i termin zebrania materiałów pozostają nieustaleni.

## Product

DevMentor pozwala deweloperowi znaleźć mentora i wybrać termin konsultacji. Mentor publikuje ofertę i dostępne terminy. Użytkownik może przejść z listy mentorów albo przez link do konkretnego profilu. `[DOCUMENT]` [D21](research/decisions/D21-finding-a-mentor.md)

Sesja trwa 25 albo 50 minut. Mentor ustala ceny obu długości w granicach operatora. W tym wycinku nie wskazujemy konkretnej oferty cenowej. `[DOCUMENT]` [D09](research/decisions/D09-pricing.md)

Można wybrać opublikowany termin rozpoczynający się co najmniej dwie godziny po rezerwacji. Nie oznacza to gwarancji wolnego terminu dokładnie za dwie godziny. `[DOCUMENT]` [D22](research/decisions/D22-session-timing.md)

Konsultacja ma formę tekstową i odbywa się w ekranie sesji wewnątrz DevMentora. `[DOCUMENT]` [N01](research/decisions/N01-no-video.md), [D27](research/decisions/D27-session-channel.md)

## Target group

- Deweloper z pilnym problemem przy wydaniu produktu, bez dostępnej pomocy seniora. Podstawą tej perspektywy jest jedna dostarczona notatka. `[INTERVIEW]` [working-dev](research/2026-08-20-interview-working-dev.md)
- Deweloper z niepilnym problemem konfiguracji, dla którego samodzielne rozwiązanie i pomoc wewnątrz zespołu pozostają alternatywą. Podstawą tej perspektywy jest osobna dostarczona notatka. `[INTERVIEW]` [platform-dev](research/2026-09-02-interview-platform-dev-solves-alone.md)

Nie znamy udziałów tych sytuacji w populacji ani częstości korzystania z płatnej pomocy. Dobór panelu demonstracyjnego nie jest próbą reprezentatywną. `[ASSUMPTION]` Brak danych o proporcjach.

## Problems

W notatce working-dev błąd TypeScript pojawia się przed wydaniem produktu, a senior jest nieobecny. Po 40 minutach szukania i dwóch sprzecznych odpowiedziach na Discordzie opisano obejście problemu z TODO. Notatka zawiera potrzebę pomocy „within the hour”; znaczenie tego czasu wymaga doprecyzowania. `[INTERVIEW]` [working-dev](research/2026-08-20-interview-working-dev.md)

W notatce platform-dev opisano problem z konfiguracją reguł linta i samodzielne dojście do rozwiązania. Materiał wskazuje małą pilność tego epizodu. Warunkowe odpowiedzi o innym, trudniejszym problemie nie są obserwacją zakupu. `[INTERVIEW]` [platform-dev](research/2026-09-02-interview-platform-dev-solves-alone.md)

W materiale platform-dev kryterium kompetencji jest deklarowane: wykonane prace lub rekomendacja znajomego. Nie opisano rzeczywistego wyboru mentora według tych kryteriów. `[INTERVIEW]` [platform-dev](research/2026-09-02-interview-platform-dev-solves-alone.md)

Platform-dev deklaruje odmowę prywatnego finansowania pracy, natomiast rozmówca hold-out waha się między firmą a osobistym wydatkiem. Nie ustalono faktycznego płatnika ani procesu zgody dla tych hipotetycznych zakupów. `[INTERVIEW]` [platform-dev](research/2026-09-02-interview-platform-dev-solves-alone.md), [hold-out](research/holdout/2026-09-01-interview-backend-dev-fintech.md)

## Goals

Cel demonstracyjnej analizy: poznać możliwe bariery podczas oceny oferty i wyboru sesji. `[ASSUMPTION]` Zakres ćwiczenia, bez zadanej z góry odpowiedzi.

Wynik analizy ma pomóc przygotować pytania do sprawdzenia z ludźmi. Nie określa prognozy sprzedaży ani poziomu popytu. `[ASSUMPTION]` Sposób wykorzystania wyniku ćwiczenia.

## Key flows

### Future state, booking and session (1.0), decided steps

1. Użytkownik loguje się przez GitHub lub używa e-maila i hasła. `[DOCUMENT]` [D07](research/decisions/D07-login.md)
2. Znajduje mentora na liście z filtrem po technologii albo otwiera link do jego profilu. Lista jest uporządkowana według ostatnio opublikowanej dostępności. `[DOCUMENT]` [D21](research/decisions/D21-finding-a-mentor.md)
3. Ocenia ofertę, wybiera długość 25 albo 50 minut i odczytuje cenę ustaloną przez mentora. Konkretna cena nie jest podana w tym materiale. `[DOCUMENT]` [D09](research/decisions/D09-pricing.md)
4. Wybiera spośród opublikowanych terminów. Wybrany start musi przypadać co najmniej dwie godziny po rezerwacji. Dokładny dostępny termin wymaga danych konkretnej oferty. `[DOCUMENT]` [D22](research/decisions/D22-session-timing.md)
5. W umówionym terminie bierze udział w tekstowej konsultacji wewnątrz DevMentora. `[DOCUMENT]` [N01](research/decisions/N01-no-video.md), [D27](research/decisions/D27-session-channel.md)

To narracyjny wycinek wyboru konsultacji. Nie opisuje wyglądu ekranów, obsługi płatności ani rozliczeń po sesji. Pominięcie tych elementów w ćwiczeniu nie oznacza, że produkt ich nie ma. `[ASSUMPTION]` Granice demonstracji.

## Business rules

| ID | Reguła | Źródło |
|---|---|---|
| R01 | Długość konsultacji wynosi 25 albo 50 minut. | `[DOCUMENT]` [D09](research/decisions/D09-pricing.md) |
| R02 | Mentor ustala cenę w granicach operatora. Tu nie ma konkretnego cennika oferty. | `[DOCUMENT]` [D09](research/decisions/D09-pricing.md) |
| R03 | Najwcześniejszy dopuszczalny początek to dwie godziny po rezerwacji; dostępność zależy od opublikowanych slotów. | `[DOCUMENT]` [D22](research/decisions/D22-session-timing.md) |
| R04 | Sesja jest tekstowa i odbywa się w produkcie. | `[DOCUMENT]` [N01](research/decisions/N01-no-video.md), [D27](research/decisions/D27-session-channel.md) |
| R05 | Logowanie: GitHub albo e-mail i hasło. | `[DOCUMENT]` [D07](research/decisions/D07-login.md) |

## Scope

W ćwiczeniu analizujemy perspektywę osoby wybierającej konsultację. Korzystamy z opisu, bez przeglądarki i bez transakcji. Nie podajemy modelowi stanu ekranu, którego nie zaobserwowano. `[ASSUMPTION]` Zakres demonstracji.

## Non-goals

Poza tym wycinkiem są onboarding mentorów, wybór nowych cen, płatności, anulowanie, wypłaty i notatka po konsultacji. Analiza nie sprawdza działania interfejsu ani kodu. `[ASSUMPTION]` Zakres demonstracji.

## Domain glossary

- Mentee: osoba rozważająca konsultację z mentorem.
- Mentor: osoba publikująca ofertę konsultacji i terminy.
- Długość sesji: czas trwania konsultacji.
- Termin: opublikowany moment rozpoczęcia konsultacji.
- Rezerwacja: wybór konkretnego terminu i długości w opisanym procesie.

Definicje porządkują opis ćwiczenia. `[DOCUMENT]` D07, D09, D21, D22 i D27.

## Riskiest assumptions

- A02: oferta płatnej konsultacji pasuje do problemu, z którym przychodzi deweloper. `[ASSUMPTION]` Wymaga obserwacji odpowiednich do decyzji o zakupie.
- A04: dostępny termin pozwala uzyskać pomoc, gdy jest jeszcze użyteczna. `[ASSUMPTION]` Sama decyzja o wyprzedzeniu rezerwacji nie potwierdza dopasowania do sytuacji.

Te założenia określają obszar pytań koordynatora. Nie są opisem cech persony i nie powinny trafiać do jej kontekstu.

## Hypotheses

Źródło: [sesja 001 — raport](research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/report.md) i jej niezmienny [snapshot person](research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/personas.md). Jeden przebieg, dwie persony, stance adversary; brak replikacji i saturacji. P02 odłożyłby proces w kroku 1, więc jego kroki 2–5 są kontrfaktyczne; P01 wstrzymałby wybór w kroku 2. Wszystkie trzy pozycje mają status Seen once; nie są ustaleniami o zachowaniu ludzi.

- H01 — zgodność technologii może nie wystarczyć do wyboru mentora; potrzebny może być przekonujący dowód kompetencji do konkretnego zadania; wcześniejsza podobna praca jest kandydatem do sprawdzenia, nie ustalonym wymaganiem. `[SYNTHETIC]` S01, P01/P02, krok 2; A02. Fragment AI: „Zgodność technologii jeszcze nie mówi, czy ta osoba rozwiąże mój problem” ([P02](research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/transcripts/run-1-P02.md)). Scenariusz: konkretny problem, nieznana zawartość profilu; nie stwierdzono braku informacji w produkcie. Sprawdzenie: C01.
- H02 — dopasowana konsultacja może nie prowadzić do zakupu, gdy deweloper nie chce płacić prywatnie, a finansowanie przez firmę jest nieustalone. `[SYNTHETIC]` S04, P02, Q3/krok 3; A02. Fragment AI: „Nie znam rzeczywistego procesu zatwierdzania takiego wydatku” ([P02](research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/transcripts/run-1-P02.md)). Scenariusz: praca służbowa, nieznana cena i zgoda; symulacja miesza te okoliczności, więc nie wskazuje przyczyny odmowy. Sprawdzenie: C02.
- H03 — przy niepilnym problemie nakład odtworzenia kontekstu dla mentora może skłaniać do dalszej samodzielnej diagnozy. `[SYNTHETIC]` S05, P02, krok 5; A02. Fragment AI: „Musiałbym odtworzyć kontekst dla nowej osoby” ([P02](research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/transcripts/run-1-P02.md)). Scenariusz: nowy rozmówca, rozpoczęta diagnoza, nieznany sposób przekazania materiałów. Krok był kontrfaktyczny po wcześniejszej rezygnacji; źródła nie wykazują tej przyczyny rezygnacji. Sprawdzenie: C03.

## Open questions

Znaczenie czasu opisanego w notatce, rzeczywista dostępność konkretnego mentora, cena konkretnej oferty oraz sposób podjęcia decyzji wymagają odpowiednich danych. Nie uzupełniamy ich fikcyjnymi wartościami.
- Q01 — kiedy tekst nie wystarcza do diagnozy? W hold-out pada „tekst. wkleję yamla. call jak tekst nie zadziała”. To warunkowa deklaracja, nie opis zaobserwowanej porażki tekstu. `[INTERVIEW]` [hold-out](research/holdout/2026-09-01-interview-backend-dev-fintech.md)
  Status: open. Może odpowiedzieć deweloper po zdalnej konsultacji (C03). Blokuje uznanie potrzeby zmiany N01 za popartą materiałem; nie blokuje przygotowania rozmów. Nie dodajemy rekomendacji głosu ani wideo.

## Collection plan

Poniższe C01–C03 są lokalnymi identyfikatorami briefu, niezależnymi od numeracji w raporcie panelu. Właściciel zebrania materiałów i termin: nieustaleni. Wspólny [szablon rozmowy](research/templates/interview-note.md). Nie ustalono liczebności próby; nie wykonano tych rozmów.

| ID | Materiał / pytanie o rzeczywisty epizod | Kto może odpowiedzieć | Co rozstrzyga i blokuje |
|---|---|---|---|
| C01 | „Jak ostatnio sprawdzałeś kompetencje osoby, której powierzyłeś problem? Co przesądziło o wyborze?” Odtworzyć użyte informacje. | Deweloper wybierający eksperta do konkretnego incydentu. | H01: czy i jakie dowody są potrzebne; brak blokuje uznanie wymagania dotyczącego profilu za poparte zachowaniem. |
| C02 | „Przy ostatniej próbie zakupu pomocy do pracy kto miał zapłacić, kto decydował i jak próba się zakończyła?” | Deweloper po zakupie lub zaniechanej próbie zakupu pomocy służbowej. | H02: faktyczny płatnik i przeszkody; brak blokuje wybór ścieżki zakupowej na podstawie deklaracji panelu. |
| C03 | „Co przygotowałeś przy ostatniej diagnozie z kimś spoza zespołu? Czy zmieniliście kanał i co do tego doprowadziło?” Odtworzyć przekazanie kontekstu na bezpiecznym przykładzie. | Deweloper po zdalnej konsultacji technicznej. | H03 i Q01: nakład przygotowania oraz przypadki niewystarczającego tekstu; brak blokuje wnioskowanie o potrzebie zmian sesji lub N01. |

## Definition of Ready addendum (own)

Gotowość: przygotowanie badań. Notatki opisują pojedyncze sytuacje, nie ustalają częstości ani popytu. H01–H03 pozostają nietestowane; Q01 otwarte. Zgoda na zapis hipotez nie oznacza akceptacji ich jako faktów ani zgody na zmianę produktu. Nie podpisano gotowości do implementacji wynikającej z tej aktualizacji.

## Kill criteria

Odroczone: ta aktualizacja porządkuje pytania, nie uruchamia eksperymentu ani wdrożenia. Kryteria zmiany kierunku, właściciela decyzji i termin przeglądu trzeba ustalić przed takim działaniem.
