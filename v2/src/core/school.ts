/* Sprawdzanie i rysowanie sprawdzianów szkolnych (oryginał + warianty). Wspólne dla wszystkich przedmiotów. */
import { esc } from './kit';
import type { SField, STask } from './types';

export const VARIANTS = ['orig', 'v1', 'v2', 'v3', 'v4', 'v5', 'rand'] as const;
export const variantName = (k: string) => k === 'orig' ? 'Oryginał' : k === 'rand' ? 'Losowy' : `Wariant ${k.slice(1)}`;
export const spts = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');
const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
const wnorm = (s: unknown) => String(s == null ? '' : s).toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;]/g, ' ').replace(/\s+/g, ' ').trim();

export type Vals = Record<string, string>;

export function checkField(fd: SField, key: string, vals: Vals): boolean {
  const v = (k: string) => vals[k] == null ? '' : String(vals[k]);
  const num = (s: string) => { s = s.replace(/[\s .]/g, ''); return /^\d+$/.test(s) ? +s : NaN; };
  switch (fd.k) {
    case 'n': return num(v(key)) === fd.a;
    case 'pair': return num(v(key + 'a')) === fd.a[0] && num(v(key + 'b')) === fd.a[1];
    case 'sel': return v(key) === fd.a;
    case 'r': return v(key).toUpperCase().replace(/\s/g, '') === fd.a;
    case 'w': case 't': return [fd.a, ...(fd.alt || [])].map(wnorm).includes(wnorm(v(key)));
    case 'time': { const m = v(key).match(/^\s*(\d{1,2})\D*(\d{2})\s*$/); return !!m && +m[1] * 60 + +m[2] === fd.a; }
  }
  return false;
}
export function ansText(fd: SField): string {
  if (fd.k === 'pair') { const u = fd.u as [string, string]; return `${fd.a[0]} ${u[0]} ${fd.a[1]} ${u[1]}`; }
  if (fd.k === 'time') return hm(fd.a);
  if (fd.k === 'n') return Number(fd.a).toLocaleString('pl-PL') + (fd.u ? ' ' + fd.u : '');
  return String(fd.a);
}

export interface SResult { ok: Record<string, boolean>; per: number[]; tot: number; pct: number; weak: string[] }
export function grade(tasks: STask[], vals: Vals, max: number): SResult {
  const ok: Record<string, boolean> = {}, per: number[] = []; let tot = 0; const weak = new Set<string>();
  tasks.forEach((q, i) => {
    let s = 0;
    q.f.forEach((fd, j) => { const k = `${i}-${j}`; ok[k] = checkField(fd, k, vals); if (ok[k]) s += fd.pts!; else (fd.skill ? [fd.skill] : q.skills || []).forEach(x => weak.add(x)); });
    per.push(s); tot += s;
  });
  return { ok, per, tot, pct: Math.round(tot / max * 100), weak: [...weak] };
}

function input(key: string, vals: Vals, res: SResult | null, cls: string, extra: string): string {
  const v = vals[key] ?? '';
  const good = res ? res.ok[key.replace(/[ab]$/, '')] : null;
  const c = [cls, res ? (good ? 'ok' : 'bad') : ''].filter(Boolean).join(' ');
  return `<input data-sf="${key}" value="${esc(v)}" autocomplete="off" ${extra}${c ? ` class="${c}"` : ''}${res ? ' disabled' : ''}>`;
}
export function fieldHTML(fd: SField, key: string, vals: Vals, res: SResult | null): string {
  let c = '';
  if (fd.k === 'n') c = input(key, vals, res, '', `inputmode="numeric" aria-label="${esc(fd.l)}"`) + (fd.u ? `<span class="u">${fd.u}</span>` : '');
  else if (fd.k === 'pair') { const u = fd.u as [string, string]; c = input(key + 'a', vals, res, 's', 'inputmode="numeric"') + `<span class="u">${u[0]}</span>` + input(key + 'b', vals, res, 's', 'inputmode="numeric"') + `<span class="u">${u[1]}</span>`; }
  else if (fd.k === 'w' || fd.k === 't') c = input(key, vals, res, 'w', 'autocapitalize="off" spellcheck="false" placeholder="wpisz"');
  else if (fd.k === 'r') c = input(key, vals, res, 'r', 'autocapitalize="characters" spellcheck="false" placeholder="np. XIV"');
  else if (fd.k === 'time') c = input(key, vals, res, '', 'inputmode="decimal" placeholder="gg:mm"');
  else if (fd.k === 'sel') { const v = vals[key] ?? ''; c = `<select data-sf="${key}"${res ? ` disabled class="${res.ok[key] ? 'ok' : 'bad'}"` : ''}><option value="">?</option>${fd.o!.map(o => `<option${v === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`; }
  const mark = res ? (res.ok[key] ? '<b class="sq-ok">✔</b>' : `<b class="sq-bad">✘ ${esc(ansText(fd))}</b>`) : '';
  return `<div class="sq-row${fd.k === 'w' || fd.k === 't' ? ' wide' : ''}"><span class="sq-l">${fd.l}${fd.pre ? ' ' + fd.pre : ''}</span>${c}${fd.post ? `<span class="sq-l">${fd.post}</span>` : ''}${mark}</div>`;
}
export function taskHTML(q: STask, i: number, vals: Vals, res: SResult | null, orig: boolean): string {
  return `<section class="card task sq">
    <div class="task-h"><span class="tn">Zadanie ${q.n}.</span><span class="pts">(${res ? `<span class="got">${spts(res.per[i])}</span>` : '.....'} / ${spts(q.pts)} p.)</span></div>
    <div class="q-text">${q.q}</div>
    <div class="${q.grid ? 'sq-grid' : ''}">${q.f.map((fd, j) => fieldHTML(fd, `${i}-${j}`, vals, res)).join('')}</div>
    ${res ? `<div class="fb ${res.per[i] === q.pts ? 'ok' : res.per[i] ? 'part' : 'bad'}"><p class="expl">${q.ex}</p>${orig && q.err && q.fr! < q.pts ? `<p class="pathmsg">Na sprawdzianie: ${q.err}</p>` : ''}</div>` : ''}
  </section>`;
}
