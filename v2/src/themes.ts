/* Warianty wyglądu. Każdy wariant to zestaw zmiennych CSS + kilka reguł.
   Po wyborze wariantu dorobimy mu wersję jasną, ciemną i „jak w systemie”. */

type SubjInk = Record<'math' | 'english' | 'hist' | 'przyroda', [string, string]>;
export interface Look { id: string; name: string; desc: string; vars?: Record<string, string>; subj?: SubjInk; css?: string }

const CARDS = '.card,.mode,.subj,.dz,.task,.tchip,.opt';

export const LOOKS: Look[] = [
  { id: 'obecny', name: 'Obecny', desc: 'Spokojne kolory przedmiotów (wygląd jak teraz)' },
  {
    id: 'zeszyt', name: 'Zeszyt w kratkę', desc: 'Jak szkolny zeszyt: kratka, niebieska okładka, odręczne nagłówki',
    vars: { '--paper': '#FBFCFF', '--grid': '#DCE7F7', '--card': '#FFFFFF', '--fg': '#1E2A44', '--muted': '#55627A', '--line': '#C9D6EC', '--bar': '#2A4D8F', '--bar-fg': '#E3ECFA', '--bar-line': 'rgba(255,255,255,.35)', '--bar-on': '#FFFFFF', '--bar-on-fg': '#1E2A44', '--hl': '#FFF3A8', 'color-scheme': 'light' },
    subj: { math: ['#3F51B5', '#E6E9F8'], english: ['#1E6FB8', '#E1EEFA'], hist: ['#A0522D', '#F6E7DD'], przyroda: ['#2E7D4F', '#E1F2E8'] },
    css: `body{background-color:var(--paper);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:22px 22px}
      h1,h2,.subj b,.dz-b b{font-family:var(--hand);font-weight:700;letter-spacing:.01em} h1{font-size:2.7rem} h2{font-size:1.7rem}
      .brand{font-family:var(--hand);font-size:1.7rem;font-weight:700}
      ${CARDS}{border-color:var(--line);box-shadow:0 2px 0 var(--line)} main{border-left:2px solid #F3A6A6;padding-left:18px}`,
  },
  {
    id: 'pastel', name: 'Pastele', desc: 'Miękkie, zaokrąglone, jasne kolory i okrągła czcionka',
    vars: { '--paper': '#FFF6F1', '--grid': '#FFF6F1', '--card': '#FFFFFF', '--fg': '#3B3346', '--muted': '#7A6F86', '--line': '#F0E2EA', '--bar': '#F7DCEB', '--bar-fg': '#5A3E66', '--bar-line': 'rgba(90,62,102,.25)', '--bar-on': '#5A3E66', '--bar-on-fg': '#FFFFFF', '--hl': '#FFE9A8', '--display': "'Fredoka','Baloo 2',system-ui,sans-serif", 'color-scheme': 'light' },
    subj: { math: ['#8A6BD6', '#F1EBFC'], english: ['#4B8BD6', '#E8F1FC'], hist: ['#D0844A', '#FCEEE3'], przyroda: ['#45A577', '#E4F5EC'] },
    css: `body{background:var(--paper)}
      ${CARDS}{border-radius:24px;border-color:transparent;box-shadow:0 8px 24px rgba(150,110,140,.14)}
      .task{border:2px solid var(--ink-soft)} .primary,.ghost,.soft,.nav button,.back,.chip{border-radius:999px}
      .brand,.brand small{color:var(--bar-fg)} h1,h2,.subj b,.dz-b b,.mode b,.tn{font-family:var(--display);font-weight:600}
      .subj::before{height:0} .subj .big-ic,.dz-n{border-radius:50%}`,
  },
  {
    id: 'kosmos', name: 'Kosmos', desc: 'Ciemne niebo z gwiazdami i świecące kolory – dobre wieczorem',
    vars: { '--paper': '#0E1330', '--grid': '#0E1330', '--card': '#182049', '--fg': '#EEF1FF', '--muted': '#A9B2E2', '--line': '#2D3974', '--bar': '#090C24', '--bar-fg': '#C9D1FF', '--bar-line': 'rgba(201,209,255,.25)', '--bar-on': '#FFD86B', '--bar-on-fg': '#0E1330', '--on-ink': '#0E1330', '--hl': '#4B3F8F', '--shadow': 'rgba(0,0,0,.5)',
      '--red': '#FF8F8F', '--red-soft': '#3B1F35', '--green': '#7EE6A8', '--green-soft': '#173A35', '--amber': '#FFC46B', '--amber-soft': '#3A2F24', 'color-scheme': 'dark' },
    subj: { math: ['#B9A0FF', '#2A2560'], english: ['#7CC4FF', '#1D2F5E'], hist: ['#FFC07A', '#3A2B30'], przyroda: ['#7EE6A8', '#173A3C'] },
    css: `body{background-color:var(--paper);background-image:radial-gradient(1.2px 1.2px at 20px 30px,#fff 50%,transparent 52%),radial-gradient(1px 1px at 130px 90px,#cfd6ff 50%,transparent 52%),radial-gradient(1.6px 1.6px at 210px 170px,#fff 50%,transparent 52%),radial-gradient(1px 1px at 70px 200px,#9fb0ff 50%,transparent 52%);background-size:250px 230px}
      ${CARDS}{border-color:var(--line);box-shadow:0 10px 30px rgba(0,0,0,.35)}
      .subj:hover,.mode:hover,.dz:hover{box-shadow:0 0 22px color-mix(in srgb,var(--c,var(--ink)) 45%,transparent)}
      .top{border-bottom:1px solid var(--line)}`,
  },
  {
    id: 'natura', name: 'Las', desc: 'Ciepły beż, zielenie i drewno – spokojnie i naturalnie',
    vars: { '--paper': '#F3EEE2', '--grid': '#F3EEE2', '--card': '#FFFDF7', '--fg': '#2F3A2C', '--muted': '#6A705E', '--line': '#DCD2BE', '--bar': '#3E5C3A', '--bar-fg': '#E8F0DF', '--bar-line': 'rgba(232,240,223,.35)', '--bar-on': '#F2D58A', '--bar-on-fg': '#2F3A2C', '--hl': '#F5E3A3', 'color-scheme': 'light' },
    subj: { math: ['#6B5B95', '#ECE8F3'], english: ['#3D6E8F', '#E3EDF3'], hist: ['#9A5B2E', '#F3E6D9'], przyroda: ['#4C7A3D', '#E5EFDD'] },
    css: `body{background:var(--paper)}
      ${CARDS}{border-radius:10px;border-width:2px;border-color:var(--line);box-shadow:0 3px 0 #E6DCC8}
      .top{border-bottom:5px solid #8DB580} .subj::before{height:12px}`,
  },
  {
    id: 'komiks', name: 'Komiks', desc: 'Grube kontury, mocne kolory i cień jak w komiksie',
    vars: { '--paper': '#FFF8D9', '--grid': '#FFF8D9', '--card': '#FFFFFF', '--fg': '#141414', '--muted': '#4A4A4A', '--line': '#141414', '--bar': '#FFD23F', '--bar-fg': '#141414', '--bar-line': '#141414', '--bar-on': '#141414', '--bar-on-fg': '#FFD23F', '--hl': '#FFE45E', 'color-scheme': 'light' },
    subj: { math: ['#7B2FF7', '#EFE4FF'], english: ['#0068E6', '#DDEBFF'], hist: ['#E35D00', '#FFE6D2'], przyroda: ['#00995F', '#D9F5E8'] },
    css: `body{background-color:var(--paper);background-image:radial-gradient(#EADB8E 1.2px,transparent 1.4px);background-size:14px 14px}
      ${CARDS},.primary,.ghost,.soft,.nav button,.back,.chip,.slot,.step,.srow{border:3px solid #141414;box-shadow:4px 4px 0 #141414}
      .primary:active,.mode:active,.subj:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #141414}
      h1{font-family:'Bangers',var(--display);font-weight:400;letter-spacing:.04em;font-size:2.9rem}
      .brand,.brand small{color:#141414} .brand{font-family:'Bangers',var(--display);font-weight:400;letter-spacing:.06em;font-size:1.6rem}
      .top{border-bottom:3px solid #141414} .subj::before{height:12px;border-bottom:3px solid #141414}`,
  },
];

/** CSS dla wszystkich wariantów: na <html data-look> i na podglądach .lp[data-look] */
export function looksCSS(): string {
  const decl = (v: Record<string, string>) => Object.entries(v).map(([k, x]) => `${k}:${x}`).join(';');
  return LOOKS.filter(l => l.vars).map(l => {
    const root = `html:root[data-look="${l.id}"]`;
    const cs = l.subj ? Object.entries(l.subj).map(([k, [ink, soft]]) => `--c-${k}:${ink};--cs-${k}:${soft}`).join(';') : '';
    let s = `${root},.lp[data-look="${l.id}"]{${decl(l.vars!)};${cs}}\n`;
    if (l.subj) for (const [k, [ink, soft]] of Object.entries(l.subj)) s += `${root}[data-subj="${k}"],.lp[data-look="${l.id}"][data-subj="${k}"]{--ink:${ink};--ink-soft:${soft}}\n`;
    s += `${root}:not([data-subj]),.lp[data-look="${l.id}"]{--ink:${l.subj!.math[0]};--ink-soft:${l.subj!.math[1]}}\n`;
    if (l.css) s += l.css.split('}').map(r => r.trim()).filter(Boolean).map(r => { const [sel, body] = r.split('{'); return sel.split(',').map(x => `html[data-look="${l.id}"] ${x.trim()}`).join(',') + '{' + body + '}'; }).join('\n') + '\n';
    return s;
  }).join('');
}

const KEY = 'sprawdziany-look';
export const getLook = () => { try { return localStorage.getItem(KEY) || 'obecny'; } catch { return 'obecny'; } };
export function setLook(id: string) {
  try { localStorage.setItem(KEY, id); } catch { /* */ }
  applyLook(document, id);
  const fr = document.getElementById('math-frame') as HTMLIFrameElement | null;
  if (fr?.contentDocument) applyLook(fr.contentDocument, id);
}
export function applyLook(doc: Document, id: string) {
  if (id === 'obecny') doc.documentElement.removeAttribute('data-look'); else doc.documentElement.dataset.look = id;
}
export const FONTS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Caveat:wght@600;700&family=Fredoka:wght@500;600;700&family=Bangers&display=swap';
