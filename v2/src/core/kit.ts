/* Wspólne narzędzia do pisania generatorów zadań (używane przez pliki w content/). */
import type { Field, Gen, Level, Question } from './types';

export const R = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const P = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
export const plural = (n: number, a: string, b: string, c: string) => {
  if (n === 1) return a;
  const u = n % 10, t = n % 100;
  return u >= 2 && u <= 4 && (t < 12 || t > 14) ? b : c;
};
export const esc = (s: unknown) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export const shuffle = <T>(a: readonly T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const pickN = <T>(a: readonly T[], n: number) => shuffle(a).slice(0, n);
export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const today = () => ymd(new Date());
export const LV: Record<number, string> = { 1: 'łatwy', 2: 'średni', 3: 'trudny' };
export const CUR = new Date().getFullYear();

/* liczby rzymskie i wieki */
export const toRoman = (n: number) => { let s = ''; for (const [v, r] of [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']] as [number, string][]) while (n >= v) { s += r; n -= v; } return s; };
export const fromRoman = (s: string) => { const v: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; let n = 0; for (let i = 0; i < s.length; i++) { const a = v[s[i]], b = v[s[i + 1]]; if (!a) return NaN; n += b > a ? -a : a; } return toRoman(n) === s ? n : NaN; };
export const cent = (y: number) => Math.ceil(y / 100);
export const rk = (y: number, bc?: boolean, ne?: boolean) => `${y} roku${bc ? ' p.n.e.' : ne ? ' n.e.' : ''}`;
export const near = (ok: number, extra: number[] = []) => { const c = [...new Set([ok + 1, ok - 1, ok + 10, ok - 10, ok + 2, ok - 2, ok + 5, ...extra].filter(x => x > 0 && x !== ok))]; return pickN(c, 3).map(String); };
export const rnear = (n: number) => { const ok = toRoman(n); const c = [...new Set([n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, n + 5, n - 5].filter(x => x > 0).map(toRoman).filter(x => x !== ok))]; return pickN(c, 3); };
export const wnear = (c: number, bc?: boolean) => { const cs = [...new Set([c + 1, c - 1, c + 2, c - 2].filter(x => x > 0))]; return pickN(cs, 3).map(x => toRoman(x) + (bc ? ' p.n.e.' : '')); };

/* ---------- typy zadań ---------- */
type OneSpec = { q: string; ok: string; bad: string[]; expl: string; hint?: string };
/** jednokrotny wybór z generatora */
export function D(l: Level, fn: () => OneSpec): Gen {
  return { l, f: () => { const o = fn(); const opts = shuffle([o.ok, ...o.bad]); return { type: 'one', html: o.q, opts, fields: [{ ans: opts.indexOf(o.ok) }], expl: o.expl, hint: o.hint, key: o.q }; } };
}
/** jednokrotny wybór – stałe pytanie */
export const O = (l: Level, q: string, ok: string, bad: string[], expl: string, hint?: string) => D(l, () => ({ q, ok, bad, expl, hint }));
/** przyporządkowanie do kategorii */
export function SQ(l: Level, q: string, cats: string[], pool: [string, number][], n: number, expl: string | ((ch: [string, number][], cats: string[]) => string), hint?: string): Gen {
  return { l, f: () => {
    let ch: [string, number][] = [];
    cats.forEach((_, ci) => { const g = pool.filter(p => p[1] === ci); if (g.length && ch.length < n) ch.push(P(g)); });
    ch = ch.concat(pickN(pool.filter(p => !ch.includes(p)), n - ch.length)); ch = shuffle(ch);
    const ex = typeof expl === 'function' ? expl(ch, cats) : expl;
    return { type: 'sort', html: q, cats, fields: ch.map(p => ({ item: p[0], ans: p[1] })), expl: ex, hint, key: q + ch.map(p => p[0]).join('|') };
  } };
}
/** ułóż w kolejności */
export function Ord(l: Level, q: string, steps: string[], expl: string, hint?: string): Gen {
  return { l, f: () => {
    let s: number[];
    do { s = shuffle(steps.map((_, i) => i)); } while (s.every((v, i) => v === i));
    return { type: 'order', html: q, steps, shuf: s, fields: steps.map((_, k) => ({ ans: k })), expl, hint, key: q + Math.random() };
  } };
}
export const SQd = (l: Level, q: string, cats: string[], poolFn: () => [string, number][], n: number, expl: any, hint?: string): Gen => ({ l, f: () => SQ(l, q, cats, poolFn(), n, expl, hint).f() });
export const OrdD = (l: Level, q: string, genFn: () => { steps: string[]; expl: string; hint?: string }): Gen => ({ l, f: () => { const g = genFn(); return Ord(l, q, g.steps, g.expl, g.hint).f(); } });
/** pola do wpisania */
export const NM = (l: Level, fn: () => { q: string; fields: Field[]; expl: string; hint?: string }): Gen => ({ l, f: () => { const o = fn(); return { type: 'num', html: o.q, fields: o.fields, expl: o.expl, hint: o.hint, key: o.q } as Question; } });
export const F = (label: string, ans: any, kind?: Field['kind'], more?: Partial<Field>): Field => Object.assign({ label, ans, kind: kind || 'n' }, more || {});
export const listExpl = (ch: [string, number][], cats: string[]) => ch.map(p => `${p[0]} – ${cats[p[1]]}`).join('; ') + '.';

/** sprawdzanie wpisanej odpowiedzi: n = liczba, w = wiek (rzymski lub arabski), r = liczba rzymska, t = tekst */
export function chk(fd: Field, raw: unknown): boolean {
  if (fd.kind === 't') {
    const n = (x: unknown) => String(x == null ? '' : x).trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
    return [fd.ans, ...(fd.alts || [])].map(n).includes(n(raw));
  }
  let s = String(raw == null ? '' : raw).trim().toUpperCase().replace(/\s+/g, ' ');
  s = s.replace(/\b(WIEK|LAT|LATA|DNI|DZIEŃ|KM|WIEKÓW|WIEKI|P\.N\.E\.|N\.E\.)\b/g, '').replace(/\./g, '').replace(/\s+/g, ' ').trim();
  if (fd.kind === 'r') return s.replace(/\s/g, '') === fd.ans;
  if (fd.kind === 'w') { if (/^\d+$/.test(s)) return +s === fd.ans; return fromRoman(s.replace(/\s/g, '')) === fd.ans; }
  s = s.replace(/ /g, '');
  return /^\d+$/.test(s) && +s === fd.ans;
}

/** ocena szkolna z procentu (skala jak na sprawdzianach) */
export function gradeOf(p: number): [number, string] {
  if (p >= 98) return [6, 'cel']; if (p >= 90) return [5, 'bdb']; if (p >= 75) return [4, 'db']; if (p >= 60) return [3, 'dst']; if (p >= 40) return [2, 'dop']; return [1, 'ndst'];
}

/** deterministyczny generator losowy (warianty sprawdzianów są stałe) */
export function seeded(seed: number) {
  let a = seed >>> 0;
  const rnd = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return { rnd, r: (x: number, y: number) => x + Math.floor(rnd() * (y - x + 1)), p: <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)] };
}
