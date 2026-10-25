# DevMentor: materiały do syntetycznych użytkowników

Rozpakuj ZIP w głównym katalogu swojego projektu. Pojawi się katalog `devmentor-synthetic-input/`, a Twój brief w `.ai/specs/` zostanie bez zmian.

To wycinek wyboru konsultacji, a nie pełny brief DevMentora. Pliki są materiałami demonstracyjnymi. Ich pochodzenie i role wyjaśnia `.ai/specs/research/SOURCES.md`.

Pakiet zawiera wyłącznie materiały wejściowe. Potrzebujesz skilla `om-synthetic-users` z katalogu kursu, dostępnego w swoim agencie, oraz środowiska obsługującego osobne konteksty podagentów. Jeśli skill nie jest dostępny, wróć do instrukcji instalacji z lekcji 03. Nie uruchamiaj setupu aplikacji ani bazy danych.

W agencie otwartym w katalogu projektu uruchom:

```text
/om-synthetic-users devmentor-synthetic-input/.ai/specs/product-brief.md --research devmentor-synthetic-input/.ai/specs/research --flow "Future state, booking and session (1.0), decided steps" --stance adversary --panel 2 --runs 1 --hold-out devmentor-synthetic-input/.ai/specs/research/holdout/2026-09-01-interview-backend-dev-fintech.md
```

Sprawdź zaproponowany skład panelu i zatwierdź go dopiero, gdy odpowiada materiałom. Przy jednym przebiegu obserwacje mają status Seen once. Wygenerowane reakcje nie są wynikami wywiadów z ludźmi.

Pakiet nie zawiera gotowych person ani raportów. Wyniki znajdziesz w `devmentor-synthetic-input/.ai/specs/research/`. Nie przenoś ich do swojego briefu.
