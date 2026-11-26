/* Matematyka – działy i umiejętności z podręcznika. Zadania generuje na razie starszy moduł (src/math_app.html);
   w etapie 4 generatory zostaną przeniesione tutaj. */
import type { Dzial } from '../../src/core/types';
import { systemyLiczb } from './sprawdziany/systemy-zapisywania-liczb-2026-11-23';

const T: [string, string, string][] = [
  ['addsub', 'c1', 'Dodawanie i odejmowanie'],
  ['muldiv', 'c1', 'Mnożenie i dzielenie'],
  ['rem', 'c1', 'Dzielenie z resztą'],
  ['word', 'c1', 'Zadania tekstowe'],
  ['line', 'c1', 'Oś liczbowa'],
  ['factor', 'c1', 'Brakujący czynnik'],
  ['pow', 'c1', 'Kwadrat i sześcian'],
  ['diff', 'c1', 'O ile więcej, o ile mniej'],
  ['neigh', 'c1', 'Działania na opisanych liczbach'],
  ['age', 'c1', 'Zadania o wieku'],
  ['times', 'c1', 'Ile razy więcej, ile mniej'],
  ['order', 'c1', 'Kolejność działań'],
  ['puzzle', 'c1', 'Zagadki liczbowe'],
  ['dec', 'c2', 'System dziesiątkowy'],
  ['cmp', 'c2', 'Porównywanie liczb'],
  ['mem2', 'c2', 'Rachunki na dużych liczbach'],
  ['money', 'c2', 'Jednostki monetarne'],
  ['len', 'c2', 'Jednostki długości'],
  ['mass', 'c2', 'Jednostki masy'],
  ['roman', 'c2', 'System rzymski'],
  ['cal', 'c2', 'Kalendarz'],
  ['clock', 'c2', 'Godziny i czas'],
  ['bin', 'c2', 'System dwójkowy'],
  ['wadd', 'c3', 'Dodawanie pisemne'],
  ['wsub', 'c3', 'Odejmowanie pisemne'],
  ['wmul1', 'c3', 'Mnożenie przez liczbę jednocyfrową'],
  ['wmulz', 'c3', 'Mnożenie przez liczby z zerami'],
  ['wmulm', 'c3', 'Mnożenie przez liczby wielocyfrowe'],
  ['wdiv', 'c3', 'Dzielenie pisemne'],
  ['wtext', 'c3', 'Zadania tekstowe z rachunkiem pisemnym'],
  ['lines', 'c4', 'Proste, półproste, odcinki'],
  ['par', 'c4', 'Proste prostopadłe i równoległe'],
  ['ang', 'c4', 'Kąty'],
  ['polyg', 'c4', 'Wielokąty'],
  ['rect', 'c4', 'Prostokąty, kwadraty i obwody'],
  ['circle', 'c4', 'Koła i okręgi'],
  ['scale', 'c4', 'Skala i plan'],
  ['kang', 'k', 'Zadania z Kangura']
];
const CH: [string, string, string][] = [
  ['c1', 'Liczby i działania', 's. 10–57'],
  ['c2', 'Systemy zapisywania liczb', 's. 58–97'],
  ['c3', 'Działania pisemne', 's. 98–123'],
  ['c4', 'Figury geometryczne', 's. 123–164'],
  ['k', 'Kangur matematyczny', 'konkurs']
];

export const mathDzialy: Dzial[] = CH.map(([id, name, pages]) => ({
  id: 'mat-' + id,
  name,
  pages,
  legacy: { module: 'math', chapter: id },
  lessons: [{ id: 'mat-' + id + '-l', name: 'Umiejętności z działu', skills: T.filter(t => t[1] === id).map(([sid, , sname]) => ({ id: sid, name: sname, gens: [] })) }],
  schoolTests: id === 'c2' ? [systemyLiczb] : [],
}));
