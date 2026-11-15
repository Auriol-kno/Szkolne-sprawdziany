const TOPICS=[
 {id:'addsub',ch:1,name:'Dodawanie i odejmowanie',hint:'Dodawaj i odejmuj osobno tysiące, setki, dziesiątki i jedności. Sprawdź wynik działaniem odwrotnym.'},
 {id:'muldiv',ch:1,name:'Mnożenie i dzielenie',hint:'Rozłóż liczbę na dziesiątki i jedności. Dzielenie sprawdzaj mnożeniem.'},
 {id:'rem',ch:1,name:'Dzielenie z resztą',hint:'Reszta musi być mniejsza od dzielnika.'},
 {id:'word',ch:1,name:'Zadania tekstowe',hint:'Zastanów się, co jest dane, a co trzeba obliczyć. Policz po kolei.'},
 {id:'line',ch:1,name:'Oś liczbowa',hint:'Najpierw oblicz, ile wynosi jedna działka.'},
 {id:'factor',ch:1,name:'Brakujący czynnik',hint:'Brakujący czynnik to iloczyn podzielony przez znany czynnik.'},
 {id:'pow',ch:1,name:'Kwadrat i sześcian',hint:'Kwadrat liczby to a · a, a sześcian to a · a · a.'},
 {id:'diff',ch:1,name:'O ile więcej, o ile mniej',hint:'„O ile” to dodawanie lub odejmowanie. Zastanów się, która liczba jest większa.'},
 {id:'neigh',ch:1,name:'Działania na opisanych liczbach',hint:'Najpierw znajdź drugą liczbę, potem wykonaj działanie.'},
 {id:'age',ch:1,name:'Zadania o wieku',hint:'Różnica wieku między dwiema osobami nigdy się nie zmienia.'},
 {id:'times',ch:1,name:'Ile razy więcej, ile mniej',hint:'„O … więcej/mniej” to dodawanie lub odejmowanie, „… razy więcej/mniej” to mnożenie lub dzielenie.'},
 {id:'order',ch:1,name:'Kolejność działań',hint:'Nawiasy, potęgi, mnożenie i dzielenie od lewej, na końcu dodawanie i odejmowanie.'},
 {id:'puzzle',ch:1,name:'Zagadki liczbowe',hint:'Zastanów się, o ile zmieniła się suma. To podpowiada, ile wynosi szukana liczba.'}
];
const T=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
const CHAPTERS={1:'Zadania ze sprawdzianu'};
const f=n=>Number(n).toLocaleString('pl-PL');
const lat=n=>plural(n,'rok','lata','lat');
const ex=s=>`<div class="expr">${s}</div>`;
const BOX='<span class="box" aria-label="okienko">□</span>';
const sq=n=>`${n}<sup>2</sup>`, cu=n=>`${n}<sup>3</sup>`;
const NF=['Kasia','Ola','Zosia','Lena','Julia','Hania'], NMn=['Franek','Kuba','Tymek','Staś','Antek','Marek'];
const G={
addsub(L){
  const v=R(0,2);
  if(v===0){
    const big=L===3,tot=big?1000:100;
    const x=big?R(101,899):R(11,89),z=big?R(101,899):R(11,89),y=tot-x,w=tot-z;
    const ord=L===1?[x,y,z,w]:[x,z,y,w],s=x+y+z+w;
    return{html:'Oblicz w pamięci.'+ex(ord.map(f).join(' + ')+' ='),fields:[{ans:s}],
      hint:`Poszukaj dwóch par liczb, które razem dają ${f(tot)}.`,
      expl:`Łączymy składniki w pary: (${f(x)} + ${f(y)}) + (${f(z)} + ${f(w)}) = ${f(tot)} + ${f(tot)} = ${f(s)}.`};
  }
  if(L===3&&R(0,1)){
    const a=R(200,900),b=R(150,600),c=R(100,a+b-50),s1=a+b;
    return{html:'Oblicz.'+ex(`${f(a)} + ${f(b)} − ${f(c)} =`),fields:[{ans:s1-c}],hint:'Gdy są tylko dodawanie i odejmowanie, liczysz po kolei od lewej.',
      expl:`${f(a)} + ${f(b)} = ${f(s1)}, potem ${f(s1)} − ${f(c)} = ${f(s1-c)}.`};
  }
  const add=v===1;let a,b;
  if(L===1){if(add){a=R(11,70);b=R(10,99-a)}else{a=R(30,99);b=R(11,a-5)}}
  else if(L===2){if(add){a=R(105,699);b=R(105,999-a)}else{a=R(300,999);b=R(101,a-20)}}
  else{if(add){a=R(1050,6999);b=R(1050,9999-a)}else{a=R(3000,9999);b=R(1050,a-100)}}
  const res=add?a+b:a-b,op=add?'+':'−';let expl;
  if(L===1){const bt=b-b%10,bu=b%10,m=add?a+bt:a-bt;
    expl=bu?`Rozkładamy ${b} na ${bt} i ${bu}: ${a} ${op} ${bt} = ${m}, a ${m} ${op} ${bu} = ${res}.`:`${a} ${op} ${b} = ${res}.`}
  else expl=add?`${f(a)} + ${f(b)} = ${f(res)}. Sprawdzenie: ${f(res)} − ${f(b)} = ${f(a)}.`:`${f(a)} − ${f(b)} = ${f(res)}. Sprawdzenie: ${f(res)} + ${f(b)} = ${f(a)}.`;
  return{html:'Oblicz.'+ex(`${f(a)} ${op} ${f(b)} =`),fields:[{ans:res}],
    hint:add?'Dodawaj osobno tysiące, setki, dziesiątki i jedności.':'Możesz odjąć najpierw pełne setki lub dziesiątki, a potem resztę.',expl};
},
muldiv(L){
  if(R(0,1)){
    let a,b;if(L===1){a=R(2,5);b=R(11,25)}else if(L===2){a=R(3,9);b=R(24,99)}else{a=R(12,29);b=R(11,25)}
    const bt=b-b%10,bu=b%10,p=a*b;
    return{html:'Oblicz.'+ex(`${a} · ${b} =`),fields:[{ans:p}],
      hint:bu?`Rozłóż ${b} na ${bt} i ${bu}. Pomnóż każdą część przez ${a} i dodaj wyniki.`:`Pomnóż ${a} przez ${bt/10} i dopisz zero.`,
      expl:bu?`${a} · ${b} = ${a} · ${bt} + ${a} · ${bu} = ${f(a*bt)} + ${f(a*bu)} = ${f(p)}.`:`${a} · ${b} = ${f(p)}.`};
  }
  let d,q;if(L===1){d=R(2,9);q=R(6,20)}else if(L===2){d=R(11,25);q=R(2,9)}else{d=R(12,40);q=R(11,30)}
  const n=d*q;
  return{html:'Oblicz.'+ex(`${f(n)} : ${d} =`),fields:[{ans:q}],hint:`Szukasz liczby, która pomnożona przez ${d} da ${f(n)}.`,
    expl:`${f(n)} : ${d} = ${q}, bo ${d} · ${q} = ${f(n)}.`};
},
rem(L){
  let d,q;if(L===1){d=R(3,9);q=R(3,10)}else if(L===2){d=R(6,12);q=R(6,15)}else{d=R(11,25);q=R(8,20)}
  const r=R(1,d-1),n=d*q+r;
  return{html:'Wykonaj dzielenie z resztą.'+ex(`${f(n)} : ${d} =`),fields:[{label:'Wynik',ans:q},{label:'Reszta',ans:r}],
    hint:`Znajdź największą wielokrotność liczby ${d}, która nie przekracza ${f(n)}. Reszta musi być mniejsza od ${d}.`,
    expl:`${d} · ${q} = ${f(d*q)}, a ${f(n)} − ${f(d*q)} = ${r}. Zatem ${f(n)} : ${d} = ${q} r. ${r}. Reszta ${r} jest mniejsza od ${d}, więc wynik jest dobry.`};
},
word(L){
  const T1=[
    ()=>{const n=R(12,40),k=R(2,6),nm=P(['Tadeusz','Józef','Adam','Zbigniew']);
      return{html:`Pan ${nm} zrobił drewniany płot składający się z ${n} sztachet. Do przymocowania jednej sztachety zużył ${k} ${plural(k,'wkręt','wkręty','wkrętów')}. Ile wkrętów zużył na cały płot?`,
      ans:n*k,label:'Liczba wkrętów',hint:'Każda sztacheta potrzebuje tyle samo wkrętów. Które działanie pasuje: dodawanie czy mnożenie?',expl:`${n} sztachet po ${k} ${plural(k,'wkręt','wkręty','wkrętów')}: ${n} · ${k} = ${n*k}.`}},
    ()=>{const n=R(3,9),k=R(5,21);
      return{html:`W jednym pudełku jest ${k} kredek. Ile kredek jest w ${n} takich pudełkach?`,ans:n*k,label:'Liczba kredek',
      hint:'Wszystkie pudełka mają tyle samo kredek.',expl:`${n} · ${k} = ${n*k}.`}},
    ()=>{const n=R(3,9),e=R(4,12),t=n*e;
      return{html:`${t} ${plural(t,'cukierek','cukierki','cukierków')} zapakowano po równo do ${n} torebek. Ile cukierków jest w jednej torebce?`,ans:e,label:'W jednej torebce',
      hint:'Dzielimy po równo, więc potrzebne jest dzielenie.',expl:`${t} : ${n} = ${e}, bo ${n} · ${e} = ${t}.`}}
  ];
  const T2=[
    ()=>{const c=P([12,15,18,20,25]);let s;do{s=R(40,130)}while(s%c===0);const q=Math.floor(s/c),r=s%c;
      return{html:`Na wycieczkę jedzie ${s} ${plural(s,'osoba','osoby','osób')}. W jednym busie mieści się ${c} pasażerów. Ile co najmniej busów trzeba zamówić?`,ans:q+1,label:'Liczba busów',
      hint:'Podziel z resztą. Pomyśl, co zrobić z osobami, które zostaną.',expl:`${s} : ${c} = ${q} r. ${r}. W ${q} ${plural(q,'busie','busach','busach')} zmieści się ${q*c} osób, a ${r} ${plural(r,'osoba zostanie','osoby zostaną','osób zostanie')}. Potrzebny jest jeszcze jeden bus: ${q} + 1 = ${q+1}.`}},
    ()=>{const p=R(3,9),q=R(2,6),a=R(3,8),b=R(2,6);
      return{html:`Zeszyt kosztuje ${p} zł, a długopis ${q} zł. Ile złotych trzeba zapłacić za ${a} ${plural(a,'zeszyt','zeszyty','zeszytów')} i ${b} ${plural(b,'długopis','długopisy','długopisów')}?`,ans:a*p+b*q,label:'Złotych',
      hint:'Policz osobno zeszyty i długopisy, a potem dodaj.',expl:`Zeszyty: ${a} · ${p} = ${a*p} zł. Długopisy: ${b} · ${q} = ${b*q} zł. Razem: ${a*p} + ${b*q} = ${a*p+b*q} zł.`}},
    ()=>{const k=R(3,6),n=R(14,45),t=n*k;
      return{html:`Na wykonanie płotu zużyto ${t} ${plural(t,'wkręt','wkręty','wkrętów')}, po ${k} na każdą sztachetę. Z ilu sztachet składa się płot?`,ans:n,label:'Liczba sztachet',
      hint:'Wiesz, ile było wszystkich wkrętów i ile idzie na jedną sztachetę.',expl:`${t} : ${k} = ${n}, bo ${k} · ${n} = ${t}.`}}
  ];
  const T3=[
    ()=>{const a=R(2,5),p=R(3,7),b=R(2,4),q=R(4,8),cost=a*p+b*q,m=Math.ceil((cost+1)/50)*50;
      return{html:`Mama miała ${m} zł. Kupiła ${a} kg jabłek po ${p} zł za kilogram i ${b} bochenki chleba po ${q} zł. Ile złotych reszty otrzymała?`,ans:m-cost,label:'Reszta (zł)',
      hint:'Najpierw oblicz, ile kosztowały wszystkie zakupy.',expl:`Jabłka: ${a} · ${p} = ${a*p} zł. Chleb: ${b} · ${q} = ${b*q} zł. Zakupy: ${a*p} + ${b*q} = ${cost} zł. Reszta: ${m} − ${cost} = ${m-cost} zł.`}},
    ()=>{let n,k,d;do{n=R(150,320);k=R(12,25);d=R(3,8)}while(k*d>=n);const nm=P(NMn);
      return{html:`Książka ma ${n} ${plural(n,'stronę','strony','stron')}. ${nm} czyta codziennie ${k} ${plural(k,'stronę','strony','stron')}. Ile stron zostanie mu do przeczytania po ${d} dniach?`,ans:n-k*d,label:'Liczba stron',
      hint:'Oblicz, ile stron przeczyta w ciągu wszystkich dni, i odejmij od całej książki.',expl:`Przez ${d} dni: ${d} · ${k} = ${k*d}. Zostaje: ${n} − ${k*d} = ${n-k*d}.`}},
    ()=>{const c=P([5,8,10,12,15]),q=R(12,40),t=c*q,p=R(20,45);
      return{html:`Sadownik zebrał ${f(t)} kg jabłek i zapakował je do skrzynek po ${c} kg. Każdą skrzynkę sprzedał za ${p} zł. Ile złotych zarobił?`,ans:q*p,label:'Złotych',
      hint:'Najpierw oblicz, ile było skrzynek.',expl:`Skrzynki: ${f(t)} : ${c} = ${q}. Zarobek: ${q} · ${p} = ${f(q*p)} zł.`}}
  ];
  const o=P({1:T1,2:T2,3:T3}[L])();
  return{html:o.html,fields:[{label:o.label,ans:o.ans}],hint:o.hint,expl:o.expl};
},
line(L){
  let s=0,step;if(L===1)step=P([1,2]);else if(L===2)step=P([5,10,20,25]);else{step=P([25,50,100,250]);s=P([100,200,500,1000])}
  const j=R(2,5);let p;do{p=R(1,10)}while(p===j);
  const val=s+p*step,mark=R(0,1);
  const ln={labels:[[0,s],[j,s+j*step]],point:mark?null:p};
  const expl=`Od ${f(s)} do ${f(s+j*step)} ${j<5?'są':'jest'} ${j} ${plural(j,'działka','działki','działek')}, więc jedna działka to (${f(s+j*step)} − ${f(s)}) : ${j} = ${f(step)}. ${mark?'Liczba':'Punkt A'} leży ${p} ${plural(p,'działkę','działki','działek')} na prawo od ${f(s)}: ${f(s)} + ${p} · ${f(step)} = ${f(val)}.`;
  const hint='Najpierw oblicz, ile wynosi jedna działka: podziel różnicę podpisanych liczb przez liczbę działek między nimi.';
  if(mark)return{html:`Zaznacz na osi liczbowej liczbę <b>${f(val)}</b>. Kliknij właściwą kreskę.`,line:ln,fields:[{mark:true,ans:p,show:f(val)}],hint,expl};
  return{html:'Wpisz współrzędną punktu A zaznaczonego na osi liczbowej.',line:ln,fields:[{label:'A =',ans:val}],hint,expl};
},
factor(L){
  let a,x;
  if(L===3&&R(0,2)===0){const b=R(2,9)*10,y=R(2,9)*10,c=b*y;
    return{html:'Uzupełnij.'+ex(`${BOX} : ${b} = ${y}`),fields:[{label:'□ =',ans:c}],hint:'Dzielenie sprawdzamy mnożeniem. Jaka liczba podzielona przez '+b+' da '+y+'?',
      expl:`□ = ${y} · ${b} = ${f(c)}. Sprawdzenie: ${f(c)} : ${b} = ${y}.`}}
  if(L===1){a=R(2,9);x=R(2,9)*10}
  else if(L===2){if(R(0,1)){a=R(2,9);x=R(2,9)*100}else{a=R(2,9)*10;x=P([R(2,9),R(2,9)*10])}}
  else{a=R(2,9)*10;x=R(2,9)*100}
  const c=a*x,lhs=R(0,1)?`${BOX} · ${f(a)}`:`${f(a)} · ${BOX}`;
  const zero=a%10===0?` Możesz skreślić po jednym zerze: ${f(c/10)} : ${a/10} = ${f(x)}.`:'';
  return{html:'Uzupełnij.'+ex(`${lhs} = ${f(c)}`),fields:[{label:'□ =',ans:x}],hint:`Brakujący czynnik to iloczyn podzielony przez znany czynnik: ${f(c)} : ${f(a)}.`,
    expl:`□ = ${f(c)} : ${f(a)} = ${f(x)}.${zero} Sprawdzenie: ${f(x)} · ${f(a)} = ${f(c)}.`};
},
pow(L){
  if(L===1){const n=R(2,10);
    return R(0,1)?{html:'Oblicz.'+ex(`${sq(n)} =`),fields:[{ans:n*n}],hint:'Kwadrat liczby to ta liczba pomnożona przez samą siebie.',expl:`${sq(n)} = ${n} · ${n} = ${n*n}.`}
      :{html:`Zapisz i oblicz kwadrat liczby ${n}.`,fields:[{ans:n*n}],hint:`Kwadrat liczby ${n} zapisujemy jako ${sq(n)}.`,expl:`${sq(n)} = ${n} · ${n} = ${n*n}.`}}
  if(L===2){
    if(R(0,1)){const n=R(2,6);return{html:`Zapisz i oblicz sześcian liczby ${n}.`,fields:[{ans:n**3}],hint:`Sześcian to ${cu(n)}, czyli ${n} · ${n} · ${n}.`,expl:`${cu(n)} = ${n} · ${n} · ${n} = ${n*n} · ${n} = ${n**3}.`}}
    const n=P([11,12,15,20,30,40,50]);return{html:'Oblicz.'+ex(`${sq(n)} =`),fields:[{ans:n*n}],hint:`Policz ${n} · ${n}.`,expl:`${sq(n)} = ${n} · ${n} = ${f(n*n)}.`};
  }
  const v=R(0,3);
  if(v===0){const a=R(2,9),b=R(2,4);return{html:'Oblicz.'+ex(`${sq(a)} + ${cu(b)} =`),fields:[{ans:a*a+b**3}],hint:'Najpierw oblicz potęgi, potem dodaj.',expl:`${sq(a)} = ${a*a}, ${cu(b)} = ${b**3}, więc ${a*a} + ${b**3} = ${a*a+b**3}.`}}
  if(v===1){const a=R(5,12),b=R(2,a-1);return{html:'Oblicz.'+ex(`${sq(a)} − ${sq(b)} =`),fields:[{ans:a*a-b*b}],hint:'Najpierw oblicz oba kwadraty.',expl:`${sq(a)} = ${a*a}, ${sq(b)} = ${b*b}, więc ${a*a} − ${b*b} = ${a*a-b*b}.`}}
  if(v===2){const a=R(2,6),b=R(2,12-a);return{html:'Oblicz.'+ex(`(${a} + ${b})<sup>2</sup> =`),fields:[{ans:(a+b)**2}],hint:'Najpierw działanie w nawiasie, potem potęga.',expl:`${a} + ${b} = ${a+b}, a ${sq(a+b)} = ${a+b} · ${a+b} = ${(a+b)**2}.`}}
  const n=R(4,30);return{html:'Oblicz.'+ex(`${cu(10)} − ${sq(n)} =`),fields:[{ans:1000-n*n}],hint:`${cu(10)} = 10 · 10 · 10.`,expl:`${cu(10)} = 1000, ${sq(n)} = ${n*n}, więc 1000 − ${n*n} = ${1000-n*n}.`};
},
diff(L){
  const rg={1:[[20,99],[2,15]],2:[[100,999],[12,250]],3:[[1000,9999],[105,2500]]}[L];
  const d=R(...rg[1]);let b=Math.max(R(...rg[0]),d+10);const a=b+d,t=R(1,6);
  const H='„O ile większa” i „o ile mniejsza” rozwiązujemy dodawaniem albo odejmowaniem. Zastanów się, która liczba jest większa.';
  const o=[
    ()=>({html:`Liczba ${BOX} jest o ${f(d)} większa od ${f(b)}.`,ans:a,expl:`${f(b)} + ${f(d)} = ${f(a)}.`}),
    ()=>({html:`Liczba ${BOX} jest o ${f(d)} mniejsza od ${f(a)}.`,ans:b,expl:`${f(a)} − ${f(d)} = ${f(b)}.`}),
    ()=>({html:`Liczba ${f(a)} jest o ${BOX} większa od ${f(b)}.`,ans:d,expl:`Różnica: ${f(a)} − ${f(b)} = ${f(d)}.`}),
    ()=>({html:`Liczba ${f(b)} jest o ${BOX} mniejsza od ${f(a)}.`,ans:d,expl:`Różnica: ${f(a)} − ${f(b)} = ${f(d)}.`}),
    ()=>({html:`Liczba ${f(a)} jest o ${f(d)} większa od ${BOX}.`,ans:b,expl:`Szukana liczba jest mniejsza: ${f(a)} − ${f(d)} = ${f(b)}.`}),
    ()=>({html:`Liczba ${f(b)} jest o ${f(d)} mniejsza od ${BOX}.`,ans:a,expl:`Szukana liczba jest większa: ${f(b)} + ${f(d)} = ${f(a)}.`})
  ][t-1]();
  return{html:'Wpisz odpowiednią liczbę w okienko.'+`<div class="expr" style="font-size:clamp(1.45rem,5.5vw,2.1rem)">${o.html}</div>`,fields:[{label:'□ =',ans:o.ans}],hint:H,expl:o.expl};
},
neigh(L){
  const v=R(0,2);
  if(L===1){
    if(v){const a=R(5,40),d=R(3,15),b=a+d;return{html:`Oblicz sumę liczby ${a} i liczby o ${d} od niej większej.`,fields:[{ans:a+b}],hint:`Najpierw znajdź liczbę o ${d} większą od ${a}.`,expl:`Liczba o ${d} większa od ${a} to ${a} + ${d} = ${b}. Suma: ${a} + ${b} = ${a+b}.`}}
    const a=R(2,9),d=R(1,6),b=a+d;return{html:`Oblicz iloczyn liczby ${a} i liczby o ${d} od niej większej.`,fields:[{ans:a*b}],hint:'Iloczyn to wynik mnożenia.',expl:`Druga liczba: ${a} + ${d} = ${b}. Iloczyn: ${a} · ${b} = ${a*b}.`};
  }
  if(L===2){
    if(v===0){const a=R(3,9),d=R(5,15),b=a+d;return{html:`Oblicz iloczyn liczby ${a} i liczby o ${d} od niej większej.`,fields:[{ans:a*b}],hint:'Iloczyn to wynik mnożenia.',expl:`Druga liczba: ${a} + ${d} = ${b}. Iloczyn: ${a} · ${b} = ${a*b}.`}}
    if(v===1){const a=R(30,99),d=R(5,25),b=a-d;return{html:`Oblicz różnicę liczby ${a} i liczby o ${d} od niej mniejszej.`,fields:[{ans:d}],hint:'Różnica to wynik odejmowania. Druga liczba jest mniejsza o…?',expl:`Druga liczba: ${a} − ${d} = ${b}. Różnica: ${a} − ${b} = ${d}.`}}
    const b=R(2,9),k=R(2,9),n=b*k,d=n-b;return{html:`Oblicz iloraz liczby ${n} i liczby o ${d} od niej mniejszej.`,fields:[{ans:k}],hint:'Iloraz to wynik dzielenia.',expl:`Druga liczba: ${n} − ${d} = ${b}. Iloraz: ${n} : ${b} = ${k}.`};
  }
  if(v===0){const a=R(3,12),k=R(2,5),b=a*k;return{html:`Oblicz iloczyn liczby ${a} i liczby ${k} razy od niej większej.`,fields:[{ans:a*b}],hint:'„Razy większa” oznacza mnożenie.',expl:`Druga liczba: ${a} · ${k} = ${b}. Iloczyn: ${a} · ${b} = ${a*b}.`}}
  if(v===1){const m=R(4,30),k=R(2,6),n=m*k;return{html:`Oblicz iloraz liczby ${n} i liczby ${k} razy od niej mniejszej.`,fields:[{ans:k}],hint:'„Razy mniejsza” oznacza dzielenie.',expl:`Druga liczba: ${n} : ${k} = ${m}. Iloraz: ${n} : ${m} = ${k}.`}}
  const a=R(2,5),d=R(1,3),b=a+d,s=a+b;return{html:`Oblicz kwadrat sumy liczby ${a} i liczby o ${d} od niej większej.`,fields:[{ans:s*s}],hint:'Najpierw suma, potem kwadrat sumy.',expl:`Druga liczba: ${a} + ${d} = ${b}. Suma: ${a} + ${b} = ${s}. Kwadrat sumy: ${sq(s)} = ${s*s}.`};
},
age(L){
  const fem=R(0,1),kid=fem?P(NF):P(NMn),y=fem?'a':'y',on=fem?'niej':'niego',sie=fem?'urodziła':'urodził';
  if(L===1){
    const a=R(6,12),d=R(22,36);
    if(R(0,1))return{html:`${kid} ma ${a} ${lat(a)}. Mama jest od ${on} o ${d} ${lat(d)} starsza. Ile lat ma mama?`,fields:[{label:'Wiek mamy',ans:a+d}],hint:'Mama jest starsza, więc ma więcej lat.',expl:`${a} + ${d} = ${a+d}.`};
    const t=a+d;return{html:`Tata ma ${t} ${lat(t)}, a ${kid} jest o ${d} ${lat(d)} młodsz${y} od taty. Ile lat ma ${kid}?`,fields:[{label:`Wiek: ${kid}`,ans:a}],hint:'Kto jest młodszy, ma mniej lat.',expl:`${t} − ${d} = ${a}.`};
  }
  if(L===2){
    const a=R(7,13),d=R(22,36),v=R(0,2);
    if(v===0)return{html:`${kid} ma ${a} ${lat(a)} i jest o ${d} ${lat(d)} młodsz${y} od swojej mamy. Ile lat miała mama, gdy ${kid} się ${sie}?`,fields:[{label:'Wiek mamy',ans:d}],
      hint:'Różnica wieku między dwiema osobami nigdy się nie zmienia.',expl:`Gdy ${kid} się ${sie}, ${fem?'miała':'miał'} 0 lat. Mama jest zawsze o ${d} ${lat(d)} starsza, więc miała wtedy ${d} ${lat(d)}. (Mama ma teraz ${a} + ${d} = ${a+d} ${lat(a+d)}, a ${a+d} − ${a} = ${d}.)`};
    if(v===1){const b=R(a+3,18);return{html:`${kid} ma ${a} ${lat(a)}, a mama jest od ${on} o ${d} ${lat(d)} starsza. Ile lat będzie miała mama, gdy ${kid} będzie mieć ${b} ${lat(b)}?`,fields:[{label:'Wiek mamy',ans:b+d}],
      hint:'Różnica wieku zostaje taka sama.',expl:`Mama zawsze jest o ${d} ${lat(d)} starsza: ${b} + ${d} = ${b+d}.`}}
    return{html:`${kid} ma ${a} ${lat(a)}. Za ile lat skończy 18 lat?`,fields:[{label:'Za ile lat',ans:18-a}],hint:'Ile lat brakuje do 18?',expl:`18 − ${a} = ${18-a}.`};
  }
  const v=R(0,2);
  if(v===0){const k=P([3,4]),a=k===3?R(8,13):R(8,11),m=a*k;
    return{html:`${kid} ma ${a} ${lat(a)}, a mama jest ${k} razy starsza. Ile lat miała mama, gdy ${kid} się ${sie}?`,fields:[{label:'Wiek mamy',ans:m-a}],
    hint:'Oblicz najpierw obecny wiek mamy, potem różnicę wieku.',expl:`Mama ma ${a} · ${k} = ${m} ${lat(m)}. Różnica wieku: ${m} − ${a} = ${m-a}. Tyle lat miała mama, gdy ${kid} się ${sie}.`}}
  if(v===1){const a=R(7,12),d=R(25,38),n=R(2,8),t=a+d;
    return{html:`${kid} ma ${a} ${lat(a)}, a tata jest od ${on} o ${d} ${lat(d)} starszy. Ile lat razem będą mieli za ${n} ${lat(n)}?`,fields:[{label:'Razem',ans:a+n+t+n}],
    hint:'Za kilka lat oboje będą starsi o tyle samo lat.',expl:`Tata ma teraz ${a} + ${d} = ${t}. Za ${n} ${lat(n)}: ${kid} ${a+n}, tata ${t+n}. Razem: ${a+n} + ${t+n} = ${a+n+t+n}.`}}
  const m=R(30,42),g=R(22,30),k=R(5,14),b=m+g;
  return{html:`Mama ma ${m} ${lat(m)}. Babcia jest od mamy o ${g} ${lat(g)} starsza, a ${kid} jest o ${m-k} ${lat(m-k)} młodsz${y} od mamy. Ile lat mają wszyscy razem?`,fields:[{label:'Razem',ans:m+b+k}],
    hint:'Oblicz osobno wiek babci i dziecka, potem dodaj trzy liczby.',expl:`Babcia: ${m} + ${g} = ${b}. ${kid}: ${m} − ${m-k} = ${k}. Razem: ${m} + ${b} + ${k} = ${m+b+k}.`};
},
times(L){
  const A=P(NF),B=P(NF.filter(n=>n!==A)),C=P(NMn);
  const cx=P([
    {intro:'W wyborach na najsympatyczniejszego ucznia',v:'otrzymała',u:n=>plural(n,'głos','głosy','głosów'),g:'głosów',q:'Ile głosów otrzymało każde dziecko?'},
    {intro:'Podczas zbiórki kasztanów',v:'zebrała',u:()=>'kg',g:'kasztanów',q:'Ile kilogramów kasztanów zebrało każde dziecko?'},
    {intro:'W szkolnym konkursie matematycznym',v:'zdobyła',u:n=>plural(n,'punkt','punkty','punktów'),g:'punktów',q:'Ile punktów zdobyło każde dziecko?'}
  ]);
  const d=R(3,12),k=L===1?2:R(2,4),more2=L>1&&R(0,1),more3=L>1&&R(0,1);
  let a,b,c,ref,txt;
  if(L<3){a=R(8,25)*k;b=more2?a+d:a-d;c=more3?a*k:a/k;ref=A}
  else{b=R(6,20)*k;a=more2?b-d:b+d;c=more3?b*k:b/k;ref=B}
  const fields=[{label:A,ans:a},{label:B,ans:b},{label:C,ans:c}];
  txt=`${cx.intro} ${A} ${cx.v} ${a} ${cx.u(a)}, ${B} o ${d} ${cx.u(d)} ${more2?'więcej':'mniej'}, a ${C} ${k} razy ${more3?'więcej':'mniej'} ${cx.g} niż ${ref}. ${cx.q}`;
  if(L===3){txt+=' Ile to razem?';fields.push({label:'Razem',ans:a+b+c})}
  const refv=L<3?a:b;
  let expl=`${A}: ${a}. ${B}: ${a} ${more2?'+':'−'} ${d} = ${b}. ${C}: ${refv} ${more3?'·':':'} ${k} = ${c}.`;
  if(L===3)expl+=` Razem: ${a} + ${b} + ${c} = ${a+b+c}.`;
  return{html:txt,fields,hint:'„O … mniej/więcej” to odejmowanie lub dodawanie, a „… razy mniej/więcej” to dzielenie lub mnożenie.',expl};
},
order(L){
  const v=R(0,2);let e,steps,res;
  if(L===1){
    if(v===0){const c=R(2,5),q=R(2,9),b=c*q,a=R(q+5,60),d=R(1,20);e=`${a} − ${b} : ${c} + ${d}`;res=a-q+d;steps=[`${b} : ${c} = ${q}`,`${a} − ${q} = ${a-q}`,`${a-q} + ${d} = ${res}`]}
    else if(v===1){const a=R(5,50),b=R(2,9),c=R(2,9);e=`${a} + ${b} · ${c}`;res=a+b*c;steps=[`${b} · ${c} = ${b*c}`,`${a} + ${b*c} = ${res}`]}
    else{const a=R(2,12),b=R(2,12),c=R(2,5);e=`(${a} + ${b}) · ${c}`;res=(a+b)*c;steps=[`${a} + ${b} = ${a+b}`,`${a+b} · ${c} = ${res}`]}
  }else if(L===2){
    if(v===0){const den=R(2,9),q=R(2,12),a=den*q,c=R(2,6),d=R(2,6),b=den+c*d;e=`${a} : (${b} − ${c} · ${d})`;res=q;steps=[`${c} · ${d} = ${c*d}`,`${b} − ${c*d} = ${den}`,`${a} : ${den} = ${q}`]}
    else if(v===1){const a=R(2,9),b=R(2,12),d=R(2,9),qq=R(1,a*b-1),c=d*qq;e=`${a} · ${b} − ${c} : ${d}`;res=a*b-qq;steps=[`${a} · ${b} = ${a*b}`,`${c} : ${d} = ${qq}`,`${a*b} − ${qq} = ${res}`]}
    else{const c=R(2,9),q=R(2,9),b=R(1,30),a=b+c*q,d=R(2,9),g=R(2,9);e=`(${a} − ${b}) : ${c} + ${d} · ${g}`;res=q+d*g;steps=[`${a} − ${b} = ${c*q}`,`${c*q} : ${c} = ${q}`,`${d} · ${g} = ${d*g}`,`${q} + ${d*g} = ${res}`]}
  }else{
    if(v===0){let a,b,c,d,df;do{a=R(6,12);d=R(1,8);df=R(2,6);c=d+df;b=R(2,9)}while(a*a<=b*df);e=`${sq(a)} − ${b} · (${c} − ${d})`;res=a*a-b*df;steps=[`${c} − ${d} = ${df}`,`${sq(a)} = ${a*a}`,`${b} · ${df} = ${b*df}`,`${a*a} − ${b*df} = ${res}`]}
    else if(v===1){const d=R(2,9),q=R(2,9),b=R(2,20),c=R(2,20),a=b+c+d*q,g=R(2,6);e=`(${a} − (${b} + ${c})) : ${d} · ${g}`;res=q*g;steps=[`${b} + ${c} = ${b+c}`,`${a} − ${b+c} = ${d*q}`,`${d*q} : ${d} = ${q}`,`${q} · ${g} = ${res}`]}
    else{const base=P([2,3]),ex2=base===2?3:2,pw=base**ex2;let s,c,q,a;do{s=R(2,9);c=R(1,s-1);q=R(2,9);a=R(2,9)}while(pw*a<=q);const d=s-c,b=s*q;
      e=`${base}<sup>${ex2}</sup> · ${a} − ${b} : (${c} + ${d})`;res=pw*a-q;steps=[`${c} + ${d} = ${s}`,`${base}<sup>${ex2}</sup> = ${pw}`,`${pw} · ${a} = ${pw*a}`,`${b} : ${s} = ${q}`,`${pw*a} − ${q} = ${res}`]}
  }
  return{html:'Oblicz, pamiętając o kolejności wykonywania działań.'+ex(e+' ='),fields:[{ans:res}],
    hint:'Kolejność: nawiasy, potęgi, potem mnożenie i dzielenie (od lewej), na końcu dodawanie i odejmowanie (od lewej).',expl:'Po kolei: '+steps.join('; ')+'.'};
},
puzzle(L){
  if(L===1){const x=R(5,40),d=R(2,20),y=x+d,S=x+y;
    return{html:`Suma dwóch liczb jest równa ${S}. Jedna z nich jest o ${d} większa od drugiej. Jakie to liczby?`,fields:[{label:'Mniejsza',ans:x},{label:'Większa',ans:y}],
    hint:`Gdyby odjąć od sumy nadwyżkę ${d}, zostałyby dwie równe liczby.`,expl:`${S} − ${d} = ${S-d}, a ${S-d} : 2 = ${x}. Mniejsza liczba to ${x}, większa ${x} + ${d} = ${y}. Sprawdzenie: ${x} + ${y} = ${S}.`}}
  if(L===2){const k=P([2,2,3]),m=R(8,35),x=k*m,y=R(10,60),S=x+y,N=m+y;
    return{html:`Suma dwóch liczb jest równa ${S}. Jeżeli jeden z jej składników podzielimy przez ${k}, to nowa suma wyniesie ${N}. Jakie to liczby?`,fields:[{label:`Dzielona przez ${k}`,ans:x},{label:'Druga liczba',ans:y}],
    hint:`Suma zmniejszyła się o ${S} − ${N}. O ile zmniejszył się składnik po podzieleniu przez ${k}?`,
    expl:`Suma zmalała o ${S} − ${N} = ${S-N}. ${k===2?`Po podzieleniu przez 2 liczba straciła swoją połowę, więc połowa tej liczby to ${S-N}, a cała liczba ${S-N} · 2 = ${x}.`:`Po podzieleniu przez 3 liczba straciła dwie trzecie, więc ${S-N} : 2 = ${m} to jedna trzecia, a cała liczba ${m} · 3 = ${x}.`} Druga liczba: ${S} − ${x} = ${y}.`}}
  if(R(0,1)){const k=R(2,4),x=R(5,30),y=R(10,60),S=x+y,N=k*x+y;
    return{html:`Suma dwóch liczb jest równa ${S}. Jeżeli jeden ze składników pomnożymy przez ${k}, to nowa suma wyniesie ${N}. Jakie to liczby?`,fields:[{label:`Mnożona przez ${k}`,ans:x},{label:'Druga liczba',ans:y}],
    hint:`O ile wzrosła suma? Ten wzrost to ${k-1} ${plural(k-1,'kopia','kopie','kopii')} mnożonej liczby.`,
    expl:`Suma wzrosła o ${N} − ${S} = ${N-S}. Po pomnożeniu przez ${k} doszło ${k-1} razy tyle co ta liczba: ${N-S} : ${k-1} = ${x}. Druga liczba: ${S} − ${x} = ${y}.`}}
  const x=R(2,9),k=R(2,5),y=x*k,p=x*y;
  return{html:`Iloczyn dwóch liczb jest równy ${p}. Jedna z nich jest ${k} razy większa od drugiej. Jakie to liczby?`,fields:[{label:'Mniejsza',ans:x},{label:'Większa',ans:y}],
    hint:`Mniejsza liczba pomnożona przez siebie daje ${p} : ${k}.`,expl:`Mniejsza · (${k} · mniejsza) = ${p}, więc mniejsza · mniejsza = ${p} : ${k} = ${p/k}. Ponieważ ${x} · ${x} = ${x*x}, mniejsza to ${x}, a większa ${x} · ${k} = ${y}.`};
}
};
const conv=o=>({type:'num',html:o.html,line:o.line,fields:o.fields.map(fd=>fd.mark?{mark:true,ans:fd.ans,show:fd.show}:{label:fd.label||'Wynik',ans:fd.ans,kind:'n'}),expl:o.expl,hint:o.hint,key:o.html+(o.line?JSON.stringify(o.line):'')});
const B={};
TOPICS.forEach(t=>{B[t.id]=[1,2,3].flatMap(l=>[0,1,2].map(()=>({l,f:()=>conv(G[t.id](l))})))});
