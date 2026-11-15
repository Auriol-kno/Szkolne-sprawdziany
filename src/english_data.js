const TOPICS=[
 {id:'words',ch:1,name:'Słownictwo: szkoła i dom',hint:'Przypomnij sobie słówka z lekcji. Zgadnij z kontekstu.'},
 {id:'tobe',ch:1,name:'Czasownik to be',hint:'I am, you are, he/she/it is, we/you/they are.'},
 {id:'family',ch:1,name:'Rodzina i zwierzęta',hint:'mother, father, sister, brother, grandma, grandpa; cat, dog, bird, fish, horse, rabbit.'},
 {id:'numcol',ch:1,name:'Liczby, kolory, dni',hint:'Liczby do 20, kolory i dni tygodnia.'},
 {id:'canhave',ch:1,name:'Can i have got',hint:'I can swim. She has got a dog. They have got books.'},
 {id:'translate',ch:1,name:'Przetłumacz słowo',hint:'Wpisz słowo po angielsku małymi literami.'}
];
const T=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
const CHAPTERS={1:'Zestaw startowy (kl. 4)'};
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
