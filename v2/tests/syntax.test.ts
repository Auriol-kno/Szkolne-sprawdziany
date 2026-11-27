/* Moduł matematyki (src/math_app.html) jest osadzany jako tekst – błąd składni psuje go po cichu. Sprawdzamy składnię jego skryptów. */
import { expect, test } from 'bun:test';
import { readFileSync } from 'fs';

test('skrypty modułu matematyki mają poprawną składnię', () => {
  const h = readFileSync(new URL('../../src/math_app.html', import.meta.url), 'utf8');
  const scripts = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const s of scripts) expect(() => new Function(s)).not.toThrow();
});
