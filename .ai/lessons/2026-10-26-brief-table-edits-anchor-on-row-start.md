# Edycje tabel briefu kotwicz na początku wiersza

- **Data:** 2026-10-26
- **Kontekst:** Skrypt dopisujący wiersze Q26–Q29 po „| Q25 |” trafił do tabeli reguł, bo identyfikator Q25 występował też w kolumnie „Review by” wiersza R16. Błąd wykrył dopiero kolejny przegląd.
- **Wniosek:** Identyfikatory (Q, R, D, A) występują w wielu kolumnach i tabelach briefu, więc wyszukanie samego „| Qnn |” nie wskazuje wiersza.
- **Jak stosować:** Wiersz briefu wyszukuj po prefiksie linii (`line.startswith("| Qnn |")`), wymagaj dokładnie jednego trafienia, a po edycji sprawdź, czy każdy wiersz każdej tabeli ma prefiks id właściwy dla swojej sekcji.
