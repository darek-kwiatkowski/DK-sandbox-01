# Storybook i shadcn w `packages/ui`: pułapki

## Uzupełnienie 2026-11-16

- Testy `play` zależne od odpowiedzi MSW muszą czekać na wynik (`waitFor` lub `findByRole`), nie tylko na zakończenie kliknięcia. Kliknięcie nie oznacza zakończenia żądania.
- Testy axe nie wykrywają przepełnienia długiej etykiety. Złożone kontrolki sprawdzaj przy 320 px z długim tekstem; styl odziedziczony z prymitywu może blokować zawijanie mimo poprawnych tokenów.
- W MDX nie zakładaj, że lokalna deklaracja komponentu będzie dostępna jako JSX w skompilowanej stronie. Pomocniczy blok dokumentacji umieść w pliku TSX i importuj jawnie; sprawdź stronę w zbudowanym Storybooku.

- **Data:** 2026-11-06
- **Kontekst:** budowa design systemu DevMentor w Storybooku 10 (react-vite, addon-vitest, addon-a11y) na shadcn/Radix.
- **Wniosek:**
  1. `npx shadcn add <x>` pyta o nadpisanie istniejących zależności (np. `button.tsx` przy `dialog`) i bez odpowiedzi kończy się, nie dodając komponentu. `--yes` tego nie pomija.
  2. Storybook wpisuje nazwę „Storybook” na sztywno (tytuł karty, ukryty `h1`, menu „About your Storybook”); `brandTitle` tego nie zmienia.
  3. Strony MDX bez stories nie uruchamiają dekoratorów, więc przełącznik motywu trzeba też podpiąć pod kanał globals (`SET_GLOBALS`, `GLOBALS_UPDATED`), a `.docs-story` dostaje tło z tokenu, bo inaczej ciemne komponenty stoją na białym tle dokumentacji.
  4. Testy a11y z addon-vitest sprawdzają też treść w portalach (dialogi, menu). Stories z menu otwartym od startu zgłaszają `aria-hidden-focus`, bo Radix ukrywa resztę strony i więzi fokus.
  5. Story, która nie przejdzie, może zostawić otwarty portal w `document.body`. Kolejne testy szukające `queryByRole("dialog")` widzą wtedy cudzy dialog i zawodzą bez własnej winy.
  6. Radix RadioGroup przenosi fokus strzałką w `setTimeout` i zaznacza tylko przy wciśniętym klawiszu; w teście trzeba przytrzymać klawisz (`{ArrowDown>}` … `{/ArrowDown}`).
  7. Pierwsze uruchomienie testów stories po zmianie importów padało z `TypeError` przez przeładowanie zależności Vite w trakcie biegu; pomaga `optimizeDeps.include` w `vitest.storybook.config.ts`.
  8. Odcień tła z przezroczystością (`bg-destructive/20`) zmienia kontrast zależnie od podłoża (stopka `bg-muted`, hover): parę z tokenów sprawdzaj na każdym tle, na którym stoi, a testy a11y w obu motywach to wyłapują.
  9. `STORYBOOK_THEME=light command` is not portable to Windows `cmd`; run each theme from a small Node launcher that passes the environment to the child process.
- **Jak stosować:** przy CLI odpowiadaj na pytania (`yes n | npx shadcn@latest add …`) i sprawdzaj `package.json`; branding rób w `manager.ts`; motyw stosuj na `<html>` i dla stron docs; najpierw napraw stories z naruszeniami, potem diagnozuj „niezamykające się” nakładki; trzymaj klawisze w testach Radix; dopisuj zależności do `optimizeDeps.include`; uruchamiaj testy obu motywów przez przenośny launcher procesu.
