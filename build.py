import re
H=open('src/historia-engine.html',encoding='utf-8').read()
lines=H.split('\n')
# CSS: between <style> and </style>
s=H.index('<style>')+7; e=H.index('</style>')
css=H[s:e]
# drop palette blocks (from first ':root{' to the line before '*{box-sizing')
a=css.index(':root{'); b=css.index('*{box-sizing')
css=css[:a]+css[b:]
css=css.replace("background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);\n  background-size:22px 22px;","")
SUBJ={'hub':('#2F6F6B','#E1F0EE','#24504D','#8FD0CA','#1E3A38'),
 'hist':('#8A5A2B','#F3E8DA','#5E3E1E','#E0B27E','#3A2A18'),
 'przyroda':('#2E7549','#E1F1E6','#1F5233','#8BD1A4','#17301F'),
 'english':('#3F65AE','#E3EBF8','#2C4A80','#9DB9EE','#1C2B47'),
 'math':('#6F52A5','#ECE6F6','#4B3A78','#BBA6E8','#2C2347')}
light='''
:root{--paper:#F5F8F6;--grid:#E4EBE6;--card:#FFFFFF;--fg:#26323A;--muted:#5B6870;--line:#D4DED8;
  --red:#B8372D;--red-soft:#FBE8E5;--green:#1D7A4C;--green-soft:#E0F2E7;--amber:#97620F;--amber-soft:#FBF1DA;
  --hl:#FFF0B3;--shadow:rgba(38,50,58,.10);--bar-fg:#E8F0EE;--bar-line:rgba(255,255,255,.35);--bar-on:#FFFFFF;--bar-on-fg:#26323A;
  --display:'Baloo 2','Trebuchet MS',system-ui,sans-serif;--body:'Nunito','Segoe UI',system-ui,sans-serif;--hand:'Caveat','Comic Sans MS',cursive}
'''
dark_common='''--paper:#141A1E;--grid:#1B2328;--card:#1B2328;--fg:#E4EBEA;--muted:#9AA8AB;--line:#2D3A40;
  --red:#FF8B80;--red-soft:#3A1F22;--green:#6CD29A;--green-soft:#16321F;--amber:#F0BC5A;--amber-soft:#382B15;
  --hl:#5E5014;--shadow:rgba(0,0,0,.45);--bar-fg:#D4E2E0;--bar-line:rgba(255,255,255,.2);--bar-on:#F2F6F5;--bar-on-fg:#141A1E;color-scheme:dark'''
pal=light
for k,(ink,soft,bar,dink,dsoft) in SUBJ.items():
    sel=':root' if k=='hub' else f':root[data-subj="{k}"]'
    pal+=f'{sel}{{--ink:{ink};--ink-soft:{soft};--on-ink:#FFFFFF;--bar:{bar}}}\n'
pal+='@media (prefers-color-scheme: dark){:root{'+dark_common+'}\n'
for k,(ink,soft,bar,dink,dsoft) in SUBJ.items():
    sel=':root' if k=='hub' else f':root[data-subj="{k}"]'
    pal+=f' {sel}{{--ink:{dink};--ink-soft:{dsoft};--on-ink:#101619;--bar:{dsoft}}}\n'
pal+='}\n'
extra='''
body{background-image:none}
.top{box-shadow:0 1px 6px var(--shadow)}
.back{border:2px solid var(--bar-line);background:transparent;color:var(--bar-fg);border-radius:10px;padding:6px 12px;font-weight:800;font-size:.95rem}
.back:hover{border-color:var(--bar-fg);color:#fff}
.brand .ic{font-size:1.3rem;margin-right:2px}
.nav button.on{color:var(--bar)}
/* hub */
.subjects{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.subj{text-align:left;background:var(--card);border:2px solid var(--line);border-radius:20px;padding:22px 20px;display:flex;flex-direction:column;gap:10px;min-height:190px;position:relative;overflow:hidden;transition:transform .15s,border-color .15s}
.subj::before{content:"";position:absolute;inset:0 0 auto 0;height:8px;background:var(--c)}
.subj:hover{transform:translateY(-3px);border-color:var(--c)}
.subj:focus-visible{outline-color:var(--c)}
.subj .big-ic{font-size:3rem;line-height:1;width:76px;height:76px;border-radius:20px;background:var(--cs);display:flex;align-items:center;justify-content:center}
.subj b{font-family:var(--display);font-size:1.55rem;line-height:1.1;color:var(--c)}
.subj small{color:var(--muted);font-size:.92rem}
.subj .meta{margin-top:auto;font-size:.85rem;font-weight:800;color:var(--fg)}
.subj .mbar{height:7px;border-radius:99px;background:var(--line);overflow:hidden}
.subj .mbar i{display:block;height:100%;background:var(--c);border-radius:99px}
/* matematyka */
.expr{font-family:var(--display);font-weight:600;font-size:clamp(1.6rem,6vw,2.4rem);margin:10px 0 2px;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.expr sup,.q-text sup{font-size:.6em}
.box{display:inline-block;min-width:1.3em;height:1.05em;border:2px dashed var(--ink);border-radius:4px;vertical-align:-.12em;color:transparent;line-height:1}
.axis{overflow-x:auto;margin-top:12px}
.axis svg{width:100%;min-width:420px;max-width:640px;height:auto;display:block}
.axis .ax,.axis .tk{stroke:var(--fg);stroke-width:2}
.axis .axh{fill:var(--fg)}
.axis .lb{fill:var(--fg);font:700 18px var(--body);text-anchor:middle}
.axis .lb.ans{fill:var(--green)}
.axis .pt{fill:var(--ink)}
.axis .pl{fill:var(--ink);font:800 18px var(--display);text-anchor:middle}
.axis .hit{cursor:pointer}
.axis .mk{fill:transparent;stroke:transparent;stroke-width:2}
.axis .hit:hover .mk,.axis .hit:focus .mk{stroke:var(--ink)}
.axis .sel .mk{fill:var(--ink)}
.axis .right .mk{fill:var(--green);stroke:var(--green)}
.axis .wrong .mk{fill:var(--red)}
'''
css=pal+css+extra

hdr='''<header class="top"><div class="top-in">
  <button class="back" id="back" data-go="hub" hidden>◀ Przedmioty</button>
  <div class="brand" id="brand"><span class="ic">📚</span> Szkolne sprawdziany <small>kl. 4</small></div>
  <nav class="nav" id="nav" aria-label="Widoki" hidden>
    <button data-go="home">Start</button>
    <button data-go="train">Trening</button>
    <button data-go="test">Sprawdzian</button>
    <button data-go="progress">Postępy</button>
  </nav>
</div></header>
<main id="main"></main>'''

ch=open('src/common_helpers.js',encoding='utf-8').read()
ct=open('src/common_types.js',encoding='utf-8').read()
# chk patches
ct=ct.replace("function chk(fd,raw){\n","function chk(fd,raw){\n  if(fd.kind==='t'){const n=x=>String(x==null?'':x).trim().toLowerCase().replace(/\\s+/g,' ').replace(/[.!?]+$/,'');return [fd.ans,...(fd.alts||[])].map(n).includes(n(raw))}\n",1)
assert "fd.kind==='t'" in ct
ct=ct.replace("return /^\\d+$/.test(s)&&+s===fd.ans;","s=s.replace(/ /g,'');return /^\\d+$/.test(s)&&+s===fd.ans;")
assert "s=s.replace(/ /g,'')" in ct

def mod(name,key,title,icon,eyebrow,topicsTitle,desc,short):
    src=open(f'src/{name}_data.js',encoding='utf-8').read()
    return f"SUBJECTS.{short}=(()=>{{\n{src}\nreturn{{id:'{short}',key:'{key}',name:'{title}',icon:'{icon}',eyebrow:'{eyebrow}',topicsTitle:'{topicsTitle}',desc:'{desc}',TOPICS,T,CHAPTERS,B}};\n}})();\n"
mods=''
mods+=mod('hist','hist4-v1','Historia','🏺','Historia kl. 4 · rozdział I, str. 8–34','Tematy z podręcznika','Źródła, czas, wieki, kalendarz','hist')
mods+=mod('przyroda','prz4-v1','Przyroda','🌿','Przyroda kl. 4 · rozdziały 1–5','Tematy z podręcznika','Zmysły, obserwacje, kierunki świata','przyroda')
mods+=mod('english','ang4-v1','Angielski','💬','Angielski kl. 4 · zestaw startowy','Tematy','Słówka, to be, can, have got','english')
mods+=mod('math','lid4-v1','Matematyka','🔢','Matematyka kl. 4 · Liczby i działania','Tematy ze sprawdzianu','Działania, oś liczbowa, zadania tekstowe','math')

# engine
es=H.index('/* ---------- zapis')
ee=H.index('</script>',es)
eng=H[es:ee]
def rep(old,new,cnt=1):
    global eng
    assert eng.count(old)>=1,old
    eng=eng.replace(old,new) if cnt==0 else eng.replace(old,new,cnt)
rep("const KEY='hist4-v1';","let KEY;")
rep("let S=load();","let S;")
rep("let VIEW='home'","let VIEW='hub'")
rep("const TRAIN={topics:new Set(TOPICS.map(t=>t.id)),level:'auto',n:10};","const TRAIN={topics:new Set(),level:'auto',n:10};")
rep("Historia kl. 4 · rozdział I, str. 15–34","${SUBJ.eyebrow}")
rep("Tematy z podręcznika","${SUBJ.topicsTitle}")
rep("[1,2,3,4,5].map(c=>","Object.keys(CHAPTERS).map(Number).map(c=>")
rep("Próbny sprawdzian z historii","Próbny sprawdzian: ${SUBJ.name}")
rep("Zadania ze wszystkich tematów rozdziału I.","Zadania ze wszystkich tematów.")
rep("Historia kl. 4 · rozdział I · grupa","${SUBJ.name} kl. 4 · grupa")
rep("Jak idzie nauka historii","Jak idzie nauka: ${SUBJ.name}")
rep("Historia kl. 4 (rozdział I)","${SUBJ.name} kl. 4")
rep("${S.name} - historia:","${S.name} - ${SUBJ.name.toLowerCase()}:")
rep("'Wyniki z historii: '+S.name","'Wyniki: '+SUBJ.name+' - '+S.name")
rep("z historii? Tego","z tego przedmiotu? Tego")
# qBody axis
rep("const dis=locked?' disabled':'';let h=`<div class=\"q-text\">${q.html}</div>`;","const dis=locked?' disabled':'';let h=`<div class=\"q-text\">${q.html}</div>`;\n  if(q.line)h+=`<div class=\"axis\">${lineSVG(q,ns,v,locked,show)}</div>`;")
rep("q.fields.map((fd,k)=>{const x=v[k]==null?'':v[k];const good=show&&chk(fd,x);","q.fields.map((fd,k)=>{if(fd.mark)return'';const x=v[k]==null?'':v[k];const good=show&&chk(fd,x);")
rep("q.type==='num'?q.fields.map((fd,k)=>chk(fd,v[k]))","q.type==='num'?q.fields.map((fd,k)=>fd.mark?v[k]===fd.ans:chk(fd,v[k]))")
rep("    case'pick':","    case'tick':{const k=+el.dataset.k,t=+el.dataset.t;valsOf(ns)[k]=t;clr();render();refocus(`[data-act=\"tick\"][data-ns=\"${ns}\"][data-t=\"${t}\"]`);break}\n    case'pick':")
# render / go
rep("$('#main').innerHTML=({home:vHome,","$('#main').innerHTML=({hub:vHub,home:vHome,")
rep("document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===nav));",
 "document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===nav));\n  $('#nav').hidden=VIEW==='hub';$('#back').hidden=VIEW==='hub';\n  $('#brand').innerHTML=VIEW==='hub'?'<span class=\"ic\">📚</span> Szkolne sprawdziany <small>kl. 4</small>':`<span class=\"ic\">${SUBJ.icon}</span> ${SUBJ.name} <small>kl. 4</small>`;")
rep("document.querySelector('.nav').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});",
 "document.querySelector('.top').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b)go(b.dataset.go)});")
rep("  CONFIRM_RESET=false;VIEW=v;render();scrollTo(0,0);\n}","  CONFIRM_RESET=false;VIEW=v;if(v==='hub')document.documentElement.removeAttribute('data-subj');render();scrollTo(0,0);\n}")
rep("case'quitok':{const t=RUN.pending;clearInterval(TIMER);RUN.done=true;RUN=null;VIEW=t;","case'quitok':{const t=RUN.pending;clearInterval(TIMER);RUN.done=true;RUN=null;VIEW=t;if(t==='hub')document.documentElement.removeAttribute('data-subj');")
rep("case'tick':","case'subj':setSubject(el.dataset.id);break;\n    case'tick':") if False else None
rep("    case'tick':","    case'subj':setSubject(el.dataset.id);break;\n    case'tick':")
# render() end: final 'render();' at the end
assert eng.rstrip().endswith("render();")
eng=eng.rstrip()[:-len("render();")]
hub='''
/* ---------- wybór przedmiotu ---------- */
let SUBJ=SUBJECTS.hist,TOPICS=SUBJ.TOPICS,T=SUBJ.T,CHAPTERS=SUBJ.CHAPTERS,B=SUBJ.B;
function setSubject(id){
  clearInterval(TIMER);RUN=null;WARM=null;CONFIRM_RESET=false;SEND={copied:false,show:false};
  SUBJ=SUBJECTS[id];TOPICS=SUBJ.TOPICS;T=SUBJ.T;CHAPTERS=SUBJ.CHAPTERS;B=SUBJ.B;KEY=SUBJ.key;S=load();
  TRAIN.topics=new Set(TOPICS.map(t=>t.id));TRAIN.level='auto';TRAIN.n=10;TEST.level=2;TEST.long=false;
  document.documentElement.dataset.subj=id;VIEW='home';render();scrollTo(0,0);
}
function peek(sub){try{const s=JSON.parse(localStorage.getItem(sub.key));if(!s)return null;const all=sub.TOPICS.flatMap(t=>(s.topics&&s.topics[t.id]||{recent:[]}).recent);return{count:s.count||0,avg:all.length?all.reduce((a,b)=>a+b,0)/all.length:null,total:sub.TOPICS.length,done:sub.TOPICS.filter(t=>s.topics&&s.topics[t.id]&&s.topics[t.id].recent.length).length}}catch(e){return null}}
function vHub(){
  const col={hist:['#8A5A2B','#F3E8DA'],przyroda:['#2E7549','#E1F1E6'],english:['#3F65AE','#E3EBF8'],math:['#6F52A5','#ECE6F6']};
  const dark=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;
  const dc={hist:['#E0B27E','#3A2A18'],przyroda:['#8BD1A4','#17301F'],english:['#9DB9EE','#1C2B47'],math:['#BBA6E8','#2C2347']};
  return`<section class="hello"><span class="eyebrow">Klasa 4</span><h1>Cześć! Czego dziś się uczymy?</h1>
    <p class="lead">Wybierz przedmiot. Każdy ma własne tematy, trening i sprawdzian z oceną.</p></section>
  <section class="subjects">${Object.values(SUBJECTS).map(s=>{const p=peek(s),c=(dark?dc:col)[s.id];
    return`<button class="subj" data-act="subj" data-id="${s.id}" style="--c:${c[0]};--cs:${c[1]}"><span class="big-ic" aria-hidden="true">${s.icon}</span><b>${s.name}</b><small>${s.desc}</small>
      <span class="mbar" aria-hidden="true"><i style="width:${p&&p.avg!=null?Math.max(4,Math.round(p.avg*100)):0}%"></i></span>
      <span class="meta">${p&&p.count?`${p.count} ${plural(p.count,'zadanie','zadania','zadań')} · skuteczność ${p.avg==null?'—':Math.round(p.avg*100)+'%'}`:'jeszcze nie ćwiczone'}</span></button>`}).join('')}</section>`;
}
/* oś liczbowa (matematyka) */
function lineSVG(q,ns,vals,locked,show){
  const L=q.line,x0=34,g=54,y=52;let s=`<svg viewBox="0 0 620 100" role="img" aria-label="Oś liczbowa">`;
  s+=`<line x1="8" y1="${y}" x2="604" y2="${y}" class="ax"/><path d="M604 ${y-7} L616 ${y} L604 ${y+7} Z" class="axh"/>`;
  for(let i=0;i<=10;i++){const x=x0+i*g;s+=`<line x1="${x}" y1="${y-9}" x2="${x}" y2="${y+9}" class="tk"/>`}
  L.labels.forEach(([i,v])=>{s+=`<text x="${x0+i*g}" y="${y+34}" class="lb">${Number(v).toLocaleString('pl-PL')}</text>`});
  if(L.point!=null){const x=x0+L.point*g;s+=`<circle cx="${x}" cy="${y}" r="7" class="pt"/><text x="${x}" y="${y-17}" class="pl">A</text>`;
    if(show)s+=`<text x="${x}" y="${y+34}" class="lb ans">${Number(q.fields[0].ans).toLocaleString('pl-PL')}</text>`}
  const k=q.fields.findIndex(fd=>fd.mark);
  if(k>=0){const sel=vals[k],ans=q.fields[k].ans;
    for(let i=0;i<=10;i++){const x=x0+i*g;let c='hit';if(sel===i)c+=' sel';if(show&&i===ans)c+=' right';if(show&&sel===i&&sel!==ans)c+=' wrong';
      const at=locked?'':` data-act="tick" data-ns="${ns}" data-k="${k}" data-t="${i}" tabindex="0" role="button" aria-label="Kreska numer ${i}"`;
      s+=`<g class="${c}"${at}><rect x="${x-26}" y="${y-30}" width="52" height="58" fill="transparent"/><circle cx="${x}" cy="${y}" r="8" class="mk"/></g>`}
    if(show)s+=`<text x="${x0+ans*g}" y="${y+34}" class="lb ans">${q.fields[k].show}</text>`}
  return s+'</svg>';
}
$('#main').addEventListener('keydown',e=>{const el=e.target;if((e.key==='Enter'||e.key===' ')&&el.dataset&&el.dataset.act==='tick'){e.preventDefault();act('tick',el)}});
render();
'''
eng+=hub

page=f'''<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Szkolne sprawdziany Franka</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Caveat:wght@600;700&display=swap">
<style>{css}</style>
</head>
<body>
{hdr}

<script>
{ch}
{ct}
const SUBJECTS={{}};
{mods}
{eng}
</script>
</body>
</html>
'''
open('index.html','w',encoding='utf-8').write(page)
print(len(page))
