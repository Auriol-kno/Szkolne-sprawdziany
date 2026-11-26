import { describe, expect, test } from 'bun:test';
import { SUBJECTS } from '../content/index';
import { chk, toRoman } from '../src/core/kit';
import { VARIANTS, grade } from '../src/core/school';

describe('struktura treści', () => {
  for (const s of SUBJECTS) test(`${s.name}: działy, lekcje, unikalne umiejętności`, () => {
    expect(s.dzialy.length).toBeGreaterThan(0);
    const ids = s.dzialy.flatMap(d => d.lessons.flatMap(l => l.skills.map(k => k.id)));
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of s.dzialy) { expect(d.lessons.length).toBeGreaterThan(0); if (!d.legacy) for (const l of d.lessons) for (const k of l.skills) expect(k.gens.length).toBeGreaterThan(0); }
  });
});

describe('generatory zadań (każdy 150 razy)', () => {
  for (const s of SUBJECTS) for (const d of s.dzialy) for (const l of d.lessons) for (const k of l.skills) if (k.gens.length) test(`${s.id}/${k.id}`, () => {
    for (const g of k.gens) for (let i = 0; i < 150; i++) {
      const q = g.f();
      expect(/NaN|undefined/.test(JSON.stringify(q))).toBe(false);
      if (q.type === 'one') { expect(new Set(q.opts).size).toBe(q.opts!.length); expect(q.opts!.length).toBeGreaterThanOrEqual(3); expect(q.opts![q.fields[0].ans]).toBeDefined(); }
      if (q.type === 'num') for (const fd of q.fields) expect(chk(fd, fd.kind === 'w' ? toRoman(fd.ans) : String(fd.ans))).toBe(true);
      if (q.type === 'order') expect(new Set(q.steps).size).toBe(q.steps!.length);
    }
  });
});

describe('sprawdziany szkolne', () => {
  for (const s of SUBJECTS) for (const d of s.dzialy) for (const t of d.schoolTests || []) {
    const skillIds = new Set(d.lessons.flatMap(l => l.skills.map(k => k.id)));
    for (const v of [...VARIANTS, 'rand', 'rand']) test(`${t.title} – ${v}: klucz daje ${t.max}/${t.max}`, () => {
      const { tasks } = t.build(v);
      expect(tasks.reduce((a, x) => a + x.pts, 0)).toBe(t.max);
      const vals: Record<string, string> = {};
      tasks.forEach((q, i) => { (q.skills || []).forEach(id => expect(skillIds.has(id)).toBe(true)); q.f.forEach((fd, j) => { const k = `${i}-${j}`;
        if (fd.k === 'pair') { vals[k + 'a'] = String(fd.a[0]); vals[k + 'b'] = String(fd.a[1]); }
        else if (fd.k === 'time') vals[k] = `${Math.floor(fd.a / 60)}:${String(fd.a % 60).padStart(2, '0')}`;
        else vals[k] = String(fd.a); }); });
      const r = grade(tasks, vals, t.max);
      expect(r.tot).toBe(t.max); expect(r.weak.length).toBe(0);
      expect(grade(tasks, {}, t.max).tot).toBe(0);
    });
    test(`${t.title} – oryginał ma wynik ze szkoły zgodny z punktami`, () => {
      const sum = t.build('orig').tasks.reduce((a, x) => a + (x.fr ?? 0), 0);
      expect(sum).toBe(t.result!.pts);
    });
  }
});
