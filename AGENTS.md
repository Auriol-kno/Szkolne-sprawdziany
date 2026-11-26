# AGENTS.md – informacje dla AI i programistów pracujących nad projektem

Aplikacja do nauki dla ucznia **klasy 4** (Franek). Przedmioty: **Matematyka, Angielski, Historia, Przyroda**.
Rodzic przysyła zdjęcia sprawdzianów i stron z podręczników, a na ich podstawie powstają zadania, działy i sprawdziany do ćwiczeń.
Język interfejsu i treści: **polski** (angielski tylko w zadaniach z angielskiego). Kolorystyka ma być spokojna, przyjazna dziecku.

Repo: `Auriol-kno/Szkolne-sprawdziany`, gałąź `main`, publikacja przez GitHub Pages (https://auriol-kno.github.io/Szkolne-sprawdziany/):
- **`/` → `index.html` = aplikacja (nowa wersja, źródła w `v2/`)** – z tego adresu korzysta telefon ucznia (ikona na ekranie)
- `/v2/` → przekierowanie na `/` (stary link)
- `/stara/` → `stara/index.html` = poprzednia wersja (generuje `build.py`)
Wszystkie adresy mają to samo origin, więc dzielą localStorage (wyniki).

## Struktura katalogów

```
index.html              APLIKACJA – plik WYGENEROWANY przez v2/build.ts, nie edytuj ręcznie
stara/index.html        stara wersja – WYGENEROWANA przez build.py
build.py                skleja stara/index.html z src/ i v2/content/ (łatki tekstowe na silniku – kruche, patrz niżej)
test2.js                test starej wersji (node test2.js)
src/historia-engine.html  silnik starej wersji (Historia/Przyroda/Angielski)
src/math_app.html         moduł matematyki (osobna aplikacja, osadzana w <iframe srcdoc>), też zakładka „Szkolne”
src/common_*.js           wspólne funkcje starej wersji
v2/
  index.html            przekierowanie na / (generuje build.ts)
  build.ts              bun run build.ts – bundluje TS, wkleja CSS i moduł matematyki do ../index.html
  src/main.ts           widoki i logika v2 (hub → przedmiot → dział → trening/sprawdzian/sprawdzian szkolny, ustawienia)
  src/themes.ts         8 wariantów wyglądu × tryb jasny/ciemny/systemowy; resolved() poprawia kontrast automatycznie
  src/core/types.ts     SCHEMAT TREŚCI (czytaj najpierw)
  src/core/kit.ts       narzędzia do generatorów zadań (R, P, D, O, SQ, Ord, NM, F, chk, gradeOf, seeded…)
  src/core/store.ts     postępy (localStorage 'sprawdziany-v2'), poziomy trudności
  src/core/school.ts    sprawdzanie i rysowanie sprawdzianów szkolnych
  src/core/backup.ts    kopia zapasowa / synchronizacja (eksport/import JSON)
  src/legacy.css        style przejęte ze starej wersji, src/app.css – style v2
  content/index.ts      lista przedmiotów i PODZIAŁ NA DZIAŁY
  content/<przedmiot>/data.js   umiejętności (TOPICS), lekcje (CHAPTERS), generatory (B) – czyta je też stara wersja
  content/math/index.ts         działy matematyki (zadania wciąż w src/math_app.html)
  content/math/sprawdziany/*.ts sprawdziany z klasy (oryginał + warianty)
  tests/content.test.ts bun test – treść i klucze sprawdzianów
  tests/contrast.test.ts bun test – kontrast (WCAG AA 4.5:1) każdego wariantu i trybu; nowy wariant musi przejść
```

## Model treści

**Przedmiot → Dział (= zakres jednego sprawdzianu) → Lekcja (= kartkówka) → Umiejętność (= jeden typ zadania) → generatory zadań (poziom 1–3).**

- W `data.js`: `TOPICS` = umiejętności (`ch` = numer lekcji), `CHAPTERS` = nazwy lekcji, `B[idUmiejętności]` = lista generatorów `{l: poziom, f(): Question}`.
- W `content/index.ts` przypisujesz lekcje (numery `ch`) do działów. `tentative` = podział wstępny do potwierdzenia z podręcznikiem.
- Typy zadań: `one` (wybór A–D), `sort` (przyporządkuj), `order` (ułóż kolejność), `num` (wpisz; `kind`: `n` liczba, `t` tekst z `alts`, `r` rzymska, `w` wiek).
- **Sprawdzian z klasy** (`SchoolTest`): `build(variant)` zwraca zadania. `orig` = dokładnie pytania ze zdjęcia, `v1`–`v5` = stałe warianty (ziarno w `seeded`), `rand` = losowy. Każde zadanie ma `skills` (id umiejętności z działu) → po sprawdzeniu aplikacja wskazuje słabe umiejętności. Pole `fr`/`err` = punkty i błąd ucznia ze szkoły (tylko oryginał), `result` = wynik ze szkoły.

## Jak dodać nowy materiał (typowe zadanie od rodzica)

1. Sprawdź w aplikacji: ⚙️ Ustawienia → „Materiały w aplikacji”, czy dział już istnieje (żeby nie dublować).
2. Nowe umiejętności/generatory dopisz w `v2/content/<przedmiot>/data.js` (nowe `ch` = nowa lekcja, dopisz nazwę w `CHAPTERS`).
3. Przypisz lekcje do działu w `v2/content/index.ts`.
4. Sprawdzian ze zdjęć: nowy plik w `v2/content/<przedmiot>/sprawdziany/` wg wzoru `math/sprawdziany/systemy-zapisywania-liczb-2026-11-23.ts`, dodaj do `schoolTests` działu. Zapisz w komentarzu, czego nie było widać na zdjęciu.
5. Zbuduj i przetestuj obie wersje (poniżej), commit, push na `main`.

## Budowanie i testy

```sh
python3 build.py && node test2.js                       # stara wersja → stara/index.html
cd v2 && bun run build.ts && bun test && tsc --noEmit   # aplikacja → index.html (i przekierowanie v2/index.html)
```
Testy v2 uruchamiają każdy generator 150× (unikalne odpowiedzi, poprawny klucz, brak NaN/undefined) i sprawdzają, że klucz każdego wariantu sprawdzianu szkolnego daje maksimum punktów.
W środowisku bez sieci nie da się instalować pakietów – projekt nie ma zależności npm (TypeScript + bun wystarczą).

## Zapisywane dane (localStorage, to samo origin co GitHub Pages)

- `sprawdziany-v2` – postępy v2 (umiejętności, sesje, najlepsze wyniki sprawdzianów szkolnych)
- `sprawdziany-draft` – rozpoczęte ćwiczenie / sprawdzian (wznawianie po odświeżeniu lub aktualizacji)
- `sprawdziany-look`, `sprawdziany-mode` – wygląd i tryb
- `sprawdziany-backup-prev` – stan sprzed ostatniego wczytania kopii (przycisk „Cofnij”)
- `sprawdziany-migrated-legacy` – znacznik jednorazowego przeniesienia postępów ze starej wersji (`migrateLegacy()` w store.ts)
- stara wersja: `lid4-v1` (matematyka), `hist4-v1`, `prz4-v1`, `ang4-v1`, `school-tests-v1`, `subj-order-v2`
Kopia w Ustawieniach eksportuje/importuje te klucze (format `{app:'szkolne-sprawdziany', format:1, date, data}`). Zmieniając format danych, podnieś `FORMAT` i dodaj migrację w `store.ts`/`backup.ts` – nie kasuj starych kluczy.

## Pułapki

- `index.html` i `v2/index.html` są generowane – edytuj źródła i przebuduj.
- `build.py` podmienia fragmenty silnika dokładnym tekstem (`rep(...)` z `assert`). Zmiana w `historia-engine.html` może zepsuć łatkę – build to zgłosi.
- Moduł matematyki to osobny dokument w iframe; ma własne `data-theme` (light/dark). Wygląd v2 wstrzykuje do niego CSS wariantów (`looksCSS()`), w wariancie „obecny” zostawia mu własne kolory.
- W `math_app.html` w treści skryptów nie może wystąpić `</script` (moduł jest wklejany jako tekst).
- Zadanie 7 sprawdzianu z 23.11 miało ucięte polecenie – przyjęto „Ile waży słoik z miodem?”.

## Stan prac (dziennik)

- 2026-11-26: Matematyka – zakładka „Szkolne”: sprawdzian „Systemy zapisywania liczb” (23.11, wynik w szkole 18,5/25) + 5 wariantów + losowy. Matematyka pierwsza na liście.
- 2026-11-26: Angielski – rozdział „Ulubione rzeczy (str. 30)”: słownictwo (WSTĘPNE – czeka na zdjęcia z książki), this/that/these/those, pytania z be, krótki tekst.
- 2026-11-27: v2 – nowa struktura działów, wspólny silnik w TS, testy, sprawdziany szkolne jako dane.
- 2026-11-27: v2 – panel ⚙️ Ustawienia (z prawej): 6 wariantów wyglądu (Obecny, Zeszyt, Pastele, Kosmos, Las, Komiks) × tryb jasny/ciemny/systemowy; lista materiałów i sprawdzianów z klasy; kopia zapasowa (plik/tekst) i wznawianie przerwanych ćwiczeń.

- 2026-11-27: główny adres `/` = nowa wersja (stara w `/stara/`, `/v2/` przekierowuje). Jednorazowa migracja postępów Historii/Przyrody/Angielskiego ze starej wersji. Dwa nowe warianty: Płynne szkło (Liquid Glass) i Ekspresja (Material 3 Expressive). Test kontrastu + automatyczna korekta kolorów. Dotyk: `touch-action: manipulation`, reakcja na naciśnięcie, większy pasek w module matematyki na telefonie (przyciski miały 29 px wysokości).

## Wygląd – zasady

- Dodając wariant w `themes.ts` podaj paletę `light` i `dark` (zmienne + kolory przedmiotów); `tests/contrast.test.ts` sprawdzi czytelność.
- Kolory, których tekst leży na przezroczystym tle (szkło), muszą mieć nieprzezroczysty odpowiednik w `--card`/`--bar` do testu kontrastu.
- Minimalna wysokość przycisku na telefonie: 40 px.

## Plan (kolejne etapy)

1. Przenieść generatory matematyki z `src/math_app.html` do `v2/content/math/` (bez iframe).
2. Ustalić działy Historii i Przyrody ze spisów treści podręczników (czekamy na zdjęcia od rodzica); podmienić słownictwo angielskiego na to z książki.
3. Kolejne sprawdziany z klasy we wszystkich przedmiotach.
4. Postępy wg umiejętności i podsumowanie dla rodzica.
Plan jest też na tablicy (Whiteboard) „Szkolne sprawdziany – plan rozwoju”.
