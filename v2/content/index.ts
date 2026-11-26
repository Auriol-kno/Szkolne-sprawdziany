/* Spis wszystkich przedmiotów i ich podziału na działy.
   Dział = zakres jednego sprawdzianu, lekcja = zakres kartkówki, umiejętność = jeden typ zadania.
   Nowy dział: dopisz lekcje i umiejętności w content/<przedmiot>/data.js, a tutaj przypisz lekcje do działu. */
import type { Dzial, Subject } from '../src/core/types';
// @ts-ignore – dane w JS
import hist from './hist/data.js';
// @ts-ignore
import przyroda from './przyroda/data.js';
// @ts-ignore
import english from './english/data.js';
import { mathDzialy } from './math/index';

interface LegacyData { TOPICS: { id: string; ch: number; name: string; hint?: string }[]; CHAPTERS: Record<number, string>; B: Record<string, any[]> }
interface DzialDef { id: string; name: string; pages?: string; tentative?: string; chapters: number[] }

/** Zamienia dane przedmiotu (lekcje + umiejętności + generatory) na działy. */
function dzialy(prefix: string, data: LegacyData, defs: DzialDef[]): Dzial[] {
  return defs.map(d => ({
    id: d.id, name: d.name, pages: d.pages, tentative: d.tentative,
    lessons: d.chapters.map(c => ({
      id: `${prefix}-l${c}`,
      name: data.CHAPTERS[c],
      skills: data.TOPICS.filter(t => t.ch === c).map(t => ({ id: t.id, name: t.name, hint: t.hint, gens: data.B[t.id] || [] })),
    })),
  }));
}

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Matematyka', icon: '🔢', desc: 'Działy z podręcznika, sprawdziany z klasy, Kangur', dzialy: mathDzialy },
  { id: 'english', name: 'Angielski', icon: '💬', desc: 'Słówka i gramatyka z rozdziałów', dzialy: dzialy('ang', english, [
    { id: 'ang-start', name: 'Zestaw startowy', chapters: [1] },
    { id: 'ang-fav', name: 'Ulubione rzeczy (str. 30)', tentative: 'Słownictwo wstępne – podmienię na słówka z książki, gdy przyjdą zdjęcia rozdziału.', chapters: [2] },
  ]) },
  { id: 'hist', name: 'Historia', icon: '🏺', desc: 'Źródła, czas, wieki, kalendarz', dzialy: dzialy('his', hist, [
    { id: 'his-r1', name: 'Rozdział I: Historia i czas', pages: 'str. 8–34', chapters: [1, 2, 3, 4, 5] },
  ]) },
  { id: 'przyroda', name: 'Przyroda', icon: '🌿', desc: 'Obserwacje, badania, kierunki świata', dzialy: dzialy('prz', przyroda, [
    { id: 'prz-d1', name: 'Warsztat przyrodnika i kierunki świata', tentative: 'Podział do potwierdzenia ze spisem treści podręcznika.', chapters: [1, 2, 3, 4, 5] },
  ]) },
];
