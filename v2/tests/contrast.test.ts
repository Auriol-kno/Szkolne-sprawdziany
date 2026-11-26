/* Czytelność: kontrast tekstu do tła (WCAG) w każdym wariancie i trybie. */
import { describe, expect, test } from 'bun:test';
import { LOOKS, LIGHT_STATUS, DARK_STATUS, ratio, resolved } from '../src/themes';


/** pary [tekst, tło, minimum, opis] */
const PAIRS: [string, string, number, string][] = [
  ['--fg', '--paper', 4.5, 'tekst na tle'], ['--fg', '--card', 4.5, 'tekst na karcie'], ['--muted', '--card', 4.5, 'opis na karcie'], ['--muted', '--paper', 4.5, 'opis na tle'],
  ['--ink', '--card', 4.5, 'kolor przedmiotu na karcie'], ['--ink', '--paper', 4.5, 'kolor przedmiotu na tle'], ['--on-ink', '--ink', 4.5, 'przycisk główny'],
  ['--ink', '--ink-soft', 4.5, 'etykieta / zaznaczenie'], ['--bar-fg', '--bar', 4.5, 'pasek górny'], ['--bar-on-fg', '--bar-on', 4.5, 'aktywny przycisk paska'],
  ['--brand', '--bar', 4.5, 'nazwa w pasku'], ['--green', '--green-soft', 4.5, 'dobrze'], ['--red', '--red-soft', 4.5, 'źle'], ['--amber', '--amber-soft', 4.5, 'prawie'],
  ['--fg', '--green-soft', 4.5, 'tekst w zielonym'], ['--fg', '--red-soft', 4.5, 'tekst w czerwonym'], ['--fg', '--amber-soft', 4.5, 'tekst w żółtym'], ['--fg', '--hl', 4.5, 'zakreślenie'],
];

describe('kontrast wariantów wyglądu', () => {
  const base = LOOKS.find(l => l.id === 'obecny')!;
  for (const l of LOOKS) for (const sc of ['light', 'dark'] as const) {
    const p = resolved(l, sc);
    const common = { ...(sc === 'light' ? LIGHT_STATUS : DARK_STATUS), ...resolved(base, sc).vars, '--bar': base[sc].hub[2]!, ...p.vars } as Record<string, string>;
    const brandLight = /\.brand[^{]*\{[^}]*color:(var\(--bar-fg\)|#141414)/.test(l.css || '');
    const ctx: [string, Record<string, string>][] = [['ekran główny', { ...common, '--ink': p.hub[0], '--ink-soft': p.hub[1], ...(p.hub[2] ? { '--bar': p.hub[2] } : {}) }],
      ...Object.entries(p.subj).map(([k, i]) => [k, { ...common, '--ink': i[0], '--ink-soft': i[1], ...(i[2] ? { '--bar': i[2] } : {}) }] as [string, Record<string, string>])];
    test(`${l.name} – ${sc === 'light' ? 'jasny' : 'ciemny'}`, () => {
      const bad: string[] = [];
      for (const [where, v] of ctx) {
        v['--brand'] = brandLight ? (l.css!.includes('color:#141414') ? '#141414' : v['--bar-fg']) : '#FFFFFF';
        for (const [a, b, min, what] of PAIRS) { const r = ratio(v[a], v[b]); if (r < min) bad.push(`${where}: ${what} ${v[a]}/${v[b]} = ${r.toFixed(2)}`); }
        const big = ratio(v['--ink'], v['--card']); if (big < 3) bad.push(`${where}: tytuł przedmiotu ${big.toFixed(2)}`);
      }
      for (const [k, i] of Object.entries(p.subj)) { const r = ratio(i[0], common['--card']); if (r < 3) bad.push(`kafelek ${k} ${r.toFixed(2)}`); }
      expect(bad).toEqual([]);
    });
  }
});
