/* Wygląd: 6 wariantów kolorystycznych × 3 tryby (jasny, ciemny, jak w systemie).
   Wariant → <html data-look="...">, tryb → <html data-scheme="light|dark"> (dla „systemowego” liczony z prefers-color-scheme). */

type Subj = 'math' | 'english' | 'hist' | 'przyroda';
/** [kolor przedmiotu, tło jasne, (opcjonalnie) kolor paska] */
type Ink = [string, string, string?];
interface Palette { vars: Record<string, string>; hub: Ink; subj: Record<Subj, Ink> }
export interface Look { id: string; name: string; desc: string; light: Palette; dark: Palette; css?: string }

const LIGHT_STATUS = { '--red': '#B8372D', '--red-soft': '#FBE8E5', '--green': '#1D7A4C', '--green-soft': '#E0F2E7', '--amber': '#97620F', '--amber-soft': '#FBF1DA', '--shadow': 'rgba(38,50,58,.10)', 'color-scheme': 'light' };
const DARK_STATUS = { '--red': '#FF8B80', '--red-soft': '#3A1F22', '--green': '#6CD29A', '--green-soft': '#16321F', '--amber': '#F0BC5A', '--amber-soft': '#382B15', '--shadow': 'rgba(0,0,0,.45)', 'color-scheme': 'dark' };
const CARDS = '.card,.mode,.subj,.dz,.task,.tchip,.opt';

export const LOOKS: Look[] = [
  {
    id: 'obecny', name: 'Obecny', desc: 'Spokojne kolory przedmiotów (pierwotny wygląd)',
    light: { vars: { '--paper': '#F5F8F6', '--grid': '#E4EBE6', '--card': '#FFFFFF', '--fg': '#26323A', '--muted': '#5B6870', '--line': '#D4DED8', '--hl': '#FFF0B3', '--bar-fg': '#E8F0EE', '--bar-line': 'rgba(255,255,255,.35)', '--bar-on': '#FFFFFF', '--bar-on-fg': '#26323A', '--on-ink': '#FFFFFF' },
      hub: ['#2F6F6B', '#E1F0EE', '#24504D'], subj: { hist: ['#8A5A2B', '#F3E8DA', '#5E3E1E'], przyroda: ['#2E7549', '#E1F1E6', '#1F5233'], english: ['#3F65AE', '#E3EBF8', '#2C4A80'], math: ['#6F52A5', '#ECE6F6', '#4B3A78'] } },
    dark: { vars: { '--paper': '#141A1E', '--grid': '#1B2328', '--card': '#1B2328', '--fg': '#E4EBEA', '--muted': '#9AA8AB', '--line': '#2D3A40', '--hl': '#5E5014', '--bar-fg': '#D4E2E0', '--bar-line': 'rgba(255,255,255,.2)', '--bar-on': '#F2F6F5', '--bar-on-fg': '#141A1E', '--on-ink': '#101619' },
      hub: ['#8FD0CA', '#1E3A38', '#1E3A38'], subj: { hist: ['#E0B27E', '#3A2A18', '#3A2A18'], przyroda: ['#8BD1A4', '#17301F', '#17301F'], english: ['#9DB9EE', '#1C2B47', '#1C2B47'], math: ['#BBA6E8', '#2C2347', '#2C2347'] } },
  },
  {
    id: 'zeszyt', name: 'Zeszyt w kratkę', desc: 'Kratka, niebieska okładka, odręczne nagłówki',
    light: { vars: { '--paper': '#FBFCFF', '--grid': '#DCE7F7', '--card': '#FFFFFF', '--fg': '#1E2A44', '--muted': '#55627A', '--line': '#C9D6EC', '--bar': '#2A4D8F', '--bar-fg': '#E3ECFA', '--bar-line': 'rgba(255,255,255,.35)', '--bar-on': '#FFFFFF', '--bar-on-fg': '#1E2A44', '--hl': '#FFF3A8', '--on-ink': '#FFFFFF', '--margin': '#F3A6A6' },
      hub: ['#2A4D8F', '#E3EAF7'], subj: { math: ['#3F51B5', '#E6E9F8'], english: ['#1E6FB8', '#E1EEFA'], hist: ['#A0522D', '#F6E7DD'], przyroda: ['#2E7D4F', '#E1F2E8'] } },
    dark: { vars: { '--paper': '#121A2B', '--grid': '#1C2840', '--card': '#17223A', '--fg': '#E6ECF8', '--muted': '#9AA9C4', '--line': '#2A3A5C', '--bar': '#0F1F44', '--bar-fg': '#CFE0FF', '--bar-line': 'rgba(207,224,255,.25)', '--bar-on': '#FFFFFF', '--bar-on-fg': '#121A2B', '--hl': '#4A4420', '--on-ink': '#0E1525', '--margin': '#7A3A44' },
      hub: ['#9DB6F0', '#22305A'], subj: { math: ['#9AA8FF', '#262E55'], english: ['#7FB8F0', '#1B3150'], hist: ['#E2A27A', '#3A2A22'], przyroda: ['#7FCF9F', '#1A3628'] } },
    css: `body{background-color:var(--paper);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:22px 22px}
      h1,h2,.subj b,.dz-b b{font-family:var(--hand);font-weight:700;letter-spacing:.01em} h1{font-size:2.7rem} h2{font-size:1.7rem}
      .brand{font-family:var(--hand);font-size:1.7rem;font-weight:700}
      ${CARDS}{border-color:var(--line);box-shadow:0 2px 0 var(--line)} main{border-left:2px solid var(--margin);padding-left:18px}`,
  },
  {
    id: 'pastel', name: 'Pastele', desc: 'Miękkie, zaokrąglone kolory i okrągła czcionka',
    light: { vars: { '--paper': '#FFF6F1', '--grid': '#FFF6F1', '--card': '#FFFFFF', '--fg': '#3B3346', '--muted': '#7A6F86', '--line': '#F0E2EA', '--bar': '#F7DCEB', '--bar-fg': '#5A3E66', '--bar-line': 'rgba(90,62,102,.25)', '--bar-on': '#5A3E66', '--bar-on-fg': '#FFFFFF', '--hl': '#FFE9A8', '--on-ink': '#FFFFFF', '--soft-shadow': 'rgba(150,110,140,.14)' },
      hub: ['#8A6BD6', '#F1EBFC'], subj: { math: ['#8A6BD6', '#F1EBFC'], english: ['#4B8BD6', '#E8F1FC'], hist: ['#D0844A', '#FCEEE3'], przyroda: ['#45A577', '#E4F5EC'] } },
    dark: { vars: { '--paper': '#221D29', '--grid': '#221D29', '--card': '#2C2535', '--fg': '#F1E9F5', '--muted': '#B8A9C4', '--line': '#3A3145', '--bar': '#3A2D44', '--bar-fg': '#F3D9EA', '--bar-line': 'rgba(243,217,234,.25)', '--bar-on': '#F3D9EA', '--bar-on-fg': '#2C2535', '--hl': '#5A4A2A', '--on-ink': '#221D29', '--soft-shadow': 'rgba(0,0,0,.35)' },
      hub: ['#C3AEFF', '#3A3158'], subj: { math: ['#C3AEFF', '#3A3158'], english: ['#9CC6FF', '#24344F'], hist: ['#F2B88C', '#45322A'], przyroda: ['#95DDB7', '#21392F'] } },
    css: `body{background:var(--paper)}
      ${CARDS}{border-radius:24px;border-color:transparent;box-shadow:0 8px 24px var(--soft-shadow)}
      .task{border:2px solid var(--ink-soft)} .primary,.ghost,.soft,.nav button,.back,.chip{border-radius:999px}
      .brand,.brand small{color:var(--bar-fg)} h1,h2,.subj b,.dz-b b,.mode b,.tn{font-family:'Fredoka','Baloo 2',system-ui,sans-serif;font-weight:600}
      .subj::before{height:0} .subj .big-ic,.dz-n{border-radius:50%}`,
  },
  {
    id: 'kosmos', name: 'Kosmos', desc: 'Gwiazdy i świecące kolory (jasny tryb – poranne niebo)',
    light: { vars: { '--paper': '#EEF0FF', '--grid': '#EEF0FF', '--card': '#FFFFFF', '--fg': '#1B2150', '--muted': '#545C8F', '--line': '#D4D9F5', '--bar': '#1B2150', '--bar-fg': '#DDE2FF', '--bar-line': 'rgba(221,226,255,.3)', '--bar-on': '#FFD86B', '--bar-on-fg': '#1B2150', '--on-ink': '#FFFFFF', '--hl': '#FFF0A8', '--star': '#B8BFEA', '--glow': 'rgba(0,0,0,.08)' },
      hub: ['#6C4CE0', '#ECE7FF'], subj: { math: ['#6C4CE0', '#ECE7FF'], english: ['#1F7AD6', '#E2EFFC'], hist: ['#C46A14', '#FBEBDB'], przyroda: ['#148A55', '#DFF3E9'] } },
    dark: { vars: { '--paper': '#0E1330', '--grid': '#0E1330', '--card': '#182049', '--fg': '#EEF1FF', '--muted': '#A9B2E2', '--line': '#2D3974', '--bar': '#090C24', '--bar-fg': '#C9D1FF', '--bar-line': 'rgba(201,209,255,.25)', '--bar-on': '#FFD86B', '--bar-on-fg': '#0E1330', '--on-ink': '#0E1330', '--hl': '#4B3F8F', '--star': '#FFFFFF', '--glow': 'rgba(0,0,0,.35)',
      '--red': '#FF8F8F', '--red-soft': '#3B1F35', '--green': '#7EE6A8', '--green-soft': '#173A35', '--amber': '#FFC46B', '--amber-soft': '#3A2F24' },
      hub: ['#B9A0FF', '#2A2560'], subj: { math: ['#B9A0FF', '#2A2560'], english: ['#7CC4FF', '#1D2F5E'], hist: ['#FFC07A', '#3A2B30'], przyroda: ['#7EE6A8', '#173A3C'] } },
    css: `body{background-color:var(--paper);background-image:radial-gradient(1.2px 1.2px at 20px 30px,var(--star) 50%,transparent 52%),radial-gradient(1px 1px at 130px 90px,var(--star) 50%,transparent 52%),radial-gradient(1.6px 1.6px at 210px 170px,var(--star) 50%,transparent 52%),radial-gradient(1px 1px at 70px 200px,var(--star) 50%,transparent 52%);background-size:250px 230px}
      ${CARDS}{border-color:var(--line);box-shadow:0 10px 30px var(--glow)}
      .subj:hover,.mode:hover,.dz:hover{box-shadow:0 0 22px color-mix(in srgb,var(--c,var(--ink)) 45%,transparent)}
      .top{border-bottom:1px solid var(--line)}`,
  },
  {
    id: 'natura', name: 'Las', desc: 'Ciepły beż, zielenie i drewno – spokojnie i naturalnie',
    light: { vars: { '--paper': '#F3EEE2', '--grid': '#F3EEE2', '--card': '#FFFDF7', '--fg': '#2F3A2C', '--muted': '#6A705E', '--line': '#DCD2BE', '--bar': '#3E5C3A', '--bar-fg': '#E8F0DF', '--bar-line': 'rgba(232,240,223,.35)', '--bar-on': '#F2D58A', '--bar-on-fg': '#2F3A2C', '--hl': '#F5E3A3', '--on-ink': '#FFFFFF', '--accent2': '#8DB580', '--wood': '#E6DCC8' },
      hub: ['#4C7A3D', '#E5EFDD'], subj: { math: ['#6B5B95', '#ECE8F3'], english: ['#3D6E8F', '#E3EDF3'], hist: ['#9A5B2E', '#F3E6D9'], przyroda: ['#4C7A3D', '#E5EFDD'] } },
    dark: { vars: { '--paper': '#1B1F17', '--grid': '#1B1F17', '--card': '#242A1F', '--fg': '#E9EEDF', '--muted': '#A9B19B', '--line': '#39412F', '--bar': '#22311F', '--bar-fg': '#D9E6CB', '--bar-line': 'rgba(217,230,203,.25)', '--bar-on': '#E8C979', '--bar-on-fg': '#1B1F17', '--hl': '#4F4620', '--on-ink': '#1B1F17', '--accent2': '#4E6B44', '--wood': '#2E3427' },
      hub: ['#9CCB86', '#243321'], subj: { math: ['#B7A5DC', '#2E2A3A'], english: ['#8FB9D6', '#1F2E38'], hist: ['#DDA77A', '#3A2C20'], przyroda: ['#9CCB86', '#243321'] } },
    css: `body{background:var(--paper)}
      ${CARDS}{border-radius:10px;border-width:2px;border-color:var(--line);box-shadow:0 3px 0 var(--wood)}
      .top{border-bottom:5px solid var(--accent2)} .subj::before{height:12px}`,
  },
  {
    id: 'komiks', name: 'Komiks', desc: 'Grube kontury, mocne kolory i cień jak w komiksie',
    light: { vars: { '--paper': '#FFF8D9', '--grid': '#EADB8E', '--card': '#FFFFFF', '--fg': '#141414', '--muted': '#4A4A4A', '--line': '#141414', '--ol': '#141414', '--bar': '#FFD23F', '--bar-fg': '#141414', '--bar-line': '#141414', '--bar-on': '#141414', '--bar-on-fg': '#FFD23F', '--hl': '#FFE45E', '--on-ink': '#FFFFFF' },
      hub: ['#7B2FF7', '#EFE4FF'], subj: { math: ['#7B2FF7', '#EFE4FF'], english: ['#0068E6', '#DDEBFF'], hist: ['#E35D00', '#FFE6D2'], przyroda: ['#00995F', '#D9F5E8'] } },
    dark: { vars: { '--paper': '#1A1A1A', '--grid': '#2C2C2C', '--card': '#262626', '--fg': '#F5F5F5', '--muted': '#BDBDBD', '--line': '#F5F5F5', '--ol': '#F5F5F5', '--bar': '#FFD23F', '--bar-fg': '#141414', '--bar-line': '#141414', '--bar-on': '#141414', '--bar-on-fg': '#FFD23F', '--hl': '#5C4F12', '--on-ink': '#141414' },
      hub: ['#B98BFF', '#33264D'], subj: { math: ['#B98BFF', '#33264D'], english: ['#5AA8FF', '#1B2D47'], hist: ['#FF9A4D', '#43291A'], przyroda: ['#3FD99A', '#173B2C'] } },
    css: `body{background-color:var(--paper);background-image:radial-gradient(var(--grid) 1.2px,transparent 1.4px);background-size:14px 14px}
      ${CARDS},.primary,.ghost,.soft,.chip,.slot,.step,.srow{border:3px solid var(--ol);box-shadow:4px 4px 0 var(--ol)}
      .top .nav button,.top .back{border:3px solid #141414;box-shadow:3px 3px 0 #141414}
      .primary:active,.mode:active,.subj:active{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ol)}
      h1{font-family:'Bangers',var(--display);font-weight:400;letter-spacing:.04em;font-size:2.9rem}
      .brand,.brand small{color:#141414} .brand{font-family:'Bangers',var(--display);font-weight:400;letter-spacing:.06em;font-size:1.6rem}
      .top{border-bottom:3px solid #141414} .subj::before{height:12px;border-bottom:3px solid var(--ol)}`,
  },
];

export const MODES = [['system', 'Jak w systemie'], ['light', 'Jasny'], ['dark', 'Ciemny']] as const;
export type Mode = typeof MODES[number][0];

/** Cały CSS wariantów i trybów. Działa na <html> i na podglądach .lp[data-look] w panelu ustawień. */
export function looksCSS(): string {
  const decl = (v: Record<string, string>) => Object.entries(v).map(([k, x]) => `${k}:${x}`).join(';');
  const inkDecl = (i: Ink) => `--ink:${i[0]};--ink-soft:${i[1]}${i[2] ? `;--bar:${i[2]}` : ''}`;
  let out = '';
  for (const l of LOOKS) {
    for (const sc of ['light', 'dark'] as const) {
      const p = l[sc];
      const R = sc === 'light' ? `html:root[data-look="${l.id}"]` : `html:root[data-look="${l.id}"][data-scheme="dark"]`;
      const L = sc === 'light' ? `.lp[data-look="${l.id}"]` : `html[data-scheme="dark"] .lp[data-look="${l.id}"]`;
      const cs = Object.entries(p.subj).map(([k, i]) => `--c-${k}:${i[0]};--cs-${k}:${i[1]}`).join(';');
      out += `${R},${L}{${decl({ ...(sc === 'light' ? LIGHT_STATUS : DARK_STATUS), ...p.vars })};${cs}}\n`;
      out += `${R}:not([data-subj]),${L}{${inkDecl(p.hub)}}\n`;
      for (const [k, i] of Object.entries(p.subj)) out += `${R}[data-subj="${k}"]{${inkDecl(i)}}\n`;
    }
    if (l.css) out += l.css.split('}').map(r => r.trim()).filter(Boolean).map(r => {
      const [sel, body] = r.split('{');
      return sel.split(',').map(x => `html[data-look="${l.id}"] ${x.trim()}`).join(',') + '{' + body + '}';
    }).join('\n') + '\n';
  }
  return out;
}

const KEY = 'sprawdziany-look', MKEY = 'sprawdziany-mode';
const get = (k: string, d: string) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
export const getLook = () => { const v = get(KEY, 'obecny'); return LOOKS.some(l => l.id === v) ? v : 'obecny'; };
export const getMode = (): Mode => { const v = get(MKEY, 'system'); return (MODES.some(m => m[0] === v) ? v : 'system') as Mode; };
const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
export const scheme = (): 'light' | 'dark' => { const m = getMode(); return m === 'system' ? (mq?.matches ? 'dark' : 'light') : m; };

/** ustawia wariant i tryb na dokumencie (moduł matematyki ma własne data-theme light/dark) */
export function applyLook(doc: Document, frame = false) {
  const h = doc.documentElement; const l = getLook();
  /* moduł matematyki w wariancie „obecny” zachowuje swoje kolory, dostaje tylko tryb */
  if (frame && l === 'obecny') delete h.dataset.look; else h.dataset.look = l;
  h.dataset.scheme = scheme(); h.dataset.theme = scheme();
}
export function applyAll() {
  applyLook(document);
  const fr = document.getElementById('math-frame') as HTMLIFrameElement | null;
  if (fr?.contentDocument) applyLook(fr.contentDocument, true);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--bar').trim() || '#2F4F4F');
}
export function setLook(id: string) { try { localStorage.setItem(KEY, id); } catch { /* */ } applyAll(); }
export function setMode(m: Mode) { try { localStorage.setItem(MKEY, m); } catch { /* */ } applyAll(); }
mq?.addEventListener?.('change', () => { if (getMode() === 'system') applyAll(); });

export const FONTS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Caveat:wght@600;700&family=Fredoka:wght@500;600;700&family=Bangers&display=swap';
