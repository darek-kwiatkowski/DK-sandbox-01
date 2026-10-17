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
2. **Weryfikacja przed zgłoszeniem.** Zanim uznasz zmianę za gotową, uruchom `npm run lint`, `npx tsc --noEmit` oraz `npm run build`. Przy zmianach w UI uruchom aplikację (`npm run dev`) i sprawdź efekt. Raportuj rzeczywiste wyniki. Jeśli coś pominięto albo nie przeszło, napisz to wprost.
3. **Krytyczny przegląd.** Po nietrywialnej poprawce przejrzyj diff tak, jak zrobiłby to recenzent. Jeśli rozwiązanie jest prowizoryczne, zastąp je eleganckim, skoro znasz już pełny kontekst.
4. **Wnioski po poprawkach.** Po każdej korekcie od użytkownika lub naprawie błędu sformułuj regułę, która zapobiegnie powtórce, i zapisz ją zgodnie z zasadą 4 sekcji „Struktura `.ai/`”. Jeśli reguła dotyczy wszystkich przyszłych zadań, zaproponuj dopisanie jej do tego pliku.
5. **Samodzielne naprawianie błędów.** Gdy dostajesz zgłoszenie błędu lub nieprzechodzący build, sam zbadaj logi i kod, znajdź przyczynę i ją napraw. Nie czekaj na instrukcje, jak to zrobić.
6. **Subagenci przy szerokim researchu.** Przeszukiwanie wielu plików lub niezależne wątki pracy deleguj do subagentów, żeby nie zaśmiecać głównego kontekstu.
7. **Powtarzalne czynności jako skille.** Procedurę wykonywaną regularnie zapisz jako skill lub komendę w `.claude/` i dodaj ją do repozytorium.
