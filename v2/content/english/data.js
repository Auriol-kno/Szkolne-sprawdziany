import {R,P,plural,esc,shuffle,pickN,today,LV,CUR,toRoman,fromRoman,cent,rk,near,rnear,wnear,D,O,SQ,Ord,SQd,OrdD,NM,F,listExpl,chk} from '../../src/core/kit';
/* Dane przedmiotu: TOPICS = umiejętności (ch = numer lekcji), CHAPTERS = lekcje, B = generatory zadań wg poziomu. */
const TOPICS=[
 {id:'words',ch:1,name:'Słownictwo: szkoła i dom',hint:'Przypomnij sobie słówka z lekcji. Zgadnij z kontekstu.'},
 {id:'tobe',ch:1,name:'Czasownik to be',hint:'I am, you are, he/she/it is, we/you/they are.'},
 {id:'family',ch:1,name:'Rodzina i zwierzęta',hint:'mother, father, sister, brother, grandma, grandpa; cat, dog, bird, fish, horse, rabbit.'},
 {id:'numcol',ch:1,name:'Liczby, kolory, dni',hint:'Liczby do 20, kolory i dni tygodnia.'},
 {id:'canhave',ch:1,name:'Can i have got',hint:'I can swim. She has got a dog. They have got books.'},
 {id:'translate',ch:1,name:'Przetłumacz słowo',hint:'Wpisz słowo po angielsku małymi literami.'},
 {id:'favwords',ch:2,name:'Słownictwo z rozdziału: ulubione rzeczy',hint:'ball, bike, kite, doll, teddy bear, skateboard, scooter, comic, board game… oraz new, old, big, small, fast.'},
 {id:'demo',ch:2,name:'This, that, these, those',hint:'Blisko: this (jedna rzecz), these (wiele). Daleko: that (jedna), those (wiele). This/that is…, these/those are…'},
 {id:'beq',ch:2,name:'Pytania z czasownikiem be',hint:'W pytaniu be idzie na początek: Is it…? Are they…? Krótko: Yes, it is. / No, it isn’t.'},
 {id:'favtext',ch:2,name:'Krótki tekst o ulubionych rzeczach (str. 30)',hint:'My favourite thing is… It is (kolor, cechy). I play with it… Liczba mnoga: My favourite things are…'}
];
const T=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
const CHAPTERS={1:'Zestaw startowy (kl. 4)',2:'Ulubione rzeczy (str. 30) – na sprawdzian'};
const W=[['book','książka'],['pen','długopis'],['bag','plecak'],['desk','biurko'],['chair','krzesło'],['teacher','nauczyciel'],['window','okno'],['door','drzwi'],['table','stół'],['bed','łóżko'],['house','dom'],['school','szkoła'],['apple','jabłko'],['water','woda'],['bread','chleb'],['milk','mleko']];
const ANI=[['cat','kot'],['dog','pies'],['bird','ptak'],['fish','ryba'],['horse','koń'],['rabbit','królik'],['cow','krowa'],['pig','świnia']];
const FAM=[['mother','mama'],['father','tata'],['sister','siostra'],['brother','brat'],['grandmother','babcia'],['grandfather','dziadek'],['aunt','ciocia'],['uncle','wujek']];
const COL=[['red','czerwony'],['blue','niebieski'],['green','zielony'],['yellow','żółty'],['black','czarny'],['white','biały'],['orange','pomarańczowy'],['brown','brązowy']];
const NUMS=[['one',1],['two',2],['three',3],['four',4],['five',5],['six',6],['seven',7],['eight',8],['nine',9],['ten',10],['eleven',11],['twelve',12],['fifteen',15],['twenty',20]];
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const PRON=[['I','am'],['You','are'],['He','is'],['She','is'],['It','is'],['We','are'],['They','are']];
const trD=(l,list,toPl)=>D(l,()=>{const w=P(list);return{q:toPl?`Co znaczy po polsku: <b>${w[0]}</b>?`:`Jak jest po angielsku: <b>${w[1]}</b>?`,ok:toPl?w[1]:w[0],bad:pickN(list.filter(x=>x!==w).map(x=>toPl?x[1]:x[0]),3),expl:`${w[0]} = ${w[1]}.`}});
const B={
words:[trD(1,W,true),trD(1,W,false),trD(2,W,true),trD(2,W,false),trD(3,W.concat(ANI),true),trD(3,W.concat(ANI),false),
 SQ(2,'Gdzie to jest: w szkole czy w domu?',['w szkole','w domu'],[['book',0],['desk',0],['teacher',0],['pen',0],['bed',1],['table',1],['milk',1],['bread',1]],4,listExpl),
 SQ(3,'Gdzie to jest: w szkole czy w domu?',['w szkole','w domu'],[['book',0],['desk',0],['teacher',0],['pen',0],['bag',0],['bed',1],['table',1],['milk',1],['bread',1],['water',1]],6,listExpl)],
tobe:[
 D(1,()=>{const p=P(PRON);return{q:`${p[0]} ___ a student.`,ok:p[1],bad:['am','is','are'].filter(x=>x!==p[1]),expl:`${p[0]} ${p[1]}.`}}),
 D(2,()=>{const p=P(PRON);const n=P(['happy','tall','tired','hungry']);return{q:`${p[0]} ___ ${n}.`,ok:p[1],bad:['am','is','are'].filter(x=>x!==p[1]),expl:`Po „${p[0]}” używamy „${p[1]}”.`}}),
 O(2,'Które zdanie jest poprawne?','My brother is ten.',['My brother are ten.','My brother am ten.','My brother be ten.'],'Po „brother” (he) używamy „is”.'),
 O(2,'Jak zrobić przeczenie: „She is happy.”?','She is not happy.',['She not is happy.','She no happy.','She are not happy.'],'Przeczenie: is not (isn’t).'),
 O(3,'Które pytanie jest poprawne?','Are you a teacher?',['You are a teacher?','Do you be a teacher?','Is you a teacher?'],'W pytaniu zamieniamy miejscami: Are you …?'),
 O(3,'Wybierz poprawną odpowiedź: „Are they from Poland?”','Yes, they are.',['Yes, they is.','Yes, they am.','Yes, they be.'],'Krótka odpowiedź: Yes, they are.')],
family:[trD(1,FAM,true),trD(1,FAM,false),trD(2,ANI,true),trD(2,ANI,false),
 SQ(2,'Rodzina czy zwierzę?',['family','animal'],[['mother',0],['father',0],['sister',0],['brother',0],['cat',1],['dog',1],['horse',1],['fish',1]],4,listExpl),
 O(3,'My mother’s mother is my…','grandmother',['aunt','sister','daughter'],'Mama mamy to babcia, grandmother.'),
 O(3,'My father’s brother is my…','uncle',['grandfather','cousin','brother'],'Brat taty to wujek, uncle.')],
numcol:[
 D(1,()=>{const n=P(NUMS);return{q:`Która liczba to <b>${n[0]}</b>?`,ok:String(n[1]),bad:pickN(NUMS.filter(x=>x!==n).map(x=>String(x[1])),3),expl:`${n[0]} = ${n[1]}.`}}),
 trD(1,COL,true),trD(2,COL,false),
 D(2,()=>{const i=R(0,5);return{q:`Który dzień jest po <b>${DAYS[i]}</b>?`,ok:DAYS[i+1],bad:pickN(DAYS.filter(d=>d!==DAYS[i+1]),3),expl:`Po ${DAYS[i]} jest ${DAYS[i+1]}.`}}),
 Ord(3,'Ułóż dni tygodnia od poniedziałku.',['Monday','Tuesday','Wednesday','Thursday','Friday'],'Monday → Tuesday → Wednesday → Thursday → Friday.'),
 NM(3,()=>{const a=R(2,9),b=R(2,10);return{q:`Wpisz wynik cyfrą: ${a} plus ${b} to… (${a} + ${b})`,fields:[F('wynik',a+b,'n')],expl:`${a} + ${b} = ${a+b}.`}})],
canhave:[
 D(1,()=>{const a=P(['swim','run','jump','sing']);return{q:`I can ___ .`,ok:a,bad:[a+'s',a+'ing','to '+a],expl:`Po „can” używamy czasownika bez końcówek: can ${a}.`}}),
 O(1,'She ___ got a dog.','has',['have','is','are'],'He/she/it has got.'),
 O(2,'They ___ got two cats.','have',['has','is','are'],'I/you/we/they have got.'),
 O(2,'Które zdanie jest poprawne?','He can’t swim.',['He cans swim.','He can swims.','He no can swim.'],'Can nie zmienia formy, a przeczenie to can’t.'),
 O(3,'Jak zapytasz: „Czy ty masz brata?”','Have you got a brother?',['Do you got a brother?','You have got a brother?','Has you got a brother?'],'W pytaniu: Have you got …?'),
 O(3,'Odpowiedz krótko: „Can she play the piano?” (nie)','No, she can’t.',['No, she isn’t.','No, she doesn’t.','No, she hasn’t.'],'Krótka odpowiedź powtarza „can”.')],
translate:[
 NM(1,()=>{const w=P(W.concat(ANI));return{q:`Wpisz po angielsku: <b>${w[1]}</b>`,fields:[F('po angielsku',w[0],'t')],expl:`${w[1]} = ${w[0]}.`}}),
 NM(2,()=>{const w=P(FAM.concat(COL));return{q:`Wpisz po angielsku: <b>${w[1]}</b>`,fields:[F('po angielsku',w[0],'t')],expl:`${w[1]} = ${w[0]}.`}}),
 NM(3,()=>{const w=P(W.concat(ANI,FAM,COL));return{q:`Wpisz po angielsku: <b>${w[1]}</b>`,fields:[F('po angielsku',w[0],'t')],expl:`${w[1]} = ${w[0]}.`}})]
};

/* ---------- rozdział: ulubione rzeczy (słownictwo wstępne – do podmiany po otrzymaniu książki) ---------- */
const FAV=[['ball','piłka'],['bike','rower'],['kite','latawiec'],['doll','lalka'],['teddy bear','miś'],['skateboard','deskorolka'],['scooter','hulajnoga'],['comic','komiks'],['board game','gra planszowa'],['computer game','gra komputerowa'],['puzzle','układanka'],['camera','aparat'],['watch','zegarek'],['headphones','słuchawki'],['car','samochód']];
const FADJ=[['new','nowy'],['old','stary'],['big','duży'],['small','mały'],['fast','szybki'],['favourite','ulubiony'],['beautiful','piękny'],['funny','zabawny']];
const PLF={ball:'balls',bike:'bikes',kite:'kites',doll:'dolls','teddy bear':'teddy bears',skateboard:'skateboards',scooter:'scooters',comic:'comics','board game':'board games','computer game':'computer games',puzzle:'puzzles',camera:'cameras',watch:'watches',car:'cars'};
const SING=FAV.filter(w=>w[0]!=='headphones');
const DEM=[['this','blisko','jedna rzecz','is'],['these','blisko','wiele rzeczy','are'],['that','daleko','jedna rzecz','is'],['those','daleko','wiele rzeczy','are']];
const demPick=(near,many)=>DEM.find(d=>d[1]===(near?'blisko':'daleko')&&d[2]===(many?'wiele rzeczy':'jedna rzecz'));
const cap=s=>s[0].toUpperCase()+s.slice(1);
const B2={
favwords:[trD(1,FAV,true),trD(1,FAV,false),trD(2,FADJ,true),trD(2,FADJ,false),
 SQ(2,'Rzecz czy cecha (przymiotnik)?',['rzecz','cecha'],FAV.map(w=>[w[0],0]).concat(FADJ.map(w=>[w[0],1])),6,listExpl),
 D(3,()=>{const a=P([['new','old'],['big','small'],['fast','slow']]);const r=P([0,1]);return{q:`Przeciwieństwo słowa <b>${a[r]}</b> to…`,ok:a[1-r],bad:pickN(['new','old','big','small','fast','slow','funny'].filter(x=>!a.includes(x)),3),expl:`${a[0]} ↔ ${a[1]}.`}}),
 NM(3,()=>{const w=P(FAV.concat(FADJ));return{q:`Wpisz po angielsku: <b>${w[1]}</b>`,fields:[F('po angielsku',w[0],'t',w[0]==='favourite'?{alts:['favorite']}:{})],expl:`${w[1]} = ${w[0]}.`}})],
demo:[
 D(1,()=>{const near=P([1,0]),many=P([1,0]);const d=demPick(near,many);const w=P(SING);return{q:`Rzecz jest <b>${d[1]}</b>, to <b>${d[2]}</b>. ___ ${d[3]} my ${many?PLF[w[0]]:w[0]}.`,ok:cap(d[0]),bad:DEM.filter(x=>x!==d).map(x=>cap(x[0])),expl:`${d[1]} + ${d[2]} → ${d[0]}. ${cap(d[0])} ${d[3]} my ${many?PLF[w[0]]:w[0]}.`}}),
 D(1,()=>{const d=P(DEM);const w=P(SING);const many=d[2]==='wiele rzeczy';return{q:`${cap(d[0])} ___ my ${many?PLF[w[0]]:w[0]}.`,ok:d[3],bad:['am',d[3]==='is'?'are':'is','be'],expl:`${d[0]} → ${d[3]} (${d[2]}).`}}),
 SQ(2,'Blisko czy daleko?',['blisko','daleko'],[['this',0],['these',0],['that',1],['those',1]],4,'this, these – blisko; that, those – daleko.'),
 SQ(2,'Jedna rzecz czy wiele rzeczy?',['jedna rzecz','wiele rzeczy'],[['this',0],['that',0],['these',1],['those',1]],4,'this, that – jedna rzecz; these, those – wiele rzeczy.'),
 D(2,()=>{const w=P(SING);const far=P([0,1]);return{q:`Zamień na liczbę mnogą: <b>${far?'That':'This'} is my ${w[0]}.</b>`,ok:`${far?'Those':'These'} are my ${PLF[w[0]]}.`,bad:[`${far?'Those':'These'} is my ${PLF[w[0]]}.`,`${far?'That':'This'} are my ${PLF[w[0]]}.`,`${far?'These':'Those'} are my ${w[0]}.`],expl:`${far?'that → those':'this → these'}, is → are, ${w[0]} → ${PLF[w[0]]}.`}}),
 NM(3,()=>{const near=P([1,0]),many=P([1,0]);const d=demPick(near,many);const w=P(SING);return{q:`Wpisz this, that, these albo those (rzecz ${d[1]}, ${d[2]}):<br><b>___ ${d[3]} my ${many?PLF[w[0]]:w[0]}.</b>`,fields:[F('słowo',d[0],'t')],expl:`${d[1]} + ${d[2]} → ${d[0]}.`}}),
 O(3,'Które zdanie jest poprawne?','Those are my headphones.',['That are my headphones.','Those is my headphones.','This are my headphones.'],'headphones to liczba mnoga, daleko → those are.')],
beq:[
 D(1,()=>{const c=P([['this your bike','Is'],['these your comics','Are'],['you ten','Are'],['she your sister','Is'],['it new','Is'],['they your dolls','Are'],['I late','Am'],['that your kite','Is'],['those your headphones','Are']]);return{q:`___ ${c[0]}?`,ok:c[1],bad:['Am','Is','Are'].filter(x=>x!==c[1]).concat(['Be']),expl:`Pytanie zaczyna się od formy be: ${c[1]} ${c[0]}?`}}),
 D(2,()=>{const c=P([['Is it your ball?',1,'Yes, it is.','No, it isn’t.',['Yes, it are.','No, it aren’t.','Yes, I am.']],['Are they your comics?',1,'Yes, they are.','No, they aren’t.',['Yes, they is.','No, they isn’t.','Yes, it is.']],['Are you happy?',1,'Yes, I am.','No, I’m not.',['Yes, you are.','Yes, I is.','No, I amn’t.']],['Is she your friend?',1,'Yes, she is.','No, she isn’t.',['Yes, she are.','Yes, he is.','No, she aren’t.']],['Is this your scooter?',1,'Yes, it is.','No, it isn’t.',['Yes, this are.','No, it aren’t.','Yes, I am.']]]);const yes=P([1,0]);const ok=yes?c[2]:c[3];return{q:`${c[0]} <b>(${yes?'tak':'nie'})</b>`,ok,bad:c[4],expl:`Krótka odpowiedź powtarza be: ${ok}`}}),
 OrdD(2,'Ułóż pytanie z wyrazów.',()=>{const c=P([['Is','this','your','kite?'],['Are','these','your','comics?'],['Is','your','bike','new?'],['Are','you','ten?'],['What','is','your','favourite','toy?'],['Where','are','my','headphones?']]);return{steps:c,expl:c.join(' ')+' – forma be stoi na początku (po słowie pytającym).'}}),
 D(3,()=>{const w=P(SING);const a=P(FADJ.filter(x=>x[0]!=='favourite'))[0];return{q:`Zamień na pytanie: <b>Your ${w[0]} is ${a}.</b>`,ok:`Is your ${w[0]} ${a}?`,bad:[`Your ${w[0]} is ${a}?`,`Are your ${w[0]} ${a}?`,`Is ${a} your ${w[0]}?`],expl:`Przestawiamy be na początek: Is your ${w[0]} ${a}?`}}),
 D(3,()=>{const c=P([['What ___ this?','is'],['What ___ these?','are'],['Where ___ my ball?','is'],['Where ___ my comics?','are'],['What colour ___ your bike?','is'],['How old ___ you?','are']]);return{q:c[0],ok:c[1],bad:['am',c[1]==='is'?'are':'is','be'],expl:`${c[0].replace('___',c[1])}`}}),
 NM(3,()=>{const c=P([['___ these your pens? Yes, they are.','are'],['___ that your camera? No, it isn’t.','is'],['___ you eleven? Yes, I am.','are'],['Is it your watch? No, it ___.','isn’t']]);return{q:`Uzupełnij jednym słowem:<br><b>${c[0]}</b>`,fields:[F('słowo',c[1],'t',{alts:c[1]==='isn’t'?["isn't",'is not']:[]})],expl:c[0].replace('___',c[1])}})],
favtext:[
 NM(1,()=>{const w=P(SING),col=P(COL);return{q:`Uzupełnij tekst:<br><b>My favourite thing ___ my ${w[0]}. It is ${col[0]}.</b>`,fields:[F('słowo','is','t')],expl:`Jedna rzecz → is: My favourite thing is my ${w[0]}.`}}),
 D(1,()=>{const many=P([1,0]);const w=P(SING);return{q:`Wybierz początek tekstu o ${many?'ulubionych rzeczach (kilka)':'ulubionej rzeczy (jedna)'}:`,ok:many?`My favourite things are my ${PLF[w[0]]}.`:`My favourite thing is my ${w[0]}.`,bad:many?[`My favourite things is my ${PLF[w[0]]}.`,`My favourite thing are my ${PLF[w[0]]}.`,`My favourite things am my ${PLF[w[0]]}.`]:[`My favourite thing are my ${w[0]}.`,`My favourite things is my ${w[0]}.`,`I favourite thing is my ${w[0]}.`],expl:many?'Kilka rzeczy: things are.':'Jedna rzecz: thing is.'}}),
 SQ(2,'Pasuje do tekstu o ulubionej rzeczy?',['pasuje','nie pasuje'],[['My favourite thing is my kite.',0],['It is red and yellow.',0],['It is big and new.',0],['I play with it in the park.',0],['I love it!',0],['Close the door, please.',1],['What is your name?',1],['Sit down, please.',1]],6,listExpl),
 OrdD(2,'Ułóż zdania w krótki tekst (od przedstawienia rzeczy).',()=>{const w=P(SING),col=P(COL),a=P(FADJ.filter(x=>x[0]!=='favourite'));return{steps:[`My favourite thing is my ${w[0]}.`,`It is ${col[0]} and ${a[0]}.`,'I play with it every day.','I love it!'],expl:'Najpierw: co to jest. Potem: jakie jest (kolor, cechy). Potem: co z tym robisz i co czujesz.'}}),
 D(3,()=>{const w=P(SING);return{q:`Znajdź zdanie <b>bez błędu</b>:`,ok:`My favourite ${PLF[w[0]]} are new.`,bad:[`My favourite ${PLF[w[0]]} is new.`,`My favourite ${w[0]} are new.`,`It are my favourite ${w[0]}.`],expl:`${PLF[w[0]]} (liczba mnoga) → are.`}}),
 NM(3,()=>{const w=P(SING),col=P(COL);return{q:`Uzupełnij tekst (dwa słowa):<br><b>My favourite thing is my ${w[0]}. (1) ___ is ${col[0]}. (2) ___ love it!</b>`,fields:[F('(1)','It','t',{alts:['it']}),F('(2)','I','t',{alts:['i']})],expl:`It is ${col[0]}. I love it! Wzór tekstu: My favourite thing is my… It is… I play with it… I love it!`}})]
};
Object.assign(B,B2);
export default {TOPICS,T,CHAPTERS,B};
