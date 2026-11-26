/* Sprawdzian szkolny: Matematyka kl. 4 – „Systemy zapisywania liczb”, GWO, grupa A, 23.11.2026.
   Oryginał = pytania ze sprawdzianu (zdjęcia). Warianty v1–v5 = te same typy zadań, inne liczby (stałe ziarno). „rand” = losowy.
   Zad. 7: ostatnie zdanie polecenia było ucięte na zdjęciu – przyjęto „Ile waży słoik z miodem?”. */
// @ts-nocheck
import { plural, toRoman, seeded } from '../../../src/core/kit';
import type { SchoolTest, STask } from '../../../src/core/types';

const sfmt = (n: number) => Number(n).toLocaleString('pl-PL');
/* liczba słownie (do 999 999) */
const W1=['','jeden','dwa','trzy','cztery','pięć','sześć','siedem','osiem','dziewięć'];
const W11=['dziesięć','jedenaście','dwanaście','trzynaście','czternaście','piętnaście','szesnaście','siedemnaście','osiemnaście','dziewiętnaście'];
const W10=['','','dwadzieścia','trzydzieści','czterdzieści','pięćdziesiąt','sześćdziesiąt','siedemdziesiąt','osiemdziesiąt','dziewięćdziesiąt'];
const W100=['','sto','dwieście','trzysta','czterysta','pięćset','sześćset','siedemset','osiemset','dziewięćset'];
function w3(n){const s=[],h=Math.floor(n/100),t=Math.floor(n%100/10),u=n%10;if(h)s.push(W100[h]);if(t===1)s.push(W11[u]);else{if(t)s.push(W10[t]);if(u)s.push(W1[u])}return s.join(' ')}
function words(n){const k=Math.floor(n/1000),r=n%1000,s=[];if(k)s.push(k===1?'tysiąc':w3(k)+' '+plural(k,'tysiąc','tysiące','tysięcy'));if(r)s.push(w3(r));return s.join(' ')}
const wnorm=s=>String(s==null?'':s).toLowerCase().replace(/[.,!?;]/g,' ').replace(/\s+/g,' ').trim();
const dagTxt=d=>d>=100?`${Math.floor(d/100)} kg${d%100?` ${d%100} dag`:''}`:`${d} dag`;
const zgTxt=g=>`${Math.floor(g/100)} zł${g%100?` ${g%100} gr`:''}`;
const hm=m=>`${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
const sign=(a,b)=>a<b?'<':a>b?'>':'=';

function build(kind: string): { tasks: STask[] } {
  const orig=kind==='orig',seed=kind==='rand'?Date.now():{v1:4101,v2:4202,v3:4303,v4:4404,v5:4505}[kind]||1;
  const {r,p}=seeded(seed);
  const T=[];

  /* 1. zapis cyframi i słowami */
  {const a=orig?34108:r(11,99)*1000+r(1,9)*100+r(1,9),b=orig?209630:r(101,909)*1000+r(1,9)*100+r(1,9)*10;
   T.push({pts:1,q:`a) Zapisz cyframi liczbę <i>${words(a)}</i>.<br>b) Zapisz słowami liczbę <b>${b}</b>.`,
    f:[{l:'a)',k:'n',a},{l:'b)',k:'w',a:words(b)}],
    ex:`a) ${words(a)} = <b>${sfmt(a)}</b> (pilnuj zer w pustych rzędach!).<br>b) Podziel na klasy: ${sfmt(Math.floor(b/1000))} | ${String(b%1000).padStart(3,'0')} → <b>${words(b)}</b>.`,
    fr:0.5,err:'b) zabrakło słowa „trzydzieści” na końcu.'})}

  /* 2. działania pamięciowe */
  {let a,b,c,d,e,g;
   if(orig){a=[400,600];b=[1300,2700];c=[2000,1600];d=[5,480];e=[900,2];g=[5800,100]}
   else{a=[r(2,8)*100,r(2,8)*100];b=[r(11,29)*100,r(11,39)*100];const c1=r(2,9)*1000;c=[c1,r(11,c1/100-2)*100];d=[r(3,9),r(12,99)*10];const ed=p([2,3,4,5]);e=[ed*r(11,99)*10,ed];const gd=p([10,100,1000]);g=[r(12,99)*gd,gd]}
   const L=[['a)',`${a[0]} + ${a[1]} =`,a[0]+a[1]],['b)',`${b[0]} + ${b[1]} =`,b[0]+b[1]],['c)',`${c[0]} − ${c[1]} =`,c[0]-c[1]],['d)',`${d[0]} · ${d[1]} =`,d[0]*d[1]],['e)',`${e[0]} : ${e[1]} =`,e[0]/e[1]],['f)',`${g[0]} : ${g[1]} =`,g[0]/g[1]]];
   T.push({pts:3,q:'Oblicz.',grid:1,f:L.map(([l,pre,a])=>({l,pre,k:'n',a})),
    ex:`Liczenie na pełnych setkach i tysiącach: ${b[0]} + ${b[1]} to ${b[0]/100} setek + ${b[1]/100} setek = ${(b[0]+b[1])/100} setek. Przy dzieleniu przez ${g[1]} skreślasz ${String(g[1]).length-1} ${plural(String(g[1]).length-1,'zero','zera','zer')} z końca.`,fr:3})}

  /* 3. złote i grosze */
  {let L;
   if(orig)L=[[430,'+',1210],[1657,'+',2232],[4680,'−',2630],[1000,'−',520]];
   else{const x1=r(2,19)*100+r(1,5)*10,y1=r(2,19)*100+r(1,4)*10,x2=r(10,30)*100+r(11,88),y2=r(10,30)*100+r(11,88),y3=r(5,25)*100+r(1,6)*10,x3=y3+r(5,30)*100+r(1,3)*10,x4=r(5,20)*100,y4=r(1,x4/100-1)*100+r(1,9)*10;
     L=[[x1,'+',y1],[x2,'+',y2],[x3,'−',y3],[x4,'−',y4]]}
   T.push({pts:2,q:'Oblicz, ile to złotych i ile groszy.',f:L.map(([x,o,y],i)=>{const a=o==='+'?x+y:x-y;return{l:'abcd'[i]+')',pre:`${zgTxt(x)} ${o} ${zgTxt(y)} =`,k:'pair',u:['zł','gr'],a:[Math.floor(a/100),a%100]}}),
    ex:`Dodawaj osobno złote i osobno grosze. Gdy groszy zrobi się 100 lub więcej, zamień 100 gr na 1 zł. Przy odejmowaniu, gdy brakuje groszy, rozmień 1 zł na 100 gr (np. 10 zł − 5 zł 20 gr: 9 zł 100 gr − 5 zł 20 gr = 4 zł 80 gr).`,fr:2})}

  /* 4. jednostki */
  {const v=orig?{cm:600,km:3,m:45,dag:68,t:7,kg:250,h:2,mi:12,db:3,hh:7}:{cm:r(2,90)*100,km:r(2,9),m:p([r(11,99),r(1,9)]),dag:r(12,99),t:r(2,9),kg:r(2,19)*50,h:r(1,5),mi:r(5,55),db:r(2,6),hh:r(1,23)};
   T.push({pts:3,q:'Uzupełnij.',grid:1,f:[
    {l:'a)',pre:`${v.cm} cm =`,k:'n',a:v.cm/100,u:'m'},{l:'b)',pre:`${v.km} km ${v.m} m =`,k:'n',a:v.km*1000+v.m,u:'m'},{l:'c)',pre:`${v.dag} dag =`,k:'n',a:v.dag*10,u:'g'},
    {l:'d)',pre:`${v.t} t ${v.kg} kg =`,k:'n',a:v.t*1000+v.kg,u:'kg'},{l:'e)',pre:`${v.h} h ${v.mi} min =`,k:'n',a:v.h*60+v.mi,u:'min'},{l:'f)',pre:`${v.db} ${plural(v.db,'doba','doby','dób')} ${v.hh} h =`,k:'n',a:v.db*24+v.hh,u:'h'}],
    ex:`1 m = 100 cm · 1 km = 1000 m · 1 dag = 10 g · 1 t = 1000 kg · 1 h = 60 min · 1 doba = 24 h.<br>b) ${v.km} km = ${v.km*1000} m, więc ${v.km*1000} + ${v.m} = <b>${v.km*1000+v.m} m</b> (nie ${v.km}${v.m}!). c) ${v.dag} dag = ${v.dag} · 10 g = <b>${v.dag*10} g</b>.`,
    fr:2,err:'b) napisane 345 zamiast 3045 m; c) napisane 6 zamiast 680 g.'})}

  /* 5. tygodnie i miesiące */
  {const w=orig?8:r(3,12),d=orig?4:r(1,6),y=orig?2:r(1,5),m=orig?11:r(1,11);
   T.push({pts:2,q:'Zapisz działanie.',f:[{l:`a) ${w} ${plural(w,'tydzień','tygodnie','tygodni')} i ${d} ${plural(d,'dzień','dni','dni')} — ile to dni?`,k:'n',a:w*7+d,u:'dni',pts:1},{l:`b) ${y} ${plural(y,'rok','lata','lat')} i ${m} ${plural(m,'miesiąc','miesiące','miesięcy')} — ile to miesięcy?`,k:'n',a:y*12+m,u:'mies.',pts:1}],
    ex:`a) 7 · ${w} = ${7*w}, ${7*w} + ${d} = <b>${w*7+d}</b> dni. b) 12 · ${y} = ${12*y}, ${12*y} + ${m} = <b>${y*12+m}</b> miesięcy.`,fr:2})}

  /* 6. prawda / fałsz */
  {const leap=y=>y%4===0&&(y%100!==0||y%400===0);let S;
   if(orig)S=[['Rok 2020 miał 366 dni.',true,'2020 to rok przestępny (dzieli się przez 4), więc miał 366 dni.'],['II kwartał roku ma tyle samo dni co IV kwartał.',false,'II kwartał: 30 + 31 + 30 = 91 dni, IV kwartał: 31 + 30 + 31 = 92 dni.']];
   else{const y=r(2013,2025),dn=p([365,366]);
     const Q=[['I kwartał roku 2023 miał 90 dni.',true,'Styczeń 31 + luty 28 + marzec 31 = 90 dni.'],['III kwartał ma tyle samo dni co IV kwartał.',true,'III: 31 + 31 + 30 = 92, IV: 31 + 30 + 31 = 92.'],['II kwartał ma tyle samo dni co III kwartał.',false,'II: 91 dni, III: 92 dni.'],['II kwartał ma 91 dni.',true,'Kwiecień 30 + maj 31 + czerwiec 30 = 91.'],['Kwartał to 4 miesiące.',false,'Kwartał to 3 miesiące, a 4 kwartały to rok.'],['Półrocze to 6 miesięcy.',true,'Pół roku = 12 : 2 = 6 miesięcy.'],['I półrocze roku 2024 miało 182 dni.',true,'Rok 2024 był przestępny: 31+29+31+30+31+30 = 182.']];
     S=[[`Rok ${y} miał ${dn} dni.`,(leap(y)?366:365)===dn,`${y} ${leap(y)?'to rok przestępny (366 dni)':'nie jest przestępny (365 dni)'} – przestępny dzieli się przez 4.`],p(Q)]}
   T.push({pts:1,q:'Oceń prawdziwość zdań. Wybierz P, jeśli zdanie jest prawdziwe, albo F – jeśli jest fałszywe.',f:S.map(s=>({l:s[0],k:'sel',o:['P','F'],a:s[1]?'P':'F'})),ex:S.map(s=>s[2]).join('<br>'),fr:1})}

  /* 7. słoik z miodem (ostatnie zdanie polecenia dopisane – na zdjęciu było ucięte) */
  {const who=orig?'Jola':p(['Jola','Ola','Kasia','Zosia','Ania']),what=orig?'miodu':p(['miodu','dżemu','powideł']),
     M=orig?['pół kilograma',500]:p([['pół kilograma',500],['ćwierć kilograma',250],['1 kilogram',1000],['półtora kilograma',1500],['30 dekagramów',300]]),jar=orig?380:r(15,45)*10;
   T.push({pts:2,q:`${who} kupiła ${M[0]} ${what}. Pusty słoik waży ${jar} g. <b>Ile waży słoik z ${what==='miodu'?'miodem':what==='dżemu'?'dżemem':'powidłami'}?</b> Zapisz działanie.`,f:[{l:'Odpowiedź:',k:'n',a:M[1]+jar,u:'g'}],
    ex:`${M[0]} = ${M[1]} g. ${M[1]} g + ${jar} g = <b>${M[1]+jar} g</b>.`,fr:2})}

  /* 8. porównywanie dużych liczb */
  {let L;
   if(orig)L=[['1700 mln',1700e6,'17 mld',17e9],['8 mln',8e6,'8 564 tys.',8564e3],['2 473 000 000',2473e6,'2 743 mln',2743e6],['241 mln',241e6,'24 100 tys.',241e5]];
   else{const y=r(2,30),x=p([y*100,y*1000,y*1000+r(1,9)*100,y*1000-r(1,9)*100]);
     const m=r(3,9),t=p([m*1000+r(1,999),m*1000-r(1,999),m*1000]);
     let d;do{d=r(1000,9999)}while(new Set(String(d)).size<4||String(d).includes('0'));const ds=String(d).split('');const sw=r(0,2);[ds[sw],ds[sw+1]]=[ds[sw+1],ds[sw]];const full=+ds.join('');const first=p([0,1]);
     const q=r(110,990),qt=p([q*100,q*1000,q*1000+r(1,9)*10]);
     L=[[`${sfmt(x)} mln`,x*1e6,`${y} mld`,y*1e9],[`${m} mln`,m*1e6,`${sfmt(t)} tys.`,t*1e3],
       first?[sfmt(full*1e6),full*1e6,`${sfmt(d)} mln`,d*1e6]:[`${sfmt(d)} mln`,d*1e6,sfmt(full*1e6),full*1e6],[`${q} mln`,q*1e6,`${sfmt(qt)} tys.`,qt*1e3]]}
   T.push({pts:2,q:'Porównaj podane liczby, wpisując jeden ze znaków: =, &lt; lub &gt;.',grid:1,f:L.map((z,i)=>({l:'abcd'[i]+')',pre:z[0],post:z[2],k:'sel',o:['<','=','>'],a:sign(z[1],z[3])})),
    ex:'Zamień obie liczby na ten sam zapis (1 tys. = 1000, 1 mln = 1000 tys., 1 mld = 1000 mln):<br>'+L.map((z,i)=>`${'abcd'[i]}) ${sfmt(z[1])} ${sign(z[1],z[3])} ${sfmt(z[3])}`).join('<br>'),
    fr:1.5,err:'c) 2 473 000 000 to 2 473 mln, a to mniej niż 2 743 mln (porównaj setki milionów: 4 < 7).'})}

  /* 9. kroki */
  {const K=orig?['Adeli','Adela',1]:p([['Adeli','Adela',1],['Tomka','Tomek',0],['Mai','Maja',1],['Kuby','Kuba',0]]),[who,nm,girl]=K;
   const bb=orig?'babci':p(['babci','szkoły','sklepu','boiska']),dist=orig?200:r(2,12)*50,st=orig?50:p([20,25,40,50]);
   const place=bb==='babci'?`domem ${who} a domem ${girl?'jej':'jego'} babci`:`domem ${who} a ${{szkoły:'szkołą',sklepu:'sklepem',boiska:'boiskiem'}[bb]}`;
   T.push({pts:2,q:`Odległość pomiędzy ${place} wynosi ${dist} m. <b>Ile kroków musiał${girl?'aby':'by'} wykonać ${nm}, przemierzając tę trasę, jeśli każdy krok ${girl?'dziewczyny':'chłopca'} ma ${st} cm?</b>`,f:[{l:'Odpowiedź:',k:'n',a:dist*100/st,u:'kroków'}],
    ex:`Zamień na te same jednostki: ${dist} m = ${sfmt(dist*100)} cm. ${sfmt(dist*100)} cm : ${st} cm = <b>${dist*100/st} kroków</b>. (Albo: 1 m = 100 cm to ${100/st} ${plural(100/st,'krok','kroki','kroków')}, więc ${dist} · ${100/st} = ${dist*100/st}.)`,
    fr:0,err:'brak rozwiązania – trzeba zamienić metry na centymetry.'})}

  /* 10. liczby rzymskie */
  {const RZ=['','','dwa','trzy','cztery','pięć'];let a,m,b,dd,c,k;
   if(orig){a=21;m=3;b=494;dd=12;c=44;k=4}else{m=p([2,3,4]);a=r(11,Math.floor(160/m));b=r(150,900);dd=r(5,49);k=p([2,3,4,5]);c=k*r(6,30)}
   T.push({pts:3,q:'Uzupełnij zdania liczbami zapisanymi w systemie rzymskim.',f:[
    {l:`Liczba ${RZ[m]} razy większa od liczby ${toRoman(a)} to liczba`,k:'r',a:toRoman(a*m),pts:1},
    {l:`Po zwiększeniu liczby ${toRoman(b)} o`,post:`otrzymamy liczbę ${toRoman(b+dd)}.`,k:'r',a:toRoman(dd),pts:1},
    {l:`Gdy zmniejszymy liczbę ${toRoman(c)} ${RZ[k]} razy, otrzymamy liczbę`,k:'r',a:toRoman(c/k),pts:1}],
    ex:`${toRoman(a)} = ${a}, ${a} · ${m} = ${a*m} = <b>${toRoman(a*m)}</b>.<br>${toRoman(b+dd)} − ${toRoman(b)} = ${b+dd} − ${b} = ${dd} = <b>${toRoman(dd)}</b>.<br>${toRoman(c)} = ${c}, ${c} : ${k} = ${c/k} = <b>${toRoman(c/k)}</b>.`,fr:3})}

  /* 11. plan lekcji */
  {const ORD=['pierwsza','druga','trzecia','czwarta','piąta','szósta'];const who=orig?'Jarka':p(['Jarka','Oli','Michała','Leny']),nm=orig?'Jarek':{Jarka:'Jarek',Oli:'Ola',Michała:'Michał',Leny:'Lena'}[who];
   const st=orig?470:p([430,450,465,470,475,480]),n=orig?6:r(5,7),sp=orig?3:r(2,n-1),sl=orig?15:p([15,20]),br=10,len=45;
   const breaks=(n-1)*br+(sl-br),end=st+n*len+breaks;
   T.push({pts:2,q:`W szkole ${who} lekcje zaczynają się o godzinie ${hm(st)}. Przerwy trwają po ${br} minut, tylko ${ORD[sp-1]} przerwa — śniadaniowa — trwa ${sl} minut. Lekcje trwają po ${len} minut. ${nm} ma dzisiaj ${n} lekcji. <b>O której godzinie skończy lekcje?</b>`,
    f:[{l:'Godzina:',k:'time',a:end,ph:'gg:mm'}],
    ex:`${n} lekcji: ${n} · ${len} = ${n*len} min. Przerw jest o 1 mniej niż lekcji, czyli ${n-1}: ${n-2} · ${br} + ${sl} = ${breaks} min. Razem ${n*len+breaks} min = ${Math.floor((n*len+breaks)/60)} h ${(n*len+breaks)%60} min. ${hm(st)} + ${Math.floor((n*len+breaks)/60)} h ${(n*len+breaks)%60} min = <b>${hm(end)}</b>.`,
    fr:1.5,err:'wynik 13:05 zamiast 13:15 – w liczeniu krok po kroku zgubiło się 10 minut. Szybciej: policz osobno czas lekcji i przerw.'})}

  /* 12. owoce */
  {const RZ=['','','dwa','trzy'];let P,m,d;
   if(orig){P=40;m=2;d=130}else{P=r(3,12)*5;m=p([2,3]);d=r(4,16)*10;if((P*m+d)%2)d+=5}
   const C=P*m,W=C+d,e=W/2,tot=W+C+P;
   T.push({pts:2,q:`Tata przyniósł wiśnie, czereśnie i porzeczki. Wiśnie ważyły o ${dagTxt(d)} więcej od czereśni, a czereśnie ważyły ${RZ[m]} razy więcej niż porzeczki. Wiadomo, że wiśnie ważyły tyle, co połowa ich samych i jeszcze ${dagTxt(e)}. <b>Ile ważyły wszystkie owoce?</b>`,
    f:[{l:'Razem:',k:'pair',u:['kg','dag'],a:[Math.floor(tot/100),tot%100]}],
    ex:`Zacznij od wiśni: skoro wiśnie = połowa wiśni + ${dagTxt(e)}, to druga połowa wiśni to ${dagTxt(e)}, więc wiśnie = 2 · ${e} dag = ${W} dag.<br>Czereśnie: ${W} − ${d} = ${C} dag. Porzeczki: ${C} : ${m} = ${P} dag.<br>Razem: ${W} + ${C} + ${P} = ${tot} dag = <b>${dagTxt(tot)}</b>.`,
    fr:0,err:'brak rozwiązania – klucz to zacząć od wiśni („połowa i jeszcze…”).'})}

  const SK=[['dec'],['mem2'],['money'],['len','mass','clock'],['cal'],['cal'],['mass'],['cmp'],['len'],['roman'],['clock'],['mass']];
  T.forEach((t,i)=>{t.n=i+1;t.skills=SK[i];const each=t.pts/t.f.length;t.f.forEach(fd=>{if(fd.pts==null)fd.pts=each})});
  return{kind,orig,tasks:T,max:T.reduce((s,t)=>s+t.pts,0),title:orig?'Oryginał (grupa A)':kind==='rand'?'Losowy zestaw':`Wariant ${kind.slice(1)}`};
}

export const systemyLiczb: SchoolTest = {
  id: 'mat-systemy-2026-11-23',
  title: 'Systemy zapisywania liczb',
  info: 'GWO · kl. 4 · grupa A · 12 zadań, 25 p.',
  date: '2026-11-23',
  max: 25,
  result: { pts: 18.5, pct: 74, grade: 3, notes: 'Do poprawy: zamiana jednostek (km→m, dag→g), porównywanie dużych liczb, zadania z treścią (kroki, plan lekcji, owoce).' },
  build,
};
