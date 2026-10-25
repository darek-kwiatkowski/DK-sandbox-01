# Walkthrough: Future state, booking and session (1.0), decided steps
Date: 2026-10-25

[SYNTHETIC]

Jeden przebieg nie daje ustaleń powtarzalnych. Poniższe obserwacje służą przygotowaniu rozmów z ludźmi; nie spełniają Definition of Ready. W pierwszej kolejności warto sprawdzić rzeczywisty moment, po którym pomoc przestaje być użyteczna, oraz dowody kompetencji potrzebne przy wyborze eksperta.

Stance: adversary.
Panel: 1 run × 2 personas; P01 i P02, osobne świeże konteksty.
Subject: devmentor-synthetic-input/.ai/specs/product-brief.md
Flow: Future state, booking and session (1.0), decided steps — dokładne dopasowanie nagłówka.
Session: devmentor-synthetic-input/.ai/specs/research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001
Panel snapshot: [personas.md](personas.md); aktualny indeks: [../../personas.md](../../personas.md).
Composition: assumed, 1:1 między dwoma segmentami, bez danych o proporcjach. P02 ma niską istotność potrzeby na podstawie osobnej notatki.
Saturation: not reached — tylko dwa wywiady; brak pełnego okna trzech wywiadów/ostatnich dwudziestu tematów.
Parity: 8 of 13 szerokich tematów odłożonej notatki; znaczenie i szczegółowość części wspólnych tematów różnią się. To porównanie tekstów dostarczonych materiałów, nie wynik walidacji ani estymacja populacyjna.
Elapsed: około 1 min przygotowanie profili; około 3 min łącznie wywiady i spacery, uruchomione równolegle, bez osobnego pomiaru tych faz; około 5 min porównanie, konsolidacja i kontrola artefaktów. Przybliżenia czasu pracy, nie dane person.
Not askable: A02 i A04 mieszczą się w zakresie segmentów, lecz brak własnej historii nowej persony uniemożliwia odpowiedzi autobiograficzne; faktyczny zakup, budżet, terminy i znaczenie deklarowanych czasów wymagają rozmowy z człowiekiem.

## Podstawa i rozdział źródeł

Wszystkie poniższe ścieżki źródłowe są względem research:
- [INTERVIEW] [W: working-dev](../../2026-08-20-interview-working-dev.md) — wyłącznie P01.
- [INTERVIEW] [L: platform-dev](../../2026-09-02-interview-platform-dev-solves-alone.md) — wyłącznie P02.
- [DOCUMENT] [SOURCES](../../SOURCES.md) — pochodzenie: dostarczone kopie, bez niezależnego potwierdzenia rozmów.
- [DOCUMENT] [D07](../../decisions/D07-login.md), [D09](../../decisions/D09-pricing.md), [D21](../../decisions/D21-finding-a-mentor.md), [D22](../../decisions/D22-session-timing.md), [D27](../../decisions/D27-session-channel.md), [N01](../../decisions/N01-no-video.md) — reguły produktu, nie zachowania.
- Hold-out: [H: backend-dev-fintech](../../holdout/2026-09-01-interview-backend-dev-fintech.md), otwarty dopiero po otrzymaniu obu kompletnych odpowiedzi person. Nie przekazano go personom, także przy zapisywaniu transkryptów.
- Inwentarz research przed sesją: W, L, H, sześć dokumentów decyzji i SOURCES; brak ekstraktów danych i wcześniejszych person w tym katalogu. Nie czytano projektowego briefu ani jego badań.
- Konfiguracja projektu wskazuje .ai/specs; brak lokalnego override skilla. Brak użycia trackera i przeglądarki: zadanie narracyjne opiera się na przekazanym zestawie.

Persony otrzymały role bez tagów i kluczy źródeł, neutralny wycinek produktu oraz fragmenty przypisane do pytań. Nie otrzymały A02/A04, hipotez, oczekiwanych odpowiedzi ani reakcji drugiej persony. Pytania Q6 i Q7 zostały przez koordynatora przypisane odpowiednio do A02 i A04 dopiero w konsolidacji. Brak dostępu person do plików podczas generowania; późniejszy dostęp służył wyłącznie zapisaniu ich własnych transkryptów.

## Zakres i ograniczenia

To spacer po pięciu krokach opisu, bez ekranów, kont, transakcji i testowania aplikacji. P01 warunkowo zatrzymałby wybór w kroku 2; P02 odłożyłby proces w kroku 1. Dalsze kroki są jawnie kontrfaktyczne. Nie badano płatności, anulowania, onboardingu mentorów ani notatek po sesji. Brak tych opisów nie stanowi braku funkcjonalności produktu.

Cena jest nieznana w materiale, a nie ukryta przed użytkownikiem produktu: krok 3 mówi, że użytkownik ją odczytuje. Zatrzymanie symulacji z tego powodu jest ograniczeniem ćwiczenia, nie odkrytą wadą UI. Podobnie nie znamy zawartości profili ani rzeczywistych slotów. D22 to minimum dwóch godzin wyprzedzenia, nie gwarancja dostępności dokładnie za dwie godziny. „Within the hour” nie zostało przekształcone w jednoznaczny wymóg startu.

## Ustalenia powtarzalne

Zero. Nie obliczamy wagi, rozrzutu ani rankingu obserwacji z jednego przebiegu. Wystąpienie tematu u obu person nie zastępuje niezależnego drugiego przebiegu. Brak powtarzalnych barier nie oznacza, że flow jest użyteczny lub że istnieje popyt. Nie stwierdzono wewnętrznej sprzeczności obietnic produktu.

## Seen once, not reported as a finding

### S01 — dowód dopasowania do konkretnego problemu
[SYNTHETIC]

P01 i P02, run 1, krok 2: obie persony wstrzymałyby wybór bez podstaw do oceny kompetencji dla konkretnego zadania. P01 szukałby analizy generyków, P02 kompetencji dotyczących konfiguracji. Filtr technologii i świeżość publikacji dostępności nie są takim dowodem. Zawartość profili pozostaje nieznana; nie postulujemy jej braku. Dotyczy A02, D21. Podstawa: P01 Q1/Q6, P02 Q6 i oba kroki 2. Emocje: ostrożność, symulowana. Sprawdzenie z ludźmi: C01.

### S02 — moment użyteczności pomocy pozostaje nierozstrzygnięty
[SYNTHETIC]

P01, run 1, Q7 i krok 4: pilna sytuacja mogłaby kolidować z realnymi slotami, lecz nie znamy ani slotu, ani znaczenia „within the hour”. Dopiero jeśli chodzi o początek w ciągu godziny, reguła D22 wyklucza takie dopasowanie. To warunkowa różnica potrzeby i oferty, nie złamana obietnica. Dotyczy A04, R03/D22. P01 rozważyłby dalsze szukanie; napięcie jest symulowane. Sprawdzenie: C02.

### S03 — mała pilność pozwala pozostać przy samodzielnej pracy
[SYNTHETIC]

P02, run 1, Q1/Q4 i kroki 1/4: przy niepilnym problemie odłożyłby logowanie, kontynuując diagnozę. Nawet poprawny flow nie musi być potrzebny w tej sytuacji. Odłożenie już na wejściu nie dowodzi, że metoda logowania jest wadliwa. Dotyczy A02. Sprawdzenie: C03.

### S04 — płatnik i faktyczna cena są nieustalone
[SYNTHETIC]

P02, run 1, Q3/Q6 i krok 3: deklarowana odmowa osobistego finansowania pracy ograniczałaby rozważanie zakupu. Nie wiadomo, kto zatwierdziłby wydatek ani czy firma może go rozliczyć; nie oceniamy produktu płatności. P01 również nie zna ceny, ale nie przypisujemy mu bariery finansowej bez budżetu. Dotyczy A02, D09. Sprawdzenie: C04.

Audyt presji: krok 3 P02 łączy nieznaną cenę z odmową płacenia prywatnie. To nie jest izolowany eksperyment zmiany jednej zmiennej. Wykluczono z niego twierdzenie o przyczynie odmowy lub o tym, co odwróciłoby decyzję; pozostaje pytanie eksploracyjne.

### S05 — tekst jest akceptowalny, lecz przekazanie kontekstu jest nieopisane
[SYNTHETIC]

P01 i P02, run 1, krok 5: P01 zaakceptowałby tekst, P02 zastanowiłby się nad nakładem opisania konfiguracji. Nie wiemy, jak działa przekazanie kodu. To pytanie do sprawdzenia, nie stwierdzony brak funkcji ani wspólnie powtarzająca się bariera. Dotyczy A02, N01/D27. Sprawdzenie: C05.

## Odmowy i różnice wewnątrz panelu

P01 zatrzymałby wybór przy dowodach dopasowania, mimo istotnej potrzeby pomocy; P02 odmówiłby już rozpoczęcia z powodu niskiej pilności. Nie uśredniamy tych odmiennych sytuacji. Zgoda P01 na tekst nie oznacza zgody na zakup. Nie zaobserwowano odwrócenia decyzji po zmianie pojedynczej presji; każda decyzja była tylko warunkowym rozważeniem przy jednym opisanym kontekście, z ograniczeniem kroku 3 P02 wskazanym powyżej.

## To confirm with real users

Brak hipotez pochodzących z ustaleń powtarzalnych: 0. Poniższe pięć wierszy to plan sprawdzeń obserwacji Seen once, nie pięć ustaleń ani wynik popytu. Liczebności rekrutacji nie ustalono.

| ID | Obserwacja do sprawdzenia | Persona/run | Dotyczy | Kogo zaprosić | Pytanie/zadanie i kryterium rozstrzygnięcia |
|---|---|---|---|---|---|
| C01 | S01: potrzeba dowodu dopasowania | P01/P02, 1 | A02/D21 | Deweloperzy wybierający pomoc do konkretnego incydentu | „Pokaż, jak ostatnio sprawdzałeś kompetencje osoby, którą poprosiłeś o pomoc”. Następnie wybór spośród rzeczywistych profili; ustalić, które informacje wystarczyły, a których brak zatrzymał decyzję. |
| C02 | S02: użyteczny moment pomocy | P01, 1 | A04/D22 | Deweloper po pilnym incydencie przed wydaniem | „Kiedy zacząłeś szukać, kiedy pomoc jeszcze coś zmieniała i co zrobiłeś później?” Zestawić chronologię z rzeczywistymi slotami; rozróżnić początek kontaktu, długość rozmowy i otrzymanie odpowiedzi. |
| C03 | S03: brak powodu do zmiany przy małej pilności | P02, 1 | A02 | Deweloper, który sam rozwiązał niepilny problem | „Co sprawiło, że kontynuowałeś sam, i w którym momencie prosiłeś kogoś o pomoc, jeżeli w ogóle?” Szukać zachowania i kosztu alternatyw, nie deklaracji przyszłego zakupu. |
| C04 | S04: finansowanie i konkretna oferta | P02, 1 | A02/D09 | Osoba z rzeczywistym zakupem lub zaniechanym zakupem pomocy służbowej | „Jak rozliczono ostatnią konsultację albo co zatrzymało wydatek?” Poprosić o zanonimizowaną ścieżkę zgody i rzeczywistą ofertę, bez dopowiadania budżetu. |
| C05 | S05: koszt przekazania kontekstu tekstem | P01/P02, 1 | A02/N01/D27 | Deweloper po zdalnej diagnozie z ekspertem | Odtworzyć na bezpiecznym przykładzie ostatnie przekazanie kodu/konfiguracji: „Co musiałeś przygotować, co było niezrozumiałe i kiedy zmieniliście kanał?” Sprawdzić faktyczny nakład i potrzebę innego kanału. |

## Wywiady, tematy i kontrola zgadzania się

[run-1-P01](transcripts/run-1-P01.md), [run-1-P02](transcripts/run-1-P02.md): po pięć pytań bazowych, dwa pytania o epizod związany z obszarami A02/A04, cztery wspólne pytania tak/nie oraz pięć kroków narracyjnych. Fragmenty są przypisane do odpowiedzi; emocje i wybory oznaczone jako symulacja.

Nowa persona nie ma prawdziwej autobiografii. Obie zwróciły „brak podstaw do własnej historii” zamiast przywłaszczać epizody źródłowych rozmówców. Rozważania po tych odpowiedziach są projekcją sytuacji, nie relacją z przeszłości. Nie wykorzystano ich jako dowodu zachowania.

Acquiescence: 0 odpowiedzi tak, 0 nie, 8 brak podstaw; mianownik odpowiedzi rozstrzygniętych wynosi 0, więc udział „tak” jest nieobliczalny. Nie zastępujemy go kodowaniem notatek. Oddzielny audyt podanych epizodów: P01 2 tak / 1 nie / 1 brak danych; P02 2 tak / 2 nie. Łącznie 4/7 rozstrzygniętych kodów źródłowych, co nie mierzy skłonności person do zgadzania się. Nie dało się zachować zamierzonego balansu 2/2 dla P01 bez zamiany braku danych o zakupie na „nie”. Materiał wymaga uzupełnienia; nie wymuszono odpowiedzi.

Rejestr tematów, normalizowany przed porównaniem hold-out:
- P01: analiza konkretnego kodu; zaufanie do rozwiązania/sprzeczne porady; brak dostępnego seniora; dowód dopasowania; cena i zakres czasu; użyteczny termin; tekst jako kanał; odpowiedź zamiast kursu; alternatywa dalszego szukania; koszt wejścia w proces (krok 1).
- P02: nowe względem P01 — mała pilność/samodzielność; finansowanie służbowe; wewnętrzny kanał jako alternatywa; własne notatki zamiast archiwum; nakład przeniesienia kontekstu. Wspólne — kompetencje, cena, czas, koszt rozpoczęcia.
To 15 tematów w przyjętym słowniku; 5 nowych w drugim wywiadzie. Za mało do okna saturacji. Liczby opisują analizę tekstów, nie ludzi.

## Parity: porównanie z odłożoną notatką

Granice tematów przyjęte jawnie poniżej, bez liczenia kwot jako zachowania. Sentiment oznacza kierunek oceny, nie pomiar emocji człowieka. Hold-out dotyczy innego kontekstu niż niepilny P02; różnica nie jest błędem do ukrycia.

| H | Temat hold-out | Panel | Zgodność i szczegółowość |
|---|---|---|---|
| H01 | Doświadczenie dokładnie w danym zadaniu | P01/P02 krok 2 | Wspólny: potrzeba dowodów; hold-out konkretnie wymienia upgrade ingress i GitHub, panel jest ogólniejszy. |
| H02 | Pomoc dostępna szybko w pilnym incydencie | P01 Q7/krok 4 | Wspólny kierunek, nie wspólny próg: hold-out deklaruje czas kontaktu, panel zachowuje niejednoznaczność „within the hour”. |
| H03 | Nakład szukania i wejścia do procesu | P01/P02 krok 1 | Wspólny szeroki temat; panel hipotetyczny, hold-out opisuje wcześniejsze szukanie eksperta i osobno deklaruje limit bookingu. |
| H04 | Nieskuteczna zewnętrzna porada | P01 Q1/Q2 | Wspólna nieufność, ale błędna odpowiedź w hold-out różni się od sprzecznych odpowiedzi w materiale P01. |
| H05 | Niedostępna pomoc wewnętrzna | P01 Q3 | Wspólny brak dostępnego eksperta; hold-out wskazuje konkretny kontekst poza typową porą pracy. P02 tylko deklaruje alternatywę wewnętrzną. |
| H06 | Tekst do omówienia kodu/konfiguracji | P01 Q5/krok 5 | Wspólna akceptacja; hold-out wskazuje YAML, panel nie testował przekazania kodu. |
| H07 | Własne miejsce zapisu zamiast archiwum platformy | P02 Q5 | Wspólny niski priorytet archiwum; hold-out precyzuje runbook, P02 mówi ogólnie o notatkach. |
| H08 | Rozwiązać bieżący problem zamiast uczyć się ogólnie | P01 Q5 | Wspólny kierunek; hold-out dotyczy uruchomienia ingressu, P01 odpowiedzi na konkretny błąd. |
| H09 | Rollback, zmiana terminu wydania i konsekwencja zespołowa | Brak | Hold-out-only: obejście P01 nie zostało utożsamione z rollbackiem ani przesunięciem wydania. |
| H10 | Awaria mikrofonu i rozmowa jako fallback po tekście | Brak | Hold-out-only: sama akceptacja tekstu nie obejmuje tej potrzeby; istotne przy N01. |
| H11 | Nieufność wobec gwiazdek | Brak | Hold-out-only: ogólne wymaganie kompetencji nie oznacza krytyki ocen. |
| H12 | Wahanie firma/prywatny wydatek | Brak | Hold-out-only: stanowcza deklaracja P02 nie odtwarza ambiwalencji. Nie wykorzystujemy podanych kwot jako budżetu. |
| H13 | Odrzucenie subskrypcji i community | Brak | Hold-out-only w transkryptach; nie zaliczamy samej obecności tej deklaracji w źródle profilu jako wyniku symulacji. |

Osiem szerokich tematów ma odpowiednik, pięć nie. Wspólny temat nie oznacza tej samej decyzji, granicy czasowej ani potwierdzenia modelu biznesowego. Zapis trendu: [calibration.md](../../calibration.md).

### Materiał potrzebny dla tematów tylko z hold-out

| Temat | Rola i pytanie o rzeczywiste zdarzenie | Po co / obszar |
|---|---|---|
| H09 | Osoba odpowiedzialna za incydent i wydanie: „Co nastąpiło po rollbacku i kto zmienił termin?” | Uzupełnić faktyczny koszt alternatywy i użyteczny czas, A02/A04. |
| H10 | Deweloper po nieudanej konsultacji głosowej: „Kiedy tekst przestał wystarczać, co zepsuło połączenie i co zrobiliście?” | Sprawdzić znaczenie braku fallbacku, N01/A02; bez automatycznej rekomendacji dodania wideo. |
| H11 | Osoba wybierająca eksperta: „Które dowody ostatnio sprawdziłeś, a które odrzuciłeś i dlaczego?” | Rozdzielić oceny i dowód konkretnego doświadczenia, D21/A02. |
| H12 | Osoba finansująca pomoc służbową: „Kto ostatecznie zapłacił za ostatni zakup i jak do tego doszło?” | Zebrać rzeczywistą decyzję, A02; deklarowane kwoty nie wystarczą. |
| H13 | Osoba wybierająca doraźną pomoc: „Co odrzuciłeś podczas ostatniego szukania i co wybrałeś zamiast tego?” | Rozdzielić odrzucenie pakietu od braku potrzeby pomocy, A02; brief nie obiecuje subskrypcji/community. |

### Tematy tylko z panelu — pytania, nie ustalenia

- Niska pilność i wystarczalność samodzielnej diagnozy: C03; potrzebny epizod bez presji wydania.
- Stanowcza granica prywatnego finansowania: C04; w hold-out jest wahanie, więc nie przypisujemy jednego modelu obu rolom.
- Dobór długości i ceny konkretnej oferty: „Jakie warianty ostatnio porównywałeś i na podstawie czego wybrałeś?” (kupujący konsultację, A02/D09); panel nie zna ceny, hold-out nie opisuje wyboru wariantu.
- Nakład przeniesienia kontekstu do nowego rozmówcy: C05; chęć wklejenia YAML nie dowodzi, że badano ten nakład.

## Kontrola jakości

Skala 0–2, audyt przed zapisem i po zapisie. Brak zera w krytycznych pozycjach; pozycje częściowe pozostają ograniczeniem, nie ukrytym pełnym zaliczeniem.

| # | Wynik | Uzasadnienie |
|---|---|---|
| 1 | 2 | Linie profili mają źródła lub oznaczenie założenia; źródła istnieją. |
| 2 | 2 | Bez imion, wieku, miasta, biografii i dodanych profili osobowości w artefaktach. |
| 3 | 2 | Dwa segmenty briefu, proporcja założona, P02 ma małą istotność. |
| 4 | 2 | Inne powody odmowy, inne alternatywy i pilność; wspólna potrzeba kompetencji nie stanowi jednolitego panelu. |
| 5 | 2 | Brak zadanych pytań o zamiar zakupu lub deklarowane preferencje; Q6/Q7 pytają o epizod. |
| 6 | 2 | Fragmenty przypisane do pytań; brak przywłaszczenia historii, luki jawne. |
| 7 | 1 | Presje obecne we wszystkich krokach, lecz brak zaobserwowanego odwrócenia decyzji; krok 3 P02 miesza dwie okoliczności i nie służy wnioskowi przyczynowemu. |
| 8 | 2 | Każdy krok ma trzy zauważone elementy i pozostałe pola; wyłącznie narracja. |
| 9 | 2 | Zero single-run findings, tylko Seen once, bez rankingu. |
| 10 | 2 | Każda obserwacja ma tag, persony/run, założenie i realny check. |
| 11 | 2 | Brak estymacji populacji, wymyślonej ceny czy budżetu. |
| 12 | 2 | Warunkowe reakcje, brak języka potwierdzenia popytu. |
| 13 | 2 | Obie persony wyraziły odrębne obiekcje i zatrzymanie; run nie był zgodnym przytaknięciem. |
| 14 | 2 | Sprawdzono nadmierną pozytywność, ten sam nowy tool, równą pilność, idealizm; ograniczenie: obie role to deweloperzy w zespołach, panel nie reprezentuje szerszej populacji. |
| 15 | 2 | Hold-out otwarty po obu odpowiedziach; brak przecieku do person. |
| 16 | 1 | Cztery pytania wspólne zadane, osiem braków podstaw; udział tak nieobliczalny, źródłowe kody nie zastępują pomiaru. Balans P01 częściowy. |
| 17 | 2 | Parity i calibration zapisane; różnice zachowane jako pytania. |
| 18 | 2 | Brief, spec i tracker bez zmian. |

## Artefakty i weryfikacja

Narrative — brak screenshotów, nie uruchamiano przeglądarki ani aplikacji. Zapisano snapshot i aktualne personas.md, dwa transkrypty, report.md oraz calibration.md. Sprawdzono kompletność kroków/pytań, źródła i odnośniki oraz ograniczenia wyżej. Testów CI nie uruchamiano: wyłącznie artefakty badawcze Markdown, bez zmiany kodu. Nie zmieniono istniejących plików poza wskazanym research.

Next: none — subject brief leży poza skonfigurowanym .ai/specs/product-brief.md; om-discover --refresh modyfikowałby inny brief. Obserwacje pozostają przy przekazanym materiale.

Personas: devmentor-synthetic-input/.ai/specs/research/personas.md
Walkthrough: devmentor-synthetic-input/.ai/specs/research/walkthroughs/2026-10-25-future-state-booking-and-session-1-0-decided-steps-session-001/report.md
Runs: 1 runs × 2 personas; 0 findings survived every run; saturation not reached
Parity: shared timing, expertise, text and alternatives; hold-out adds rollback, voice fallback, ratings distrust and funding ambiguity; calibration recorded
Hypotheses: 0 to confirm with real users
Next: none

