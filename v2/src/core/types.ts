/* Schemat treści: Przedmiot → Dział (zakres sprawdzianu) → Lekcja (kartkówka) → Umiejętność (typ zadania) */

export type Level = 1 | 2 | 3;

export interface Field {
  label?: string;
  ans: any;
  kind?: 'n' | 'w' | 'r' | 't';
  alts?: string[];
  unit?: string;
  ph?: string;
  item?: string;
  mark?: boolean;
}

export interface Question {
  type: 'one' | 'sort' | 'order' | 'num';
  html: string;
  fields: Field[];
  opts?: string[];
  cats?: string[];
  steps?: string[];
  shuf?: number[];
  expl: string;
  hint?: string;
  key: string;
}

/** Generator zadań jednego typu na danym poziomie trudności. */
export interface Gen { l: Level; f: () => Question }

export interface Skill {
  id: string;
  name: string;
  hint?: string;
  gens: Gen[];
}

export interface Lesson {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Dzial {
  id: string;
  name: string;
  /** np. "str. 58–97" albo "rozdział I" */
  pages?: string;
  /** dane wstępne, do potwierdzenia z podręcznikiem */
  tentative?: string;
  lessons: Lesson[];
  schoolTests?: SchoolTest[];
  /** dział obsługiwany jeszcze przez starszy moduł (matematyka przed migracją) */
  legacy?: { module: 'math'; chapter: string };
}

export interface Subject {
  id: 'math' | 'hist' | 'przyroda' | 'english';
  name: string;
  icon: string;
  desc: string;
  dzialy: Dzial[];
}

/* ---------- sprawdziany szkolne (oryginał + warianty) ---------- */

export type SFieldKind = 'n' | 'w' | 'pair' | 'sel' | 'r' | 'time' | 't';

export interface SField {
  l: string;
  pre?: string;
  post?: string;
  k: SFieldKind;
  a: any;
  alt?: string[];
  u?: string | [string, string];
  o?: string[];
  pts?: number;
  /** umiejętność, której dotyczy pole (do analizy błędów) */
  skill?: string;
}

export interface STask {
  n?: number;
  pts: number;
  q: string;
  f: SField[];
  ex: string;
  grid?: boolean;
  /** umiejętności sprawdzane w zadaniu (id z działu) */
  skills?: string[];
  /** punkty w szkole (tylko oryginał) i opis błędu */
  fr?: number;
  err?: string;
}

export interface SchoolTest {
  id: string;
  title: string;
  info: string;
  date: string;
  max: number;
  /** wynik ze szkoły */
  result?: { pts: number; pct: number; grade: number; notes: string };
  build: (variant: string) => { tasks: STask[] };
}
