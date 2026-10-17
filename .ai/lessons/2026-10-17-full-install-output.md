# Nie obcinaj wyniku `npm install`

- **Data:** 2026-10-17
- **Kontekst:** w fazie 1 wynik `npm install` był obcinany przez `| tail`. Przez to umknęły ostrzeżenia `ERESOLVE`: ESLint 10 nie spełniał peer dependencies wtyczek `eslint-config-next`. Wyszło to dopiero w fazie 3.
- **Wniosek:** lint działał, więc problem nie był widoczny w sprawdzeniach. Wykrył go dopiero pełny log instalacji.
- **Jak stosować:**
  - Po każdej instalacji lub zmianie wersji uruchom `npm install 2>&1 | grep -cE "ERESOLVE|peer"` (oczekiwane 0) i `npm ls 2>&1 | grep -iE "invalid|missing"` (oczekiwane puste).
  - Wersji głównych nie dobieraj według `npm view <pkg> version`. Najpierw sprawdź `peerDependencies` narzędzi, które z nich korzystają.
