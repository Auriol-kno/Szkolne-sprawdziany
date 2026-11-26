# Szkolne sprawdziany

Aplikacja do nauki dla klasy 4: Matematyka, Angielski, Historia, Przyroda.

## Adresy

- Aplikacja: https://auriol-kno.github.io/Szkolne-sprawdziany/ (źródła w `v2/`)
- Stara wersja: https://auriol-kno.github.io/Szkolne-sprawdziany/stara/

Szczegóły dla programistów i AI: [AGENTS.md](AGENTS.md).

## Dwie wersje (w trakcie przejścia)

| | Stara (`stara/index.html`) | Aplikacja (`index.html`, źródła `v2/`) |
|---|---|---|
| Podział | przedmiot → tematy | **przedmiot → dział (sprawdzian) → lekcja (kartkówka) → umiejętność** |
| Kod | HTML + JS sklejany przez `build.py` | TypeScript, jeden silnik, testy |
| Matematyka | osobny moduł w ramce | na razie ten sam moduł, sprawdziany z klasy już natywnie |

Obie wersje czytają te same dane z `v2/content/`, więc nowa treść trafia do obu.

## Jak dodać treść

- **Nowe zadania / lekcja**: `v2/content/<przedmiot>/data.js` – `TOPICS` (umiejętności, `ch` = numer lekcji), `CHAPTERS` (lekcje), `B` (generatory wg poziomu 1–3).
- **Podział na działy**: `v2/content/index.ts` – które lekcje należą do którego działu.
- **Sprawdzian z klasy**: nowy plik w `v2/content/<przedmiot>/sprawdziany/` (wzór: `math/sprawdziany/systemy-zapisywania-liczb-2026-11-23.ts`) i dopisanie go do działu (`schoolTests`).

## Budowanie i testy

```sh
python3 build.py && node test2.js          # stara wersja -> stara/index.html
cd v2 && bun run build.ts && bun test && tsc --noEmit   # aplikacja -> index.html
```

`src/` – silnik obecnej wersji (`historia-engine.html`), moduł matematyki (`math_app.html`), wspólne funkcje.
