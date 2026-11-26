/* Szkolne sprawdziany v2 – jeden silnik dla wszystkich przedmiotów.
   Widoki: hub (przedmioty) → przedmiot (działy) → dział (lekcje, umiejętności, sprawdziany) → trening / sprawdzian / sprawdzian szkolny. */
import { SUBJECTS } from '../content/index';
import { P, chk, esc, gradeOf, LV, plural, shuffle } from './core/kit';
import { S, acc, addSession, record, reset, stat, status, streakDays, save, migrateLegacy } from './core/store';
import { VARIANTS, grade as gradeSchool, spts, taskHTML, variantName, type SResult, type Vals } from './core/school';
import { LOOKS, MODES, looksCSS, getLook, getMode, setLook, setMode, applyLook, applyAll, FONTS, type Mode } from './themes';
import { backupText, download, restore, undoRestore, hasPrev, lastBackup } from './core/backup';
import type { Dzial, Gen, Level, Question, SchoolTest, Skill, STask, Subject } from './core/types';

const $ = (s: string) => document.querySelector(s) as HTMLElement;

/* ---------- stan ---------- */
type View = 'hub' | 'subject' | 'dzial' | 'run' | 'result' | 'school' | 'progress' | 'math';
let VIEW: View = 'hub';
let SUBJ: Subject = SUBJECTS[0];
let DZ: Dzial = SUBJ.dzialy[0];
interface Item { skill: Skill; q: Question; level: Level }
interface Run {
  mode: 'train' | 'test'; label: string; skills: Skill[]; n: number; i: number;
  items: Item[]; vals: any[][]; res: ({ ok: boolean[]; pts: number; max: number; msg?: string } | null)[];
  hint: boolean[]; seen: Set<string>; fixedLevel?: Level; done: boolean;
}
let RUN: Run | null = null;
interface School { test: SchoolTest; variant: string; tasks: STask[]; vals: Vals; res: SResult | null }
let SCH: School | null = null;
let CONFIRM = false;
let SETTINGS = false;
let BK = '', BKTXT = '', BKPASTE = false;

/* ---------- pomocnicze ---------- */
const skillsOf = (d: Dzial) => d.lessons.flatMap(l => l.skills);
const playable = (sk: Skill[]) => sk.filter(s => s.gens.length);
function mastery(subj: string, sk: Skill[]): { pct: number | null; top: number; n: number } {
  const a = sk.map(s => acc(subj, s.id)).filter((x): x is number => x != null);
  return { pct: a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 100) : null, top: a.filter(x => x >= 0.8).length, n: sk.length };
}
const bar = (p: number | null) => `<div class="mini"><i class="c-${status(p == null ? null : p / 100)[0]}" style="width:${p ?? 0}%"></i></div>`;

function pickGen(sk: Skill, lv: Level): Gen {
  const ok = sk.gens.filter(g => g.l === lv);
  if (ok.length) return P(ok);
  const lower = sk.gens.filter(g => g.l < lv); if (lower.length) return P(lower);
  return P(sk.gens);
}
function makeItem(sk: Skill, lv: Level, seen: Set<string>): Item {
  let q = pickGen(sk, lv).f(), tries = 0;
  while (seen.has(q.key) && tries++ < 12) q = pickGen(sk, lv).f();
  seen.add(q.key); return { skill: sk, q, level: lv };
}
function gradeQ(q: Question, v: any[]) {
  const ok = q.type === 'num' ? q.fields.map((fd, k) => chk(fd, v[k])) : q.type === 'order' ? q.fields.map((_, k) => v[k] === k) : q.fields.map((fd, k) => v[k] === fd.ans);
  return { ok, pts: ok.filter(Boolean).length, max: q.fields.length };
}
const isEmpty = (q: Question, v: any[]) => q.type === 'one' ? v[0] == null : q.type === 'order' ? v.length < q.fields.length : q.fields.some((_, k) => v[k] == null || String(v[k]).trim() === '');
const verdict = (r: { pts: number; max: number }) => r.pts === r.max ? P(['Dobrze!', 'Świetnie!', 'Brawo!', 'Tak jest!']) : r.pts ? 'Prawie. Część jest dobrze.' : P(['Jeszcze nie.', 'Zobacz, jak to jest:']);

/* ---------- treść zadania ---------- */
function qBody(q: Question, ns: number, v: any[], locked: boolean, show: boolean): string {
  const dis = locked ? ' disabled' : ''; let h = `<div class="q-text">${q.html}</div>`;
  if (q.type === 'one') {
    const a = q.fields[0].ans;
    h += '<div class="opts">' + q.opts!.map((o, i) => { let c = 'opt'; if (v[0] === i) c += ' sel'; if (show && i === a) c += ' right'; if (show && v[0] === i && i !== a) c += ' wrong';
      return `<button class="${c}" data-act="pick" data-ns="${ns}" data-v="${i}"${dis}><span class="lt">${'ABCDE'[i]}</span><span>${o}</span></button>`; }).join('') + '</div>';
  } else if (q.type === 'sort') {
    h += '<div class="sorts">' + q.fields.map((fd, k) => { const x = v[k]; let rc = 'srow'; if (show) rc += x === fd.ans ? ' ok' : ' bad';
      return `<div class="${rc}"><span class="si">${fd.item}</span><span class="cats">${q.cats!.map((c, ci) => { let cc = 'chip'; if (x === ci) cc += ' on'; if (show && ci === fd.ans) cc += ' right'; if (show && x === ci && ci !== fd.ans) cc += ' wrong';
        return `<button class="${cc}" data-act="sort" data-ns="${ns}" data-k="${k}" data-v="${ci}"${dis}>${c}</button>`; }).join('')}</span></div>`; }).join('') + '</div>';
  } else if (q.type === 'num') {
    h += '<div class="sorts">' + q.fields.map((fd, k) => { const x = v[k] == null ? '' : v[k]; const good = show && chk(fd, x); let rc = 'srow nrow'; if (show) rc += good ? ' ok' : ' bad';
      return `<label class="${rc}"><span class="si">${fd.label || ''}</span><input class="num-in" type="text" inputmode="${fd.kind === 'n' ? 'numeric' : 'text'}" autocomplete="off" autocapitalize="off" spellcheck="false" data-nk="${k}" data-ns="${ns}" value="${esc(x)}"${dis} placeholder="${esc(fd.ph || '…')}">${fd.unit ? `<span class="unit">${fd.unit}</span>` : ''}${show && !good ? `<span class="fix">Poprawnie: ${esc(fd.ans)}</span>` : ''}</label>`; }).join('') + '</div>';
  } else {
    h += '<ol class="seq">' + q.fields.map((_, k) => { const it = v[k]; let c = 'slot'; if (it != null) c += ' full'; if (show) c += it === k ? ' ok' : ' bad';
      return `<li class="${c}"><span class="num">${k + 1}</span>${it != null ? `<button class="step" data-act="unord" data-ns="${ns}" data-k="${k}"${dis}>${q.steps![it]}</button>` : '<span class="ph">dotknij elementu poniżej</span>'}${show && it !== k ? `<span class="fix">Powinno być: ${q.steps![k]}</span>` : ''}</li>`; }).join('') + '</ol>';
    if (!locked) { const rest = q.shuf!.filter(i => !v.includes(i)); if (rest.length) h += `<div class="pool">${rest.map(i => `<button class="step" data-act="ord" data-ns="${ns}" data-v="${i}">${q.steps![i]}</button>`).join('')}</div>`; }
  }
  return h;
}

/* ---------- widoki ---------- */
function vHub(): string {
  const st = streakDays();
  return `<section class="hello"><span class="eyebrow">Szkolne sprawdziany · kl. 4</span><h1>Cześć, ${esc(S.name)}!</h1>
    <p class="lead">Wybierz przedmiot. Każdy jest podzielony na działy – tak jak sprawdziany w szkole.${st > 1 ? ` Seria nauki: <b>${st}</b> ${plural(st, 'dzień', 'dni', 'dni')} z rzędu.` : ''}</p></section>
  ${DRAFT_INFO ? `<section class="card draft"><span>⏸ Masz niedokończone ćwiczenie: <b>${esc(DRAFT_INFO.label)}</b></span><div class="row"><button class="primary" data-act="draft">Wróć do niego</button><button class="soft" data-act="draft-del">Usuń</button></div></section>` : ''}
  <section class="subjects">${SUBJECTS.map(s => { const m = mastery(s.id, s.dzialy.flatMap(skillsOf)); const tests = s.dzialy.reduce((a, d) => a + (d.schoolTests?.length || 0), 0);
    return `<button class="subj" data-act="subj" data-v="${s.id}" style="--c:var(--c-${s.id});--cs:var(--cs-${s.id})"><span class="big-ic">${s.icon}</span><b>${s.name}</b><small>${s.desc}</small>
      <span class="meta">${s.dzialy.length} ${plural(s.dzialy.length, 'dział', 'działy', 'działów')}${tests ? ` · ${tests} ${plural(tests, 'sprawdzian', 'sprawdziany', 'sprawdzianów')} z klasy` : ''}${m.pct != null ? ` · ${m.pct}%` : ''}</span></button>`; }).join('')}</section>`;
}
function vSubject(): string {
  return `<section class="hello"><span class="eyebrow">${SUBJ.name} · kl. 4</span><h1>Działy</h1><p class="lead">Dział to zakres jednego sprawdzianu. W środku są lekcje (zakres kartkówek) i umiejętności do ćwiczenia.</p></section>
  <section class="dz-list">${SUBJ.dzialy.map((d, i) => { const sk = skillsOf(d), m = mastery(SUBJ.id, sk);
    return `<button class="dz" data-act="dzial" data-v="${d.id}"><span class="dz-n">${i + 1}</span><span class="dz-b"><b>${d.name}</b><small>${d.pages ? d.pages + ' · ' : ''}${d.lessons.length > 1 ? `${d.lessons.length} lekcji · ` : ''}${sk.length} ${plural(sk.length, 'umiejętność', 'umiejętności', 'umiejętności')}${d.schoolTests?.length ? ' · 📝 sprawdzian z klasy' : ''}</small>${d.legacy ? '' : bar(m.pct)}</span></button>`; }).join('')}</section>`;
}
function skillChip(sk: Skill, act: boolean): string {
  const a = acc(SUBJ.id, sk.id), [c, l] = status(a);
  return `<${act ? 'button' : 'div'} class="tchip"${act ? ` data-act="skill" data-v="${sk.id}"` : ''}><span class="nm">${sk.name}</span>${act ? `<span class="st ${c}">${l}</span>${bar(a == null ? null : Math.round(a * 100))}` : ''}</${act ? 'button' : 'div'}>`;
}
function vDzial(): string {
  const d = DZ, sk = skillsOf(d), can = playable(sk).length > 0;
  const tests = d.schoolTests || [];
  const best = (t: SchoolTest, k: string) => S.school[`${t.id}/${k}`];
  return `<section class="hello"><span class="eyebrow">${SUBJ.name} · dział${d.pages ? ' · ' + d.pages : ''}</span><h1>${d.name}</h1>
    ${d.tentative ? `<p class="note">⚠ ${d.tentative}</p>` : ''}</section>
  ${can ? `<section class="modes"><button class="mode" data-act="dtrain"><span class="eyebrow">Trening</span><b>Cały dział, krok po kroku</b><small>Po każdym zadaniu wyjaśnienie. Poziom rośnie sam.</small></button>
    <button class="mode" data-act="dtest"><span class="eyebrow">Próbny sprawdzian</span><b>Z całego działu, ocena 1–6</b><small>Wynik dopiero po oddaniu – jak w szkole.</small></button>
    ${sk.some(s => (acc(SUBJ.id, s.id) ?? 1) < 0.8) ? `<button class="mode" data-act="dweak"><span class="eyebrow">Słabe strony</span><b>Zadania z tego, co sprawia kłopot</b><small>${sk.filter(s => (acc(SUBJ.id, s.id) ?? 1) < 0.8).slice(0, 3).map(s => s.name).join(' · ')}</small></button>` : ''}</section>` : ''}
  ${d.legacy ? `<section class="card stack"><p>Trening i sprawdziany z tego działu są na razie w module matematyki (przeniosę je tu w kolejnym etapie).</p><div class="row"><button class="primary" data-act="math">Otwórz moduł matematyki</button></div></section>` : ''}
  ${tests.map(t => `<section class="card stack sq-card"><div class="sq-head"><span class="sym">📝</span><div><b>Sprawdzian z klasy: ${t.title}</b><small>${t.info} · ${new Date(t.date).toLocaleDateString('pl-PL')}</small></div></div>
    ${t.result ? `<p class="sq-was">Wynik w szkole: <b>${spts(t.result.pts)} / ${t.max} p. (${t.result.pct}%)</b> – ocena <b>${t.result.grade}</b>. ${t.result.notes}</p>` : ''}
    <div class="sq-vers">${VARIANTS.map(k => `<button class="mode" data-act="school" data-t="${t.id}" data-v="${k}"><span class="eyebrow">${variantName(k)}${k === 'rand' ? ' 🎲' : ''}</span><b>${k === 'orig' ? 'Te same pytania' : k === 'rand' ? 'Za każdym razem nowy' : 'Inne liczby'}</b><small>${best(t, k) != null ? `najlepiej: ${best(t, k)}%` : 'jeszcze nie'}</small></button>`).join('')}</div></section>`).join('')}
  ${d.lessons.map(l => `<section class="stack"><div class="row" style="justify-content:space-between"><h2>${l.name}</h2>${playable(l.skills).length && d.lessons.length > 1 ? `<button class="soft" data-act="quiz" data-v="${l.id}">Kartkówka z lekcji</button>` : ''}</div>
    <div class="tmap">${l.skills.map(s => skillChip(s, s.gens.length > 0)).join('')}</div></section>`).join('')}`;
}

function startRun(mode: 'train' | 'test', label: string, skills: Skill[], n: number, fixedLevel?: Level) {
  skills = playable(skills); if (!skills.length) return;
  let order: Skill[] = [];
  while (order.length < n) { const s = shuffle(skills); if (order.length && s.length > 1 && s[0] === order[order.length - 1]) s.push(s.shift()!); order = order.concat(s); }
  order = order.slice(0, n);
  RUN = { mode, label, skills, n, i: 0, items: [], vals: [], res: [], hint: [], seen: new Set(), fixedLevel, done: false };
  if (mode === 'test') { RUN.items = order.map(s => makeItem(s, fixedLevel || 2, RUN!.seen)); RUN.vals = order.map(() => []); RUN.res = order.map(() => null); }
  else { (RUN as any).order = order; ensure(0); }
  VIEW = 'run'; render(); scrollTo(0, 0);
}
function ensure(i: number) { const r = RUN!; if (!r.items[i]) { const s: Skill = (r as any).order[i]; r.items[i] = makeItem(s, r.fixedLevel || stat(SUBJ.id, s.id).level, r.seen); r.vals[i] = []; r.res[i] = null; } }

function vRun(): string {
  const r = RUN!;
  if (r.mode === 'test') {
    return `<section class="hello"><span class="eyebrow">${SUBJ.name} · próbny sprawdzian</span><h1>${r.label}</h1><p class="lead">Rozwiąż wszystkie zadania, a potem oddaj sprawdzian. Wynik i ocena pojawią się po oddaniu.</p></section>
    ${r.items.map((it, i) => `<section class="card task"><div class="task-h"><span class="tn">Zadanie ${i + 1}.</span><span class="pts">(..... / ${it.q.fields.length} p.)</span><span class="tag">${it.skill.name}</span></div>${qBody(it.q, i, r.vals[i], false, false)}</section>`).join('')}
    <section class="acts">${CONFIRM ? `<span class="warn">Nie wszystkie zadania są rozwiązane. Oddać mimo to?</span><button class="primary" data-act="handok">Oddaj</button><button class="ghost" data-act="handno">Wracam</button>` : `<button class="primary" data-act="hand">Oddaj sprawdzian</button>`}<button class="soft" data-act="dzial" data-v="${DZ.id}">Przerwij</button></section>`;
  }
  const it = r.items[r.i], res = r.res[r.i];
  return `<section class="run-top"><span class="t">${r.label}</span><span class="cnt">${r.i + 1} / ${r.n}</span></section><div class="bar"><i style="width:${(r.i + (res ? 1 : 0)) / r.n * 100}%"></i></div>
  <section class="card task"><div class="task-h"><span class="tn">Zadanie ${r.i + 1}.</span><span class="tag">${it.skill.name} · ${LV[it.level]}</span></div>
    ${qBody(it.q, r.i, r.vals[r.i], !!res, !!res)}
    ${r.hint[r.i] && !res ? `<p class="hint"><b>Podpowiedź:</b> ${it.q.hint || it.skill.hint || ''}</p>` : ''}
    ${res ? `<div class="fb ${res.pts === res.max ? 'ok' : res.pts ? 'part' : 'bad'}" role="status"><p class="fb-v">${verdict(res)}</p><p class="expl">${it.q.expl}</p>${res.msg ? `<p class="lvmsg">${res.msg}</p>` : ''}</div>` : ''}
    <div class="acts">${res ? `<button class="primary" data-act="next">${r.i + 1 < r.n ? 'Następne zadanie' : 'Zobacz wynik'}</button>` : `<button class="primary" data-act="check">Sprawdź</button>${r.hint[r.i] || !(it.q.hint || it.skill.hint) ? '' : '<button class="ghost" data-act="hint">Podpowiedź</button>'}`}<button class="soft sp" data-act="dzial" data-v="${DZ.id}">Przerwij</button></div>
  </section>`;
}
function finish() {
  const r = RUN!; r.done = true;
  if (r.mode === 'test') r.items.forEach((it, i) => { const g = gradeQ(it.q, r.vals[i]); r.res[i] = g; record(SUBJ.id, it.skill.id, g.pts / g.max, false); });
  const pts = r.res.reduce((a, x) => a + (x ? x.pts : 0), 0), max = r.res.reduce((a, x) => a + (x ? x.max : 0), 0);
  addSession({ subj: SUBJ.id, dzial: DZ.id, mode: r.mode, label: r.label, pts, max, pct: max ? Math.round(pts / max * 100) : 0 });
  VIEW = 'result'; render(); scrollTo(0, 0);
}
function vResult(): string {
  const r = RUN!; const pts = r.res.reduce((a, x) => a + (x ? x.pts : 0), 0), max = r.res.reduce((a, x) => a + (x ? x.max : 0), 0);
  const pct = max ? Math.round(pts / max * 100) : 0, [g, gl] = gradeOf(pct);
  const weak = [...new Set(r.items.filter((_, i) => r.res[i] && r.res[i]!.pts < r.res[i]!.max).map(it => it.skill))];
  return `<section class="hello"><span class="eyebrow">${SUBJ.name} · ${r.mode === 'test' ? 'wynik sprawdzianu' : 'koniec treningu'}</span><h1>${r.label}</h1></section>
  <section class="card sq-res"><div><span class="eyebrow">Wynik</span><b class="sq-big">${pts} / ${max} p.</b><span>${pct}%${r.mode === 'test' ? ` · ocena <b>${g}</b> (${gl})` : ''}</span></div>
    <p>${weak.length ? `Do poćwiczenia: ${weak.map(s => s.name).join(', ')}.` : 'Wszystko dobrze – brawo!'}</p>
    <div class="row">${weak.length ? `<button class="primary" data-act="fix">Popraw słabe umiejętności</button>` : ''}<button class="ghost" data-act="dzial" data-v="${DZ.id}">Wróć do działu</button></div></section>
  ${r.mode === 'test' ? r.items.map((it, i) => { const x = r.res[i]!; return `<section class="card task"><div class="task-h"><span class="tn">Zadanie ${i + 1}.</span><span class="pts">(<span class="got">${x.pts}</span> / ${x.max} p.)</span><span class="tag">${it.skill.name}</span></div>${qBody(it.q, i, r.vals[i], true, true)}<div class="fb ${x.pts === x.max ? 'ok' : x.pts ? 'part' : 'bad'}"><p class="expl">${it.q.expl}</p></div></section>`; }).join('') : ''}`;
}

function openSchool(tid: string, variant: string) {
  const t = SUBJ.dzialy.flatMap(d => d.schoolTests || []).find(x => x.id === tid)!;
  SCH = { test: t, variant, tasks: t.build(variant).tasks, vals: {}, res: null }; VIEW = 'school'; render(); scrollTo(0, 0);
}
function vSchool(): string {
  const s = SCH!, t = s.test, res = s.res, orig = s.variant === 'orig';
  const top = res ? (() => { const [g, gl] = gradeOf(res.pct); const bad = s.tasks.filter((q, i) => res.per[i] < q.pts).map(q => q.n);
    const weakNames = res.weak.map(id => skillsOf(DZ).find(x => x.id === id)?.name || id);
    return `<section class="card sq-res"><div><span class="eyebrow">Wynik</span><b class="sq-big">${spts(res.tot)} / ${t.max} p.</b><span>${res.pct}% · ocena <b>${g}</b> (${gl})${orig && t.result ? ` · w szkole było ${spts(t.result.pts)} p.` : ''}</span></div>
      <p>${bad.length ? `Popraw zadania: ${bad.join(', ')}. Umiejętności do poćwiczenia: ${weakNames.join(', ')}.` : 'Wszystko dobrze – brawo!'}</p>
      <div class="row"><button class="primary" data-act="school" data-t="${t.id}" data-v="rand">Nowy losowy zestaw</button><button class="ghost" data-act="school" data-t="${t.id}" data-v="${s.variant}">${s.variant === 'rand' ? 'Nowe liczby' : 'Jeszcze raz'}</button><button class="ghost" data-act="dzial" data-v="${DZ.id}">Wróć do działu</button></div></section>`; })() : '';
  return `<section class="hello"><span class="eyebrow">${t.title} · ${variantName(s.variant)}</span><h1>${orig ? 'Sprawdzian z klasy' : 'Sprawdzian do ćwiczeń'}</h1>
    <p class="lead">${res ? 'Zielone – dobrze, czerwone – popraw. Obok jest poprawna odpowiedź, pod zadaniem wyjaśnienie.' : 'Rozwiąż wszystkie zadania jak w szkole (obliczenia na kartce), a na końcu kliknij „Sprawdź sprawdzian”.'}</p></section>
  ${top}${s.tasks.map((q, i) => taskHTML(q, i, s.vals, res, orig)).join('')}
  ${res ? '' : `<section class="acts"><button class="primary" data-act="scheck">Sprawdź sprawdzian</button><button class="ghost" data-act="dzial" data-v="${DZ.id}">Wróć</button></section>`}`;
}
function gradeSchoolNow() {
  const s = SCH!; s.res = gradeSchool(s.tasks, s.vals, s.test.max);
  const k = `${s.test.id}/${s.variant}`; S.school[k] = Math.max(S.school[k] || 0, s.res.pct); save();
  addSession({ subj: SUBJ.id, dzial: DZ.id, mode: 'school', label: `${s.test.title} – ${variantName(s.variant)}`, pts: s.res.tot, max: s.test.max, pct: s.res.pct });
  render(); scrollTo(0, 0);
}

function vProgress(): string {
  const MODE: Record<string, string> = { train: 'Trening', test: 'Sprawdzian', school: 'Sprawdzian z klasy', quiz: 'Kartkówka' };
  return `<section class="hello"><span class="eyebrow">Postępy</span><h1>Jak idzie nauka</h1><p class="lead">Procent to średnia z ostatnich prób w każdej umiejętności.</p>
    <label class="row">Imię: <input id="name-in" class="name-in" value="${esc(S.name)}"></label></section>
  ${SUBJECTS.map(s => `<section class="card stack"><h2>${s.icon} ${s.name}</h2>${s.dzialy.filter(d => !d.legacy || d.schoolTests?.length).map(d => { const m = mastery(s.id, skillsOf(d));
    return `<div class="pg-row"><span>${d.name}</span><b>${d.legacy ? (d.schoolTests || []).map(t => VARIANTS.map(k => S.school[`${t.id}/${k}`]).filter(x => x != null).length + ' podejść do sprawdzianu').join('') : m.pct == null ? 'jeszcze nie ćwiczone' : `${m.pct}% · ${m.top}/${m.n} opanowane`}</b></div>`; }).join('')}</section>`).join('')}
  <section class="card stack"><h2>Ostatnie sesje</h2>${S.sessions.length ? S.sessions.slice(0, 12).map(x => `<div class="pg-row"><span>${new Date(x.d).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })} · ${MODE[x.mode]} · ${esc(x.label)}</span><b>${spts(x.pts)}/${x.max} · ${x.pct}%</b></div>`).join('') : '<p class="note">Jeszcze nic.</p>'}</section>
  <section class="row">${CONFIRM ? `<span class="warn">Na pewno wyczyścić wszystkie wyniki?</span><button class="danger primary" data-act="resetok">Tak, wyczyść</button><button class="ghost" data-act="resetno">Nie</button>` : '<button class="soft" data-act="reset">Wyczyść wyniki</button>'}</section>`;
}

function vMath(): string { return '<div id="embed-wrap"></div>'; }
function mountMath() {
  const w = $('#embed-wrap'); const srcEl = document.getElementById('math-src'); if (!w || !srcEl) return;
  const src = srcEl.textContent!.replace(/<%%\/S/g, '</scr' + 'ipt').replace(/<%%S/g, '<scr' + 'ipt');
  const fr = document.createElement('iframe'); fr.id = 'math-frame'; fr.title = 'Matematyka';
  fr.srcdoc = src.replace('</head>', `<link rel="stylesheet" href="${FONTS}"><style>.top .brand{display:none}\n${looksCSS()}</style></head>`);
  fr.addEventListener('load', () => { if (fr.contentDocument) applyLook(fr.contentDocument, true); });
  w.appendChild(fr); fitMath();
}
function fitMath() { const fr = document.getElementById('math-frame'); if (fr) fr.style.height = Math.max(320, innerHeight - $('.top').getBoundingClientRect().bottom) + 'px'; }
addEventListener('resize', fitMath);

/* ---------- zapis rozpoczętych ćwiczeń (zostają po odświeżeniu i aktualizacji) ---------- */
const DRAFT = 'sprawdziany-draft';
const findSkill = (id: string) => SUBJ.dzialy.flatMap(skillsOf).find(s => s.id === id)!;
function saveDraft() {
  try {
    if (RUN && !RUN.done) localStorage.setItem(DRAFT, JSON.stringify({ kind: 'run', subj: SUBJ.id, dz: DZ.id, d: Date.now(), run: { ...RUN, skills: RUN.skills.map(s => s.id), order: ((RUN as any).order || []).map((s: Skill) => s.id), items: RUN.items.map(it => it && { skill: it.skill.id, q: it.q, level: it.level }), seen: [...RUN.seen] } }));
    else if (SCH && !SCH.res) localStorage.setItem(DRAFT, JSON.stringify({ kind: 'school', subj: SUBJ.id, dz: DZ.id, d: Date.now(), sch: { test: SCH.test.id, variant: SCH.variant, tasks: SCH.tasks, vals: SCH.vals } }));
    else if (VIEW === 'result' || (VIEW === 'school' && SCH?.res)) localStorage.removeItem(DRAFT);
  } catch { /* */ }
}
let DRAFT_INFO: { label: string; data: any } | null = null;
function loadDraft() {
  try { const d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); if (!d) return; const s = SUBJECTS.find(x => x.id === d.subj); if (!s) return;
    const label = d.kind === 'run' ? `${s.name}: ${d.run.label} (${d.run.mode === 'test' ? 'sprawdzian' : `zadanie ${d.run.i + 1}/${d.run.n}`})` : `${s.name}: sprawdzian z klasy`;
    DRAFT_INFO = { label, data: d }; } catch { DRAFT_INFO = null; }
}
function clearDraft() { DRAFT_INFO = null; try { localStorage.removeItem(DRAFT); } catch { /* */ } }
function resumeDraft() {
  const d = DRAFT_INFO?.data; if (!d) return;
  try {
    SUBJ = SUBJECTS.find(x => x.id === d.subj)!; DZ = SUBJ.dzialy.find(x => x.id === d.dz) || SUBJ.dzialy[0];
    if (d.kind === 'run') { const r = d.run; RUN = { ...r, skills: r.skills.map(findSkill), items: r.items.map((it: any) => it && { skill: findSkill(it.skill), q: it.q, level: it.level }), seen: new Set(r.seen) }; (RUN as any).order = r.order.map(findSkill); VIEW = 'run'; }
    else { const t = SUBJ.dzialy.flatMap(x => x.schoolTests || []).find(x => x.id === d.sch.test)!; SCH = { test: t, variant: d.sch.variant, tasks: d.sch.tasks, vals: d.sch.vals, res: null }; VIEW = 'school'; }
    DRAFT_INFO = null; render(); scrollTo(0, 0);
  } catch { clearDraft(); render(); }
}
function doRestore(text: string) {
  const r = restore(text);
  if (r.ok) { BK = `Wczytano kopię z ${new Date(r.date).toLocaleString('pl-PL')}. Odświeżam…`; renderSettings(); setTimeout(() => location.reload(), 900); }
  else { BK = r.error; renderSettings(); }
}

/* ---------- ustawienia (panel z prawej) ---------- */
function vSettings(): string {
  const cur = getLook();
  const tests = SUBJECTS.flatMap(s => s.dzialy.flatMap(d => (d.schoolTests || []).map(t => ({ s, d, t }))));
  return `<div class="scrim" data-act="settings-close"></div>
  <aside class="drawer" role="dialog" aria-label="Ustawienia">
    <div class="drawer-h"><b>Ustawienia</b><button class="soft" data-act="settings-close" aria-label="Zamknij">✕</button></div>
    <section class="stack"><h2>Wygląd</h2><p class="note">Wybierz tryb i wariant kolorystyczny – zmiana działa od razu i zostaje zapamiętana.</p>
      <div class="seg" role="group" aria-label="Tryb">${MODES.map(([m, n]) => `<button class="${getMode() === m ? 'on' : ''}" data-act="mode" data-v="${m}" aria-pressed="${getMode() === m}">${n}</button>`).join('')}</div>
      <div class="lp-grid">${LOOKS.map(l => `<button class="lp${cur === l.id ? ' on' : ''}" data-look="${l.id}" data-act="look" data-v="${l.id}" aria-pressed="${cur === l.id}">
        <span class="lp-prev"><span class="lp-bar"></span><span class="lp-card"><i></i><i></i><em></em></span></span>
        <b>${l.name}${cur === l.id ? ' ✓' : ''}</b><small>${l.desc}</small></button>`).join('')}</div></section>
    <section class="stack"><h2>Materiały w aplikacji</h2><p class="note">Zakres książek i działów, które już są – zanim dodasz nowe zdjęcia, sprawdź tu, żeby się nie dublowały.</p>
      ${SUBJECTS.map(s => `<div class="mat"><b>${s.icon} ${s.name}</b><ul>${s.dzialy.map(d => `<li><span>${d.name}${d.pages ? ` <small>(${d.pages})</small>` : ''}</span><small>${d.lessons.length > 1 ? d.lessons.length + ' lekcji · ' : ''}${skillsOf(d).length} umiej.${d.tentative ? ' · ⚠ wstępne' : ''}</small></li>`).join('')}</ul></div>`).join('')}</section>
    <section class="stack"><h2>Sprawdziany z klasy</h2>
      ${tests.length ? tests.map(({ s, d, t }) => `<button class="mat-t" data-act="settings-test" data-s="${s.id}" data-d="${d.id}"><span>${s.icon} <b>${t.title}</b><small>${new Date(t.date).toLocaleDateString('pl-PL')} · ${t.info}</small></span>${t.result ? `<em>${spts(t.result.pts)}/${t.max} p. · ocena ${t.result.grade}</em>` : ''}</button>`).join('') : '<p class="note">Jeszcze żadnego.</p>'}</section>
    <section class="stack"><h2>Kopia i synchronizacja</h2>
      <p class="note">Wyniki i rozpoczęte ćwiczenia zapisują się same na tym urządzeniu i zostają po aktualizacji aplikacji. Kopia służy do przeniesienia ich na inny telefon lub komputer albo do odtworzenia.${lastBackup() ? ` Ostatnia kopia: ${new Date(lastBackup()!).toLocaleDateString('pl-PL')}.` : ''}</p>
      <div class="row"><button class="primary" data-act="bk-file">⬇ Pobierz kopię (plik)</button><button class="ghost" data-act="bk-pick">⬆ Wczytaj z pliku</button></div>
      <div class="row"><button class="soft" data-act="bk-copy">Kopiuj jako tekst</button><button class="soft" data-act="bk-paste">Wklej kopię (tekst)</button>${hasPrev() ? '<button class="soft" data-act="bk-undo">↶ Cofnij wczytanie</button>' : ''}</div>
      <input type="file" id="bk-file" accept=".json,application/json,text/plain" hidden>
      ${BKPASTE ? '<textarea id="bk-in" class="bk-in" rows="4" placeholder="Wklej tutaj tekst kopii"></textarea><div class="row"><button class="primary" data-act="bk-load">Wczytaj</button></div>' : ''}
      ${BKTXT ? `<textarea class="bk-in" rows="4" readonly>${esc(BKTXT)}</textarea>` : ''}
      ${BK ? `<p class="okmsg">${esc(BK)}</p>` : ''}</section>
    <section class="stack"><h2>Stara wersja</h2><p class="note">Poprzedni wygląd aplikacji jest nadal dostępny (te same wyniki matematyki).</p><a class="soft" href="stara/">Otwórz starą wersję</a></section>
  </aside>`;
}
function renderSettings() {
  let el = document.getElementById('settings-root');
  if (!el) { el = document.createElement('div'); el.id = 'settings-root'; document.body.appendChild(el); }
  el.innerHTML = SETTINGS ? vSettings() : '';
  document.body.classList.toggle('drawer-open', SETTINGS);
}

/* ---------- render i nawigacja ---------- */
const PARENT: Record<View, View> = { hub: 'hub', subject: 'hub', dzial: 'subject', run: 'dzial', result: 'dzial', school: 'dzial', progress: 'hub', math: 'dzial' };
function render() {
  const inSubj = VIEW !== 'hub' && VIEW !== 'progress';
  if (inSubj) document.documentElement.dataset.subj = SUBJ.id; else delete document.documentElement.dataset.subj;
  $('#back').hidden = VIEW === 'hub';
  $('#brand').innerHTML = inSubj ? `<span class="ic">${SUBJ.icon}</span> ${SUBJ.name} <small>kl. 4</small>` : '<span class="ic">📚</span> Szkolne sprawdziany <small>kl. 4</small>';
  document.querySelectorAll('#nav button').forEach(b => b.classList.toggle('on', (b as HTMLElement).dataset.v === VIEW));
  const V: Record<View, () => string> = { hub: vHub, subject: vSubject, dzial: vDzial, run: vRun, result: vResult, school: vSchool, progress: vProgress, math: vMath };
  $('#main').innerHTML = V[VIEW]();
  $('#main').classList.toggle('wide', VIEW === 'math');
  if (VIEW === 'math') mountMath();
  renderSettings();
  saveDraft();
}
function go(v: View) { CONFIRM = false; VIEW = v; render(); scrollTo(0, 0); }

function act(a: string, el: HTMLElement) {
  const v = el.dataset.v!, ns = el.dataset.ns != null ? +el.dataset.ns : -1;
  const vals = () => RUN!.vals[ns];
  switch (a) {
    case 'go': go(v as View); break;
    case 'settings': SETTINGS = !SETTINGS; renderSettings(); break;
    case 'settings-close': SETTINGS = false; renderSettings(); break;
    case 'look': setLook(v); renderSettings(); break;
    case 'mode': setMode(v as Mode); renderSettings(); break;
    case 'bk-file': download(); BK = 'Kopia pobrana. Zachowaj plik – możesz go wczytać na innym urządzeniu.'; renderSettings(); break;
    case 'bk-copy': { const t = backupText(); const done = (ok: boolean) => { BK = ok ? 'Skopiowano. Wklej tekst np. w wiadomości do siebie, a na innym urządzeniu użyj „Wklej kopię”.' : 'Nie udało się skopiować – zaznacz tekst poniżej ręcznie.'; BKTXT = ok ? '' : t; renderSettings(); };
      try { navigator.clipboard.writeText(t).then(() => done(true), () => done(false)); } catch { done(false); } break; }
    case 'bk-paste': BKPASTE = !BKPASTE; BK = ''; renderSettings(); break;
    case 'bk-load': { const ta = document.getElementById('bk-in') as HTMLTextAreaElement; doRestore(ta?.value || ''); break; }
    case 'bk-pick': (document.getElementById('bk-file') as HTMLInputElement).click(); break;
    case 'bk-undo': if (undoRestore()) location.reload(); break;
    case 'draft': resumeDraft(); break;
    case 'draft-del': clearDraft(); render(); break;
    case 'settings-test': SETTINGS = false; SUBJ = SUBJECTS.find(s => s.id === el.dataset.s)!; DZ = SUBJ.dzialy.find(d => d.id === el.dataset.d)!; go('dzial'); break;
    case 'back': go(PARENT[VIEW]); break;
    case 'subj': SUBJ = SUBJECTS.find(s => s.id === v)!; go(SUBJ.dzialy.length === 1 ? (DZ = SUBJ.dzialy[0], 'dzial') : 'subject'); break;
    case 'dzial': DZ = SUBJ.dzialy.find(d => d.id === v) || DZ; RUN = null; SCH = null; go('dzial'); break;
    case 'dtrain': startRun('train', DZ.name, skillsOf(DZ), 10); break;
    case 'dtest': { const sk = playable(skillsOf(DZ)); startRun('test', `Próbny sprawdzian: ${DZ.name}`, sk, Math.min(15, Math.max(8, sk.length))); break; }
    case 'dweak': { const sk = skillsOf(DZ).filter(s => (acc(SUBJ.id, s.id) ?? 1) < 0.8); startRun('train', 'Słabe strony', sk.length ? sk : skillsOf(DZ), 10); break; }
    case 'quiz': { const l = DZ.lessons.find(x => x.id === v)!; startRun('test', `Kartkówka: ${l.name}`, l.skills, Math.min(8, Math.max(5, playable(l.skills).length * 2))); break; }
    case 'skill': { const s = skillsOf(DZ).find(x => x.id === v)!; startRun('train', s.name, [s], 8); break; }
    case 'fix': { const weak = [...new Set(RUN!.items.filter((_, i) => RUN!.res[i] && RUN!.res[i]!.pts < RUN!.res[i]!.max).map(it => it.skill))]; startRun('train', 'Poprawa', weak, Math.max(6, weak.length * 2)); break; }
    case 'math': go('math'); break;
    case 'school': openSchool(el.dataset.t!, v); break;
    case 'scheck': gradeSchoolNow(); break;
    case 'pick': vals()[0] = +v; render(); break;
    case 'sort': vals()[+el.dataset.k!] = +v; render(); break;
    case 'ord': vals().push(+v); render(); break;
    case 'unord': vals().splice(+el.dataset.k!); render(); break;
    case 'hint': RUN!.hint[RUN!.i] = true; render(); break;
    case 'check': {
      const r = RUN!, it = r.items[r.i];
      if (isEmpty(it.q, r.vals[r.i])) { const w = document.querySelector('.task .acts'); if (w && !w.querySelector('.warn')) w.insertAdjacentHTML('beforeend', '<span class="warn">Uzupełnij odpowiedź.</span>'); return; }
      const g = gradeQ(it.q, r.vals[r.i]); const msg = record(SUBJ.id, it.skill.id, g.pts / g.max, !r.fixedLevel);
      r.res[r.i] = { ...g, msg }; render(); break;
    }
    case 'next': { const r = RUN!; if (r.i + 1 >= r.n) { finish(); break; } r.i++; ensure(r.i); render(); scrollTo(0, 0); break; }
    case 'hand': { const r = RUN!; if (r.items.some((it, i) => isEmpty(it.q, r.vals[i]))) { CONFIRM = true; render(); } else finish(); break; }
    case 'handok': CONFIRM = false; finish(); break;
    case 'handno': CONFIRM = false; render(); break;
    case 'reset': CONFIRM = true; render(); break;
    case 'resetno': CONFIRM = false; render(); break;
    case 'resetok': CONFIRM = false; reset(); location.reload(); break;
  }
}

/* ---------- zdarzenia ---------- */
document.addEventListener('click', e => { const el = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null; if (!el || (el as HTMLButtonElement).disabled) return; act(el.dataset.act!, el); });
document.addEventListener('input', e => {
  const el = e.target as HTMLInputElement;
  if (el.id === 'name-in') { S.name = el.value.trim() || 'Franek'; save(); return; }
  if (el.dataset.sf != null && SCH) SCH.vals[el.dataset.sf] = el.value;
  if (el.dataset.nk != null && RUN) RUN.vals[+el.dataset.ns!][+el.dataset.nk] = el.value;
  if (el.dataset.sf != null || el.dataset.nk != null) saveDraft();
});
document.addEventListener('change', e => {
  const el = e.target as HTMLInputElement;
  if (el.dataset.sf != null && SCH) { SCH.vals[el.dataset.sf] = el.value; saveDraft(); }
  if (el.id === 'bk-file' && el.files?.[0]) { const f = el.files[0]; f.text().then(doRestore); el.value = ''; }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && SETTINGS) { SETTINGS = false; renderSettings(); return; }
  const el = e.target as HTMLInputElement; if (e.key !== 'Enter' || el.tagName !== 'INPUT') return;
  const all = [...document.querySelectorAll('#main input:not([disabled]),#main select:not([disabled])')] as HTMLElement[];
  const ix = all.indexOf(el); e.preventDefault();
  if (ix >= 0 && ix < all.length - 1) all[ix + 1].focus();
  else if (VIEW === 'run' && RUN?.mode === 'train' && !RUN.res[RUN.i]) act('check', el);
});

const lookStyle = document.createElement('style'); lookStyle.id = 'looks'; lookStyle.textContent = looksCSS(); document.head.appendChild(lookStyle);
migrateLegacy();
applyAll();
loadDraft();
render();
