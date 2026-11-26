/* Zapis postępów w przeglądarce (osobno od starej wersji). */
import { today } from './kit';

export interface SkillStat { recent: number[]; level: 1 | 2 | 3; streak: number; n: number }
export interface Session { d: number; subj: string; dzial: string; mode: 'train' | 'test' | 'school' | 'quiz'; label: string; pts: number; max: number; pct: number }
export interface Store { v: 2; name: string; skills: Record<string, SkillStat>; sessions: Session[]; days: string[]; school: Record<string, number> }

const KEY = 'sprawdziany-v2';
const blank = (): Store => ({ v: 2, name: 'Franek', skills: {}, sessions: [], days: [], school: {} });

export function load(): Store {
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 2) return Object.assign(blank(), s); } catch { /* brak zapisu */ }
  return blank();
}
export let S: Store = load();
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* tryb prywatny */ } }
export function reset() { S = blank(); save(); }

const sk = (subj: string, id: string) => `${subj}/${id}`;
export function stat(subj: string, id: string): SkillStat {
  return S.skills[sk(subj, id)] || { recent: [], level: 1, streak: 0, n: 0 };
}
/** średnia z ostatnich prób (0–1) albo null, gdy nie ćwiczone */
export function acc(subj: string, id: string): number | null {
  const r = stat(subj, id).recent; return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null;
}
export function status(a: number | null): ['new' | 'low' | 'mid' | 'top', string] {
  if (a == null) return ['new', 'nowe']; if (a < 0.5) return ['low', 'do poprawy']; if (a < 0.8) return ['mid', 'ćwicz dalej']; return ['top', 'opanowane'];
}
/** zapisuje wynik zadania; w treningu dopasowuje poziom (3 dobre z rzędu → trudniej, błąd przy słabym wyniku → łatwiej) */
export function record(subj: string, id: string, score: number, adapt: boolean): string {
  const k = sk(subj, id); const s = { ...stat(subj, id) }; s.recent = [...s.recent, score].slice(-10); s.n++;
  let msg = '';
  if (score === 1) s.streak++; else s.streak = 0;
  if (adapt) {
    if (s.streak >= 3 && s.level < 3) { s.level = (s.level + 1) as 1 | 2 | 3; s.streak = 0; msg = 'Poziom w górę! Teraz trudniejsze zadania.'; }
    else if (score < 0.5 && s.level > 1 && s.recent.slice(-2).every(x => x < 0.5)) { s.level = (s.level - 1) as 1 | 2 | 3; msg = 'Spokojnie – na chwilę łatwiejsze zadania.'; }
  }
  S.skills[k] = s; const t = today(); if (!S.days.includes(t)) S.days.push(t); save();
  return msg;
}
export function addSession(x: Omit<Session, 'd'>) { S.sessions.unshift({ d: Date.now(), ...x }); S.sessions = S.sessions.slice(0, 100); save(); }
export function streakDays(): number {
  const set = new Set(S.days); const d = new Date(); if (!set.has(today())) d.setDate(d.getDate() - 1); let n = 0;
  for (;;) { const y = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; if (!set.has(y)) break; n++; d.setDate(d.getDate() - 1); }
  return n;
}

/** Jednorazowe przeniesienie postępów ze starej wersji (Historia, Przyroda, Angielski) – żeby po przejściu na nową wersję nic nie zginęło.
    Wyniki matematyki zostają w module matematyki (klucz 'lid4-v1'), sprawdziany z klasy matematyki – w 'school-tests-v1'. */
export function migrateLegacy() {
  const FLAG = 'sprawdziany-migrated-legacy';
  try {
    if (localStorage.getItem(FLAG)) return;
    const MAP: [string, string][] = [['hist4-v1', 'hist'], ['prz4-v1', 'przyroda'], ['ang4-v1', 'english']];
    let n = 0;
    for (const [key, subj] of MAP) {
      const old = JSON.parse(localStorage.getItem(key) || 'null'); if (!old || !old.topics) continue;
      for (const [id, t] of Object.entries<any>(old.topics)) {
        const k = `${subj}/${id}`; if (S.skills[k] || !t?.recent?.length) continue;
        const lv = Math.min(3, Math.max(1, +(old.levels?.[id] || 1))) as 1 | 2 | 3;
        S.skills[k] = { recent: t.recent.slice(-10), level: lv, streak: 0, n: t.att || t.recent.length }; n++;
      }
      for (const d of old.days || []) if (!S.days.includes(d)) S.days.push(d);
      if (!localStorage.getItem('sprawdziany-v2') && old.name) S.name = old.name;
    }
    if (n) save();
    localStorage.setItem(FLAG, new Date().toISOString());
  } catch { /* uszkodzone stare dane – pomijamy */ }
}
