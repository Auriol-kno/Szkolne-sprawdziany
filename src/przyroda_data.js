const TOPICS=[
 {id:'zywe',ch:1,name:'Ożywione i nieożywione',hint:'Organizm oddycha, odżywia się, wydala, rośnie, reaguje na bodźce, rusza się i rozmnaża. Rzeczy zrobione przez ludzi nie należą do przyrody.'},
 {id:'czynn',ch:1,name:'Czynności życiowe',hint:'7 czynności: oddychanie, odżywianie, wydalanie, wzrost i rozwój, reakcja na bodźce, ruch, rozmnażanie.'},
 {id:'zmysly',ch:2,name:'Zmysły, narządy i mózg',hint:'Wzrok – oczy, słuch – uszy, węch – nos, dotyk – skóra, smak – język. Informacje płyną nerwami do mózgu.'},
 {id:'przyrz',ch:2,name:'Przyrządy do obserwacji',hint:'Lupa i mikroskop – rzeczy małe. Lornetka i teleskop – rzeczy daleko. Latarka – gdy ciemno. Aparat lub telefon – do zdjęć i nagrań.'},
 {id:'pomiar',ch:2,name:'Mierzenie i dokumentowanie',hint:'Zastanów się, co mierzysz: wysokość, obwód, odległość, masę, temperaturę, ilość płynu czy wiatr.'},
 {id:'obs',ch:2,name:'Obserwacja',hint:'Podczas obserwacji niczego nie zmieniasz. Etapy: cel, planowanie, obserwacja właściwa, zapisanie wyników.'},
 {id:'metoda',ch:3,name:'Metoda naukowa i hipoteza',hint:'Obserwacja i pytanie badawcze → hipoteza → doświadczenie lub obserwacja → wyniki → wniosek.'},
 {id:'dosw',ch:3,name:'Doświadczenie czy obserwacja',hint:'W doświadczeniu celowo coś zmieniasz, zawsze tylko jedną rzecz naraz. W obserwacji tylko patrzysz i niczego nie zmieniasz.'},
 {id:'fakty',ch:3,name:'Fakty i opinie',hint:'Fakt można sprawdzić i udowodnić. Opinia to czyjeś przekonanie, ocena albo odczucie.'},
 {id:'cien',ch:4,name:'Słońce i cień',hint:'Cień jest zawsze po przeciwnej stronie niż Słońce. Im wyżej Słońce, tym krótszy cień. Około 12:00 cień wskazuje północ.'},
 {id:'kier',ch:4,name:'Kierunki świata i kompas',hint:'Twarzą na północ: za plecami południe, po prawej wschód, po lewej zachód. Czerwona igła kompasu wskazuje północ.'},
 {id:'roza',ch:4,name:'Róża wiatrów',hint:'Kierunki pośrednie leżą między głównymi: NE północny wschód, SE południowy wschód, SW południowy zachód, NW północny zachód.'},
 {id:'kodeks',ch:5,name:'Kodeks młodego przyrodnika',hint:'Trzy zasady: zachowaj bezpieczeństwo, okaż szacunek przyrodzie, zabieraj śmieci ze sobą.'},
 {id:'smieci',ch:5,name:'Śmieci w przyrodzie',hint:'Od najkrótszego: obierki, papier, guma do żucia, opona, puszka, torba foliowa, szkło (około 4000 lat).'},
 {id:'wyprawa',ch:5,name:'Planowanie wyjścia w teren',hint:'Cel → transport → czas → poziom trudności → lista rzeczy → pogoda, telefon, opiekun.'}
];
const T=Object.fromEntries(TOPICS.map(t=>[t.id,t]));
const CHAPTERS={1:'1. Przyroda wokół nas',2:'2. Jak zostać dobrym obserwatorem',3:'3. Jak zostać dobrym badaczem',4:'4. Kierunki świata',5:'5. Kodeks przyrodnika'};

/* ---------- dane z podręcznika ---------- */
const ALIVE=['dąb','pies','bakteria','grzyb','mucha','jeż','mech','człowiek','ryba','ślimak','mimoza','sikorka','lis','świerk'];
const NONLIVE=['Słońce','kamień','chmura','woda','powietrze','skała','piasek','gwiazda','Księżyc','śnieg'];
const MADE=['most','droga','samochód','budynek','pole uprawne','odkurzacz','latarka','plecak','ławka'];
const LIFE=[
 ['oddychanie','uwalnianie energii z pokarmu, zwykle przy udziale tlenu',['Płuca człowieka pobierają tlen, który pomaga uwolnić energię z pokarmu.','Ryba pobiera tlen z wody przez skrzela.']],
 ['odżywianie','pobieranie pokarmu lub samodzielne wytwarzanie pożywienia',['Gąsienice zjadają liście kapusty.','Roślina na parapecie sama wytwarza pożywienie dzięki światłu.','Jeż zjada dżdżownice.']],
 ['wydalanie','usuwanie z organizmu produktów zbędnych i szkodliwych',['Pies załatwia się na trawniku.','Człowiek poci się w upale.']],
 ['wzrost i rozwój','zwiększanie rozmiarów, zmiany w wyglądzie i funkcjach',['Z nasiona fasoli wyrasta kiełek, a potem cała roślina.','Kijanka zmienia się w żabę.','Szczeniak z miesiąca na miesiąc robi się większy.']],
 ['reakcja na bodźce','zmiany w zachowaniu spowodowane zmianami w otoczeniu',['Mimoza składa listki, gdy dotkniesz jej piórkiem.','Mrużysz oczy, gdy nagle zapala się jasne światło.','Ślimak chowa czułki po dotknięciu.']],
 ['ruch','zmiany pozycji ciała, przemieszczanie się',['Biegaczka przebiega trasę wokół stadionu.','Lis skrada się przez łąkę.']],
 ['rozmnażanie','wydawanie na świat potomstwa',['Lisica rodzi młode.','Z jaj złożonych przez kurę wykluwają się pisklęta.']]
];
const LN=LIFE.map(x=>x[0]);
const SENSE=[['wzrok','oczy','oczu'],['słuch','uszy','uszu'],['węch','nos','nosa'],['dotyk','skóra','skóry'],['smak','język','języka']];
const SN=SENSE.map(x=>x[0]);
const SENSE_EX=[['szorstkość kory dębu',3],['zapach żywicy',2],['czerwony kolor muchomora',0],['śpiew kukułki',1],['słodki smak miodu',4],['chłód kamienia',3],['szum wiatru',1],['zapach mokrej ziemi po deszczu',2],['kształt liścia klonu',0],['ukłucie komara',3],['kwaśny smak cytryny',4],['ślady zwierzęcia na śniegu',0],['trzeszczenie gałęzi',1],['zapach zepsutego jedzenia',2],['słony smak chipsów',4]];
const TOOLS=[
 ['lupa','oglądanie niewielkich obiektów (powiększa 8–10 razy)',['Chcesz policzyć, ile nóg ma mrówka.','Chcesz naszkicować małego żuka biegającego w trawie.']],
 ['lornetka','przyglądanie się obiektom oddalonym nawet o kilometr',['Obserwujesz bociana w gnieździe na wysokim, dalekim słupie.','Chcesz przyjrzeć się sarnom pasącym się w oddali.']],
 ['teleskop','obserwowanie ciał niebieskich, np. planet i gwiazd',['Chcesz zobaczyć pierścienie planety na nocnym niebie.']],
 ['mikroskop','powiększanie bardzo małych obiektów, np. bakterii, nawet 2000 razy',['Chcesz zobaczyć bakterie.']],
 ['latarka','oświetlanie miejsc lub obiektów, by dostrzec więcej szczegółów',['Wieczorem idziesz ciemną leśną ścieżką.']],
 ['aparat lub smartfon','dokumentowanie obserwacji: zdjęcia, nagrania dźwięków i filmów',['Chcesz nagrać śpiew ptaka i pokazać go w klasie.']]
];
const MEAS=[
 ['linijka','wysokość roślin',['Sprawdzasz, ile urosła fasola w doniczce.']],
 ['termometr','temperatura powietrza',['Chcesz wiedzieć, jak ciepło jest rano na dworze.']],
 ['waga','masa obiektu',['Chcesz sprawdzić, ile waży kamień.']],
 ['naczynie z podziałką','ilość płynów',['Odmierzasz 100 ml wody do podlania rośliny.']],
 ['wiatromierz','siła i kierunek wiatru',['Chcesz sprawdzić, jak mocno i skąd wieje wiatr.']],
 ['taśma miernicza','odległość między dwoma obiektami',['Mierzysz odległość między dwoma drzewami w parku.']],
 ['centymetr krawiecki','obwód krzewów i pni drzew',['Mierzysz obwód pnia starego dębu.']]
];
const OBS_ST=[['Cel','Określasz, czego chcesz się dowiedzieć, np. jakie ptaki przylatują do karmnika.'],['Planowanie','Wybierasz miejsce i czas, przygotowujesz lornetkę i włączasz nagrywanie.'],['Obserwacja właściwa','Patrzysz i słuchasz uważnie, niczemu nie przeszkadzając.'],['Zapisanie wyników','Notujesz, rysujesz albo nagrywasz to, co zarejestrowały twoje zmysły.']];
const SCI_ST=[['Obserwacja i pytanie badawcze','Zauważasz coś ciekawego i pytasz, dlaczego tak jest.'],['Hipoteza','Podajesz próbną odpowiedź: „Wydaje mi się, że dzieje się tak, ponieważ…”.'],['Doświadczenie lub obserwacja','Sprawdzasz hipotezę i powtarzasz badanie kilka razy.'],['Wyniki','Opisujesz, co udało się zaobserwować, gromadzisz dane.'],['Wniosek','Sprawdzasz, czy wyniki potwierdzają hipotezę. Jeśli nie, odrzucasz ją.']];
const FACTS=['W torbie są 3 książki.','Kot ma 4 łapy.','Człowiek ma pięć głównych zmysłów.','Lupa powiększa 8–10 razy.','W tym plecaku jest pięć książek.','Biurko ma długość 150 cm.','W karmniku siedzą teraz dwie sikorki.','Bakterie są organizmami żywymi.','Termometr za oknem pokazuje 12°C.','Pająk ma osiem nóg.'];
const OPIN=['Ta torba jest brzydka.','Koty są fajniejsze niż psy.','Ten plecak jest piękny.','Przyroda to najciekawszy przedmiot.','Jeże są śliczne.','Zima to najlepsza pora roku.','Pająki są obrzydliwe.','Śpiew kukułki jest nudny.','Mech jest najprzyjemniejszy w dotyku.','Lekcje w terenie są fajniejsze niż w klasie.'];
const DIRS=['północ','wschód','południe','zachód'];
const LET=[['N','North','północ'],['S','South','południe'],['E','East','wschód'],['W','West','zachód']];
const D8=[['N','północ'],['NE','północny wschód'],['E','wschód'],['SE','południowy wschód'],['S','południe'],['SW','południowy zachód'],['W','zachód'],['NW','północny zachód']];
const D8N=D8.map(x=>x[1]);
const TRASH=[['skorupki po jajkach, obierki po owocach i warzywach','2–12 miesięcy'],['papier','do 6 miesięcy'],['guma do żucia','około 5 lat'],['zużyta opona samochodowa','50–100 lat'],['puszka aluminiowa','100–200 lat'],['torba foliowa','100–400 lat'],['szkło','około 4000 lat']];
const TRASH_ORD=['papier','skorupki po jajkach, obierki po owocach i warzywach','guma do żucia','zużyta opona samochodowa','puszka aluminiowa','torba foliowa','szkło'];
const BEHAV=[['Trzyma się grupy i opiekuna.',0],['Zbiera śmieci do worka.',0],['Obserwuje ptaki przez lornetkę.',0],['Sprawdza trasę na mapie.',0],['Robi zdjęcia roślin.',0],['Spaceruje po wyznaczonym szlaku.',0],['Biwakuje w wyznaczonym miejscu.',0],['Oddala się od grupy.',1],['Hałasuje i krzyczy.',1],['Depcze grzyby.',1],['Płoszy zwierzęta.',1],['Rzuca śmieci na ziemię.',1],['Zrywa owoce i od razu je zjada.',1],['Rozpala ognisko w lesie.',1],['Wspina się na złamane drzewo.',1]];
const RULES=[['Trzymaj się grupy.',0],['Patrz pod nogi.',0],['Ubierz się odpowiednio.',0],['Informuj opiekuna o problemach.',0],['Zachowaj ciszę.',1],['Nie zbliżaj się do zwierząt.',1],['Nie niszcz roślin, grzybów ani zwierząt.',1],['Zabierz opakowania po napojach i batonach.',2],['Nie zostawiaj śladów swojej obecności.',2],['Wrzucaj odpady do odpowiednich koszy.',2]];
const PLAN=['Cel wyprawy','Sposób transportu','Czas wyprawy','Poziom trudności','Lista potrzebnych rzeczy','Pogoda, telefon i opiekun'];
const PLAN_D=['Planujesz, co chcesz zobaczyć.','Ustalasz, jak dotrzesz na miejsce i jak będziesz się przemieszczać.','Sprawdzasz, ile masz czasu: kilka godzin czy cały dzień.','Oceniasz teren: płaski, górzysty, po ulicach, przez las.','Przygotowujesz odzież, obuwie, mapę, kompas, apteczkę, wodę i worek na śmieci.','Sprawdzasz prognozę pogody, ładujesz telefon i prosisz opiekunów, by ci towarzyszyli.'];
const PACK=[['mapa lub plan',0],['kompas',0],['apteczka',0],['butelka wody',0],['przekąski',0],['worek na śmieci',0],['naładowany telefon',0],['wygodne buty zakrywające stopy',0],['głośnik z muzyką',1],['balony',1],['klapki',1],['krótkie spodenki',1],['konsola do gier',1]];
const sortedPick=(arr,n)=>pickN(arr.map((_,i)=>i),n).sort((a,b)=>a-b).map(i=>arr[i]);
function sides(face){return{przed:DIRS[face],prawa:DIRS[(face+1)%4],tyl:DIRS[(face+2)%4],lewa:DIRS[(face+3)%4]}}

const B={
zywe:[
 D(1,()=>{const ok=P(MADE.filter(x=>x!=='pole uprawne'));return{q:'Który z tych obiektów <b>nie należy</b> do przyrody?',ok,bad:pickN([...ALIVE,...NONLIVE],3),expl:`${ok[0].toUpperCase()+ok.slice(1)} zrobił człowiek, więc to wytwór człowieka. Przyroda to wszystko, co nas otacza i nie zostało stworzone przez człowieka.`}}),
 D(1,()=>{const ok=P(ALIVE);return{q:'Który z tych elementów przyrody jest <b>ożywiony</b>?',ok,bad:pickN(NONLIVE,3),expl:`${ok[0].toUpperCase()+ok.slice(1)} to organizm, czyli istota żywa. Pozostałe to elementy nieożywione.`}}),
 D(1,()=>{const ok=P(NONLIVE);return{q:'Który z tych elementów przyrody jest <b>nieożywiony</b>?',ok,bad:pickN(ALIVE,3),expl:`${ok[0].toUpperCase()+ok.slice(1)} nie żyje, ale należy do przyrody, bo nie stworzył tego człowiek.`}}),
 O(1,'Co to jest przyroda?','Wszystko, co nas otacza i nie zostało stworzone przez człowieka',['Tylko rośliny i zwierzęta','Wszystko, co nas otacza, razem z domami i drogami','Tylko to, co rośnie w lesie'],'Do przyrody należą np. rośliny, zwierzęta, skały, woda, powietrze, a nawet gwiazdy i planety. Budynki, drogi i mosty to wytwory człowieka.'),
 SQ(1,'Podziel elementy na ożywione i nieożywione.',['ożywione','nieożywione'],[...ALIVE.map(x=>[x,0]),...NONLIVE.map(x=>[x,1])],4,listExpl),
 SQ(2,'Podziel elementy na ożywione i nieożywione.',['ożywione','nieożywione'],[...ALIVE.map(x=>[x,0]),...NONLIVE.map(x=>[x,1])],6,listExpl),
 O(2,'Bakterie to:','organizmy żywe, choć nie widać ich gołym okiem',['elementy nieożywione, bo są niewidoczne','wytwór człowieka','część powietrza, która nie żyje'],'Elementy ożywione to obiekty, które żyją, także te niewidoczne gołym okiem, np. bakterie.'),
 O(2,'W doświadczeniu oświetlano latarką i dotykano piórkiem kamień, ślimaka i mimozę. Co stało się z kamieniem?','Nie zaszła w nim żadna zmiana',['Schował się','Zmienił kolor','Przesunął się w stronę światła'],'Kamień jest nieożywiony, więc nie reaguje na światło ani dotyk. Poruszyły się za to części rośliny, zwierzęcia i człowieka.'),
 O(2,'Czy ryba przeżyłaby bez wody?','Nie, bo elementy ożywione potrzebują elementów nieożywionych',['Tak, bo ryba jest żywa, a woda nie','Tak, jeśli będzie miała dużo jedzenia','Nie, bo woda jest organizmem'],'Elementy ożywione i nieożywione są ze sobą powiązane. Ryba (ożywiona) potrzebuje wody (nieożywionej), a roślina potrzebuje słońca i powietrza.'),
 SQ(3,'Rozdziel na trzy grupy.',['przyroda ożywiona','przyroda nieożywiona','wytwór człowieka'],[...ALIVE.map(x=>[x,0]),...NONLIVE.map(x=>[x,1]),...MADE.map(x=>[x,2])],6,(ch,c)=>listExpl(ch,c)+' Pole uprawne też jest wytworem człowieka.'),
 O(3,'Czym według doświadczenia z latarką i piórkiem istoty żywe różnią się od obiektów nieożywionych?','Zdolnością do reagowania na bodźce, np. dotyk i światło',['Tym, że są twarde','Tym, że leżą na ziemi','Tym, że są ciepłe'],'Ślimak, mimoza i człowiek zareagowali na dotyk i światło, a kamień nie. To wniosek z tego doświadczenia.'),
 O(3,'Chmura porusza się po niebie i zmienia kształt. Czy jest organizmem?','Nie, bo nie wykonuje wszystkich czynności życiowych',['Tak, bo się porusza','Tak, bo rośnie','Tak, bo zmienia kształt'],'Sam ruch nie wystarczy, żeby żyć. Organizm wykonuje wszystkie czynności życiowe: oddycha, odżywia się, wydala, rośnie, reaguje na bodźce, porusza się i rozmnaża.'),
 SQ(3,'Kot Darwin myśli, że odkurzacz to zwierzę. Oceń każde zdanie.',['dowód, że nie żyje','nie wystarczy, by odróżnić'],[['Nie rośnie i nie rozwija się.',0],['Nie wydaje na świat potomstwa.',0],['Nie oddycha.',0],['Działa tylko po włączeniu do prądu.',0],['Wydaje dźwięki.',1],['Jest ciepły.',1],['„Zjada” śmieci.',1]],5,'Dźwięki, ciepło i „jedzenie” śmieci tylko udają cechy życia. Odkurzacz nie rośnie, nie rozmnaża się i nie oddycha, więc nie jest żywy.')
],
czynn:[
 D(1,()=>{const f=P(LIFE);return{q:`Jaką czynność życiową opisuje zdanie?<br><b>${P(f[2])}</b>`,ok:f[0],bad:pickN(LN.filter(x=>x!==f[0]),3),expl:`To ${f[0]}, czyli ${f[1]}.`}}),
 D(1,()=>{const ok=P(['świecenie','topnienie','rdzewienie','parowanie']);return{q:'Która z tych czynności <b>nie jest</b> czynnością życiową?',ok,bad:pickN(LN,3),expl:`${ok[0].toUpperCase()+ok.slice(1)} nie jest czynnością życiową. Czynności życiowe to: ${LN.join(', ')}.`}}),
 O(1,'Ile jest czynności życiowych?','7',['5','3','10'],'Siedem: '+LN.join(', ')+'.'),
 D(2,()=>{const f=P(LIFE);return{q:`Która czynność życiowa to <b>${f[1]}</b>?`,ok:f[0],bad:pickN(LN.filter(x=>x!==f[0]),3),expl:`${f[0][0].toUpperCase()+f[0].slice(1)} to ${f[1]}.`}}),
 {l:2,f:()=>{const fs=pickN(LIFE,3);const pool=fs.flatMap((f,ci)=>f[2].map(e=>[e,ci]));return SQ(2,'Przyporządkuj każdy przykład do czynności życiowej.',fs.map(f=>f[0]),pool,Math.min(4,pool.length),fs.map(f=>`${f[0][0].toUpperCase()+f[0].slice(1)} to ${f[1]}.`).join(' ')).f()}},
 O(2,'Organizm to:','każda żywa istota, która wykonuje wszystkie czynności życiowe',['każdy obiekt, który się porusza','każda rzecz, która jest ciepła','tylko zwierzęta i ludzie'],'Organizmami są też rośliny, grzyby i bakterie.'),
 O(2,'Co się dzieje z organizmem, którego potrzeby nie są zaspokojone?','Gorzej się rozwija, marnieje, a w końcu umiera',['Nic się nie zmienia','Rośnie szybciej','Zaczyna świecić'],'Roślina potrzebuje światła i wody, a zwierzę pożywienia, wody i powietrza. Bez tego organizm marnieje.'),
 O(2,'Czego potrzebuje zwierzę?','pożywienia, wody i powietrza',['tylko światła','tylko wody','niczego, jeśli śpi'],'Tak podaje podręcznik. Roślina potrzebuje przede wszystkim światła i wody.'),
 {l:3,f:()=>{const fs=pickN(LIFE,4);const pool=fs.flatMap((f,ci)=>f[2].map(e=>[e,ci]));return SQ(3,'Przyporządkuj każdy przykład do czynności życiowej.',fs.map(f=>f[0]),pool,Math.min(5,pool.length),fs.map(f=>`${f[0][0].toUpperCase()+f[0].slice(1)} to ${f[1]}.`).join(' ')).f()}},
 O(3,'Mimoza nie chodzi. Czy wykonuje ruch?','Tak, porusza liśćmi, np. składa je po dotknięciu',['Nie, rośliny nigdy się nie ruszają','Tak, nocą przesuwa się po doniczce','Nie, ruch mają tylko zwierzęta'],'Ruch to zmiana pozycji ciała. Rośliny poruszają liśćmi i pochylają się do światła.'),
 O(3,'Czy każdą czynność życiową można zobaczyć gołym okiem?','Nie, u niektórych istot części czynności nie da się tak zaobserwować',['Tak, zawsze','Tak, ale tylko u roślin','Nie, bo rośliny nie wykonują czynności życiowych'],'Np. bakterie żyją i wykonują czynności życiowe, ale nie widać ich bez mikroskopu.'),
 O(3,'Mrużysz oczy, gdy w ciemnym pokoju nagle zapala się jasne światło. Która to czynność życiowa?','reakcja na bodźce',['ruch','oddychanie','wzrost i rozwój'],'Światło to bodziec, czyli zmiana w otoczeniu. Mrużenie oczu to reakcja na ten bodziec.')
],
zmysly:[
 D(1,()=>{const s=P(SENSE);return{q:`Jaki jest narząd zmysłu <b>${s[0]}u</b>?`,ok:s[1],bad:pickN(SENSE.filter(x=>x!==s).map(x=>x[1]),3),expl:`${s[0][0].toUpperCase()+s[0].slice(1)} działa dzięki narządowi: ${s[1]}.`}}),
 D(1,()=>{const s=P(SENSE);return{q:`Narządem jakiego zmysłu jest <b>${s[1]}</b>?`,ok:s[0],bad:pickN(SN.filter(x=>x!==s[0]),3),expl:`${s[1][0].toUpperCase()+s[1].slice(1)} to narząd zmysłu: ${s[0]}.`}}),
 SQ(1,'Który zmysł cię o tym informuje?',SN,SENSE_EX,4,listExpl),
 O(1,'Ile głównych zmysłów ma człowiek?','5',['3','4','7'],'Pięć: wzrok, słuch, dotyk, węch i smak.'),
 O(1,'Który zmysł dostarcza najwięcej informacji o otoczeniu?','wzrok',['słuch','smak','węch'],'Wzrok jest głównym zmysłem człowieka. Dzięki niemu rozróżniasz kolory, kształty i ruch.'),
 SQ(2,'Który zmysł cię o tym informuje?',SN,SENSE_EX,6,listExpl),
 O(2,'Jak informacje od narządów zmysłów trafiają do mózgu?','Nerwami',['Krwią','Mięśniami','Kośćmi'],'Nerwy to przewody, którymi płyną sygnały między mózgiem a resztą ciała.'),
 O(2,'Co robi mózg z informacjami od zmysłów?','Analizuje je, porównuje, segreguje, zapamiętuje i wydaje polecenia',['Tylko je wyrzuca','Wysyła je do oczu','Nic, pracują same zmysły'],'Mózg to centrum dowodzenia. Np. łączy sygnały „rude zwierzę”, „zapach dzikiego zwierzęcia” i „szelest” i rozpoznaje lisa.'),
 D(2,()=>{const s=P([['słuch','twój system ostrzegania'],['dotyk','zmysł bliskiego kontaktu'],['smak','zmysł kontrolny'],['węch','twój wykrywacz zapachów']]);return{q:`Który zmysł podręcznik nazywa: <b>${s[1]}</b>?`,ok:s[0],bad:pickN(SN.filter(x=>x!==s[0]),3),expl:`${s[0][0].toUpperCase()+s[0].slice(1)} to ${s[1]}.`}}),
 O(2,'Z zawiązanymi oczami stukasz przedmiotem o ławkę i słyszysz głośny, twardy dźwięk. Co to najpewniej jest?','kamień',['piórko','mech','gałązka świerku'],'Twarde przedmioty, jak kamień, wydają głośny dźwięk. Piórko nie wydaje żadnego odgłosu.'),
 O(2,'Dotykasz kubka z gorącą herbatą. Który narząd zmysłu poczuł ciepło?','skóra',['oko','nos','język'],'Narządem dotyku jest skóra. Informuje o temperaturze, bólu i rodzaju powierzchni.'),
 O(3,'Która część organizmu każe ci szybko cofnąć rękę od gorącego kubka?','mózg',['skóra','ucho','serce'],'Skóra wysyła sygnał nerwami do mózgu, a mózg wydaje polecenie: cofnij rękę, żeby się nie oparzyć.'),
 D(3,()=>{const hot=R(0,1);return{q:`Trzymasz rękę w <b>bardzo ${hot?'ciepłej':'zimnej'}</b> wodzie, a potem wkładasz ją do miski z wodą letnią. Jak wyda ci się letnia woda?`,ok:hot?'chłodna':'ciepła',bad:[hot?'ciepła':'chłodna','dokładnie taka, jaka jest','wrząca'],expl:`Ręka przyzwyczaiła się do ${hot?'ciepła, więc letnia woda wydaje się chłodna':'zimna, więc letnia woda wydaje się ciepła'}. Odczucie zależy od tego, gdzie ręka była wcześniej.`}}),
 O(3,'Dlaczego nie warto polegać na informacjach tylko z jednego zmysłu?','Bo łatwo popełnić błąd; pełny obraz daje współpraca wszystkich zmysłów',['Bo zmysły zawsze kłamią','Bo wzrok nie daje żadnych informacji','Bo mózg pracuje tylko z jednym zmysłem'],'Kot Darwin wziął sztuczny kwiat za prawdziwy. Dopiero węch pozwolił mu je odróżnić.'),
 O(3,'Jak badacz przyrody powinien używać zmysłu smaku?','Rzadko, zawsze ostrożnie i pod opieką osoby dorosłej',['Do rozpoznawania każdej rośliny','Tylko do grzybów w lesie','Nigdy nie ma takiej potrzeby'],'Smak ostrzega przed jedzeniem szkodliwym lub trującym, ale próbowanie nieznanych rzeczy jest niebezpieczne.')
],
przyrz:[
 D(1,()=>{const t=P(TOOLS);return{q:`Który przyrząd pomoże ci najbardziej? <b>${P(t[2])}</b>`,ok:t[0],bad:pickN(TOOLS.filter(x=>x!==t).map(x=>x[0]),3),expl:`${t[0][0].toUpperCase()+t[0].slice(1)} służy do: ${t[1]}.`}}),
 D(2,()=>{const t=P(TOOLS);return{q:`Do czego służy <b>${t[0]}</b>?`,ok:t[1],bad:pickN(TOOLS.filter(x=>x!==t).map(x=>x[1]),3),expl:`${t[0][0].toUpperCase()+t[0].slice(1)}: ${t[1]}.`}}),
 SQ(2,'Wybierz przyrząd do każdej sytuacji.',['lupa','lornetka','mikroskop','latarka'],TOOLS.filter(t=>['lupa','lornetka','mikroskop','latarka'].includes(t[0])).flatMap(t=>t[2].map(e=>[e,['lupa','lornetka','mikroskop','latarka'].indexOf(t[0])])),4,listExpl),
 O(2,'Kiedy zmysły bywają niewystarczające?','Gdy obiekt jest za mały, za daleko albo gdy jest ciemno',['Tylko w nocy','Nigdy','Gdy jest ciepło'],'Wtedy pomagają przyrządy do obserwacji: lupa, lornetka, teleskop, mikroskop, latarka.'),
 O(3,'Ile razy powiększa lupa?','8–10 razy',['2000 razy','100 razy','wcale nie powiększa'],'Lupa powiększa 8–10 razy, a mikroskop optyczny nawet 2000 razy.'),
 O(3,'Który przyrząd powiększa nawet 2000 razy?','mikroskop optyczny',['lupa','lornetka','latarka'],'Mikroskop pozwala zobaczyć bardzo małe obiekty, np. bakterie.'),
 O(3,'Lornetka pozwala przyglądać się obiektom oddalonym nawet o:','kilometr',['jeden metr','tysiąc kilometrów','jeden centymetr'],'Lornetka przydaje się np. do obserwowania ptaków albo saren z daleka.'),
 SQ(3,'Wybierz przyrząd do każdej sytuacji.',TOOLS.map(t=>t[0]),TOOLS.flatMap((t,i)=>t[2].map(e=>[e,i])),5,listExpl)
],
pomiar:[
 D(1,()=>{const m=P(MEAS);return{q:`Jaki przyrząd wybierzesz? <b>${m[2][0]}</b>`,ok:m[0],bad:pickN(MEAS.filter(x=>x!==m).map(x=>x[0]),3),expl:`${m[0][0].toUpperCase()+m[0].slice(1)} mierzy: ${m[1]}.`}}),
 D(2,()=>{const m=P(MEAS);return{q:`Co mierzy <b>${m[0]}</b>?`,ok:m[1],bad:pickN(MEAS.filter(x=>x!==m).map(x=>x[1]),3),expl:`${m[0][0].toUpperCase()+m[0].slice(1)} – ${m[1]}.`}}),
 O(2,'Lumo zmierzył biurko krokami: 3 kroki. Aura taśmą: 150 cm. Który wynik bardziej przyda się stolarzowi?','150 cm, bo centymetr jest zawsze taki sam, a kroki różnych osób są różne',['3 kroki, bo łatwiej zapamiętać','Oba tak samo','Żaden, stolarz mierzy na oko'],'Pomiar przyrządem z podziałką jest dokładny i każdy zrozumie go tak samo.'),
 O(2,'Co to znaczy dokumentować pracę badacza?','Robić notatki, rysunki, zdjęcia i nagrania',['Wyrzucać zebrane okazy','Opowiadać o wynikach z pamięci','Tylko mierzyć linijką'],'Dokumentowanie pozwala wrócić do wyników i pokazać je innym.'),
 SQ(3,'Dopasuj przyrząd do pomiaru.',['termometr','waga','wiatromierz','centymetr krawiecki'],MEAS.filter(m=>['termometr','waga','wiatromierz','centymetr krawiecki'].includes(m[0])).map(m=>[m[1][0].toUpperCase()+m[1].slice(1),['termometr','waga','wiatromierz','centymetr krawiecki'].indexOf(m[0])]),4,listExpl),
 O(3,'Dwa pomarańczowe koła wyglądają na różnej wielkości. Jak sprawdzić, czy wzrok cię nie oszukuje?','Zmierzyć oba koła linijką',['Popatrzeć dłużej','Zapytać kolegę, które wydaje mu się większe','Zamknąć jedno oko'],'Wzrok można oszukać. Pomiar przyrządem daje pewny wynik.'),
 O(3,'Chcesz zmierzyć obwód pnia dębu. Dlaczego centymetr krawiecki, a nie linijka?','Bo jest giętki i da się nim owinąć pień',['Bo jest dłuższy od taśmy mierniczej','Bo linijka mierzy tylko płyny','Bo mierzy też temperaturę'],'Centymetr krawiecki pozwala zmierzyć obwód krzewów i pni drzew.')
],
obs:[
 O(1,'Obserwacja to:','uważne przyglądanie się bez wpływania na obiekt, jego zachowanie i przebieg zjawiska',['celowe zmienianie warunków i sprawdzanie skutku','zgadywanie odpowiedzi','zbieranie okazów do domu'],'Podczas obserwacji używasz zmysłów i przyrządów, ale niczego nie zmieniasz.'),
 D(1,()=>{const s=P(OBS_ST);return{q:`Który to etap obserwacji? <b>${s[1]}</b>`,ok:s[0],bad:OBS_ST.filter(x=>x!==s).map(x=>x[0]),expl:`To etap: ${s[0]}. Kolejność: ${OBS_ST.map(x=>x[0].toLowerCase()).join(' → ')}.`}}),
 Ord(2,'Ułóż etapy obserwacji we właściwej kolejności.',OBS_ST.map(x=>x[0]),'Najpierw cel, potem planowanie, obserwacja właściwa i na końcu zapisanie wyników.'),
 O(2,'Rzucasz kamieniem w zarośla, żeby sprawdzić, czy są w nich zwierzęta. Czy to obserwacja?','Nie, bo przeszkadzasz zwierzętom i wpływasz na ich zachowanie',['Tak, bo patrzysz na zarośla','Tak, bo używasz kamienia jako przyrządu','Nie, bo obserwacja jest tylko w nocy'],'Obserwacja to przyglądanie się bez wpływania na przyrodę.'),
 O(2,'Po co zapisywać wyniki obserwacji?','Bo pamięć bywa ulotna, a notatka zostaje na dłużej',['Żeby nauczyciel miał co poprawiać','Nie trzeba, wystarczy pamiętać','Żeby obserwacja trwała krócej'],'Możesz napisać opis, narysować rysunek, zrobić zdjęcie albo nagrać film.'),
 O(3,'Lumo chce zbadać, kiedy w ciągu dnia przy karmniku jest najwięcej ptaków. Jak powinien to zrobić?','Zapisywać co pół godziny liczbę ptaków',['Rysować dokładne obrazki ptaków','Sprawdzać co pół godziny, ile ziarna ubywa','Policzyć ptaki raz, w południe'],'Liczba ptaków zapisana o różnych porach pokaże, kiedy jest ich najwięcej. Ubywanie ziarna nie mówi, ile było ptaków.'),
 O(3,'Ktoś wyjada ziarno z karmnika, a kot Darwin zaprzecza. Jak to najlepiej wyjaśnić?','Ukryć się, obserwować karmnik przez lornetkę i nagrywać telefonem',['Zapytać Darwina jeszcze raz','Zabrać karmnik do domu','Postawić przy karmniku głośne radio'],'Dobra obserwacja: cel, plan, ciche ukrycie się, przyrządy i udokumentowanie wyników.'),
 Ord(3,'Ułóż etapy obserwacji we właściwej kolejności.',OBS_ST.map(x=>x[0]),'Cel → planowanie → obserwacja właściwa → zapisanie wyników.')
],
metoda:[
 O(1,'Hipoteza to:','próbna odpowiedź, którą trzeba sprawdzić',['pewny fakt','zapis wyników','przyrząd do pomiaru'],'Hipotezę zaczyna się często od słów: „Wydaje mi się, że dzieje się tak, ponieważ…”.'),
 O(1,'Badacz to ktoś, kto:','obserwuje, zadaje pytania, proponuje odpowiedzi i sprawdza je',['zawsze zna odpowiedź','tylko czyta książki','zbiera kamienie'],'Badacze przyrody stosują metodę naukową.'),
 D(1,()=>{const s=P(SCI_ST);return{q:`Który to etap metody naukowej? <b>${s[1]}</b>`,ok:s[0],bad:pickN(SCI_ST.filter(x=>x!==s).map(x=>x[0]),3),expl:`To etap: ${s[0]}.`}}),
 Ord(2,'Ułóż etapy metody naukowej we właściwej kolejności.',SCI_ST.map(x=>x[0]),'Obserwacja i pytanie badawcze → hipoteza → doświadczenie lub obserwacja → wyniki → wniosek.'),
 SQ(2,'Aura mówi: „Woda w kałuży zamieniła się w lód. W nocy musiało być poniżej zera”. Oceń każde zdanie.',['obserwacja','hipoteza'],[['Woda w kałuży zamieniła się w lód.',0],['W nocy musiało być poniżej zera.',1]],2,'Lód w kałuży Aura widzi, więc to obserwacja. Temperatury w nocy nie widziała, tylko się jej domyśla, więc to hipoteza.'),
 O(2,'Kot Darwin widzi, że rośliny na parapecie pochylają się w stronę okna. Która hipoteza najlepiej to wyjaśnia?','Rośliny pochylają się ku światłu, bo potrzebują go do życia',['Rośliny lubią dotykać szyby','Rośliny są ciężkie i przewracają się, bo parapet jest pochylony','Rośliny boją się kota'],'Rośliny potrzebują światła, a reakcja na bodźce to czynność życiowa.'),
 O(2,'Co robisz, jeśli wyniki nie potwierdzają hipotezy?','Odrzucasz hipotezę',['Zmieniasz wyniki','Udajesz, że badania nie było','Uznajesz hipotezę za prawdziwą'],'Hipoteza potwierdzona przez wyniki zostaje. Niepotwierdzoną się odrzuca.'),
 O(2,'Lumo zastanawia się, dlaczego czasem robi dużo zadań w godzinę, a czasem ani jednego. Która wypowiedź jest hipotezą?','„Wydaje mi się, że to dlatego, że gdy jest cicho, mogę się lepiej skupić.”',['„Dlaczego czasem udaje mi się zrobić dużo zadań?”','„Wczoraj zrobiłem pięć zadań.”','„Zadania są nudne.”'],'Pierwsze pytanie to pytanie badawcze, „pięć zadań” to wynik, a „nudne” to opinia.'),
 O(3,'Czy odrzucona hipoteza oznacza porażkę badacza?','Nie, bo badacz dowiaduje się czegoś nowego i może sprawdzić inną hipotezę',['Tak, badanie było niepotrzebne','Tak, badacz musi zrezygnować','Nie, bo hipotez nigdy się nie odrzuca'],'Odrzucenie błędnej hipotezy przybliża do prawdy.'),
 O(3,'Dlaczego doświadczenie lub obserwację trzeba powtórzyć kilka razy?','Żeby upewnić się, że wynik nie jest zwykłym przypadkiem',['Bo za pierwszym razem zawsze wychodzi źle','Żeby badanie trwało dłużej','Nie trzeba powtarzać'],'Gdyby badacze nie sprawdzali hipotez wiele razy, mogliby uznać przypadek za prawdę.'),
 O(3,'Jak sprawdzić hipotezę, że rośliny pochylają się do światła?','Obrócić doniczkę i po kilku dniach zobaczyć, czy roślina znowu pochyli się do okna',['Wyprostować roślinę ręką','Postawić roślinę na równym stole w tym samym miejscu i nic nie zmieniać','Zapytać kota Darwina'],'Gdy zmienisz tylko kierunek światła względem rośliny, zobaczysz, czy to światło ją przyciąga.'),
 Ord(3,'Ułóż etapy metody naukowej we właściwej kolejności.',SCI_ST.map(x=>x[0]),'Obserwacja i pytanie badawcze → hipoteza → doświadczenie lub obserwacja → wyniki → wniosek.')
],
dosw:(()=>{const SIT=[['Liczysz z daleka ptaki na pustym placu.',0],['Rozsypujesz ziarno na placu i liczysz, ile ptaków przyleci.',1],['Siedzisz cicho przy oknie i notujesz, kiedy sikorka przylatuje do karmnika.',0],['Stawiasz jedną roślinę w ciemnej szafie, a drugą na oknie.',1],['Dotykasz piórkiem liścia mimozy i patrzysz, co się stanie.',1],['Przez lornetkę oglądasz bociana w gnieździe.',0],['Wkładasz rękę do zimnej wody, a potem do letniej.',1],['Nagrywasz telefonem lisa w lesie, nie podchodząc do niego.',0],['Świecisz latarką na kamień i sprawdzasz, czy coś się zmieni.',1]];return[
 O(1,'Doświadczenie to:','celowe wpływanie na badany obiekt lub zjawisko, aby sprawdzić skutek',['przyglądanie się bez żadnych zmian','zgadywanie odpowiedzi','zapisywanie wyników'],'Np. rozsypujesz ziarno na placu i sprawdzasz, ile ptaków przyleci.'),
 SQ(1,'Doświadczenie czy obserwacja?',['obserwacja','doświadczenie'],SIT,3,listExpl),
 SQ(2,'Doświadczenie czy obserwacja?',['obserwacja','doświadczenie'],SIT,5,listExpl),
 O(2,'Rozsypujesz ziarno na placu i jednocześnie stawiasz atrapę jastrzębia, która wydaje dźwięki. Co jest nie tak?','Zmieniasz dwie rzeczy naraz, więc nie wiesz, która wpłynęła na ptaki',['Nic, to dobre doświadczenie','Ptaki nie jedzą ziarna','Trzeba było zrobić to w nocy'],'W doświadczeniu zmieniaj tylko jedną rzecz naraz.'),
 O(2,'Co łączy obserwację i doświadczenie?','Obserwacja jest częścią każdego doświadczenia',['Nic ich nie łączy','W obu celowo coś zmieniasz','Oba robi się tylko w laboratorium'],'Trzeba uważnie obserwować przebieg doświadczenia, żeby opisać wyniki i wyciągnąć wnioski.'),
 O(3,'Która z tych rzeczy <b>nie jest</b> zasadą bezpiecznego doświadczenia?','Próbuj smaku substancji, żeby je rozpoznać',['Dbaj o porządek','Przestrzegaj instrukcji','Myj ręce przed i po'],'Zasady: porządek, instrukcja, mycie rąk, odzież ochronna (rękawiczki, okulary, fartuch).'),
 SQ(3,'Doświadczenie czy obserwacja?',['obserwacja','doświadczenie'],SIT,6,listExpl)
]})(),
fakty:[
 O(1,'Fakt to:','informacja, którą można sprawdzić i udowodnić',['czyjeś odczucie','ocena, z którą nie wszyscy się zgadzają','to, co lubimy'],'Np. „Kot ma 4 łapy” – wystarczy policzyć.'),
 O(1,'Opinia to:','przekonanie lub odczucie jakiejś osoby',['informacja, którą zawsze można udowodnić','wynik pomiaru','zdanie z podręcznika'],'Różne osoby mogą mieć odmienne opinie na ten sam temat.'),
 SQ(1,'Fakt czy opinia?',['fakt','opinia'],[...FACTS.map(x=>[x,0]),...OPIN.map(x=>[x,1])],4,'Fakty da się sprawdzić (policzyć, zmierzyć). Opinie to oceny: piękny, brzydki, fajniejszy, nudny.'),
 SQ(2,'Fakt czy opinia?',['fakt','opinia'],[...FACTS.map(x=>[x,0]),...OPIN.map(x=>[x,1])],6,'Fakty da się sprawdzić (policzyć, zmierzyć). Opinie to oceny: piękny, brzydki, fajniejszy, nudny.'),
 O(2,'Jak sprawdzić zdanie „W tym plecaku jest pięć książek”?','Zajrzeć do środka i policzyć książki',['Zapytać, czy plecak się podoba','Nie da się tego sprawdzić','Zważyć plecak'],'To fakt, bo można go łatwo potwierdzić.'),
 O(3,'Dlaczego badacz powinien opierać się na faktach?','Bo fakty nie zależą od poglądów i wrażeń',['Bo opinie są zawsze fałszywe','Bo fakty są ciekawsze','Bo tak jest szybciej'],'Dobry badacz odróżnia fakty od opinii, a pomaga mu w tym metoda naukowa.'),
 SQ(3,'Fakt czy opinia?',['fakt','opinia'],[...FACTS.map(x=>[x,0]),...OPIN.map(x=>[x,1])],7,'Fakty da się sprawdzić (policzyć, zmierzyć). Opinie to oceny: piękny, brzydki, fajniejszy, nudny.')
],
cien:[
 O(1,'Stoisz tyłem do Słońca. Gdzie jest twój cień?','Przed tobą',['Za tobą','Nie ma go','Nad tobą'],'Cień jest zawsze po przeciwnej stronie niż źródło światła.'),
 O(1,'Cień zawsze wskazuje kierunek:','przeciwny do źródła światła',['w stronę Słońca','zawsze na wschód','zawsze w lewo'],'Znając położenie Słońca, zawsze znasz kierunek cienia, i odwrotnie.'),
 O(1,'Kiedy w ciągu dnia twój cień jest najkrótszy?','Około godziny 12:00',['Rano','Wieczorem','Zawsze jest taki sam'],'W południe Słońce jest najwyżej, a im wyżej Słońce, tym krótszy cień.'),
 O(2,'Im wyżej na niebie jest Słońce, tym cień jest:','krótszy',['dłuższy','taki sam','bardziej kolorowy'],'Słońce nisko – długi cień. Słońce wysoko – krótki cień.'),
 SQ(2,'Jaki będzie cień o tej porze dnia?',['dłuższy','najkrótszy'],[['rano',0],['około 12:00',1],['po południu',0]],3,'Rano i po południu Słońce jest nisko, więc cień jest dłuższy niż w południe.'),
 D(2,()=>{const s=sides(0);const k=P([['przed sobą','przed'],['za plecami','tyl'],['po prawej stronie','prawa'],['po lewej stronie','lewa']]);return{q:`Około godziny 12:00 stoisz tyłem do Słońca. Jaki kierunek masz <b>${k[0]}</b>?`,ok:s[k[1]],bad:DIRS.filter(d=>d!==s[k[1]]),expl:`Około 12:00 Słońce jest na południu. Stojąc tyłem do niego, przed sobą masz północ, za plecami południe, po prawej wschód, a po lewej zachód.`}}),
 O(2,'Około godziny 12:00 cień wskazuje:','północ',['południe','wschód','zachód'],'W południe Słońce jest na południu, więc cień pada w przeciwną stronę, na północ.'),
 O(3,'Kot Darwin około 12:00 siedzi pyszczkiem na wschód. W którą stronę pada jego cień?','na północ',['na wschód','na zachód','na południe'],'Kierunek cienia zależy od Słońca, nie od tego, jak się ustawisz. Około 12:00 cień zawsze wskazuje północ.'),
 O(3,'Jak bez przyrządów wyznaczyć kierunki świata?','Obserwując Słońce i cień o określonej porze dnia',['Patrząc, gdzie jest najwięcej chmur','Słuchając, skąd śpiewają ptaki','Nie da się tego zrobić'],'Kierunki świata są stałe i związane z położeniem Słońca na niebie.'),
 O(3,'O której stronie świata Słońce wschodzi?','na wschodzie',['na zachodzie','na północy','na południu'],'Słońce wędruje po niebie od wschodu, przez południe (około 12:00), na zachód.')
],
kier:[
 D(1,()=>{const l=P(LET);return{q:`Co oznacza litera <b>${l[0]}</b> na kompasie?`,ok:l[2],bad:LET.filter(x=>x!==l).map(x=>x[2]),expl:`${l[0]} to ${l[1]} – ${l[2]}. Litery pochodzą z języka angielskiego.`}}),
 O(1,'Przyrząd, który wskazuje kierunki świata, to:','kompas',['termometr','lornetka','wiatromierz'],'Kompas jest mały, poręczny i nie wymaga zasilania.'),
 O(1,'Która część igły kompasu wskazuje północ?','czerwona',['niebieska','obie naraz','żadna'],'Czerwona końcówka (czasem z grotem) pokazuje północ, a niebieska południe.'),
 D(2,()=>{const s=sides(0);const k=P([['za plecami (od strony grzbietu)','tyl'],['po prawej stronie','prawa'],['po lewej stronie','lewa']]);return{q:`Kot Darwin siedzi pyszczkiem na północ. Jaki kierunek ma <b>${k[0]}</b>?`,ok:s[k[1]],bad:DIRS.filter(d=>d!==s[k[1]]),expl:'Twarzą na północ: od grzbietu południe, po prawej wschód, po lewej zachód.'}}),
 Ord(2,'Ułóż kroki korzystania z kompasu.',['Połóż kompas płasko na poziomym podłożu.','Poczekaj, aż igła przestanie się obracać.','Obróć kompas, aż czerwona igła stanie przy literze N.'],'Najpierw kompas płasko, potem czekasz na igłę, na końcu obracasz tarczę tak, by czerwona igła była przy N.'),
 O(2,'Dlaczego polecenie „skręć w lewo” bywa mylące?','Bo dla dwóch osób stojących naprzeciw siebie lewo to różne strony',['Bo nikt nie wie, gdzie jest lewo','Bo lewo zawsze oznacza zachód','Nie jest mylące'],'Dlatego wprowadzono stałe kierunki świata: północ, południe, wschód i zachód.'),
 O(2,'Z jakiego języka pochodzą oznaczenia N, S, E, W?','z angielskiego',['z polskiego','z łaciny','z niemieckiego'],'N – North, S – South, E – East, W – West.'),
 D(3,()=>{const f=R(1,3),s=sides(f);const k=P([['po prawej','prawa'],['po lewej','lewa'],['za plecami','tyl']]);return{q:`Stoisz twarzą na <b>${DIRS[f]}</b>. Jaki kierunek masz <b>${k[0]}</b>?`,ok:s[k[1]],bad:DIRS.filter(d=>d!==s[k[1]]),expl:`Twarzą na ${s.przed}: po prawej ${s.prawa}, po lewej ${s.lewa}, za plecami ${s.tyl}. Kierunki idą zgodnie z ruchem wskazówek zegara: północ, wschód, południe, zachód.`}}),
 O(3,'Niebieska część igły kompasu wskazuje:','południe',['północ','wschód','zachód'],'Czerwona igła wskazuje północ, więc niebieska, po przeciwnej stronie, wskazuje południe.'),
 O(3,'Aura położyła kompas na stole, ale tarcza jest obrócona: litera N nie stoi przy czerwonej igle. Gdzie jest północ?','Tam, gdzie wskazuje czerwona igła',['Tam, gdzie stoi litera N','Tam, gdzie wskazuje niebieska igła','Nie da się tego ustalić'],'Igła ustawia się sama i czerwona końcówka zawsze pokazuje północ. Tarczę trzeba dopiero obrócić tak, by litera N stanęła przy czerwonej igle.'),
 O(3,'Wyznaczasz kompasem północ na jednym końcu boiska, a potem na drugim. Co zauważysz?','Północ jest w tym samym kierunku w obu miejscach',['Na drugim końcu północ jest odwrotnie','Kompas przestaje działać','Północ zmienia się co kilka kroków'],'Kierunki świata są stałe. Nie zależą od tego, gdzie stoisz ani jak się obrócisz.'),
 O(3,'W Polsce w południe Słońce pokazuje, gdzie jest południe. W którą stronę zwrócony jest wtedy twój cień?','na północ',['na południe','na wschód','na zachód'],'Cień pada w stronę przeciwną do Słońca, więc wskazuje północ.')
],
roza:[
 D(1,()=>{const d=P(D8.filter(x=>x[0].length===2));return{q:`Co oznacza skrót <b>${d[0]}</b> na róży wiatrów?`,ok:d[1],bad:pickN(D8N.filter(x=>x!==d[1]),3),expl:`${d[0]} to ${d[1]}. Kierunki pośrednie łączą nazwy dwóch kierunków głównych.`}}),
 O(1,'Rysunek kierunków świata z kierunkami głównymi i pośrednimi to:','róża wiatrów',['kompas','wiatromierz','mapa'],'Róża wiatrów pokazuje 4 kierunki główne (N, E, S, W) i pośrednie (NE, SE, SW, NW).'),
 D(2,()=>{const i=P([1,3,5,7]);return{q:`Jaki kierunek leży między kierunkami <b>${D8N[i-1]}</b> a <b>${D8N[(i+1)%8]}</b>?`,ok:D8N[i],bad:pickN(D8N.filter(x=>x!==D8N[i]),3),expl:`Między nimi leży ${D8N[i]} (${D8[i][0]}).`}}),
 D(2,()=>{const d=P(D8);return{q:`Jaki skrót ma kierunek <b>${d[1]}</b>?`,ok:d[0],bad:pickN(D8.filter(x=>x!==d).map(x=>x[0]),3),expl:`${d[1][0].toUpperCase()+d[1].slice(1)} to ${d[0]}. Litery pochodzą z języka angielskiego.`}}),
 D(2,()=>{const t=P([['lipa','na wschód od grabu'],['klon','na zachód od grabu'],['dąb','na północ od grabu'],['buk','na południe od grabu']]);return{q:`Na planie grab rośnie w środku. Dąb jest na północ, buk na południe, klon po lewej (zachód), a lipa po prawej (wschód). Które drzewo rośnie <b>${t[1]}</b>?`,ok:t[0],bad:['dąb','buk','klon','lipa'].filter(x=>x!==t[0]),expl:'Na planie północ jest u góry, południe na dole, zachód po lewej, a wschód po prawej.'}}),
 D(3,()=>{const i=R(0,7);return{q:`Jaki kierunek jest dokładnie <b>przeciwny</b> do kierunku ${D8N[i]} (${D8[i][0]})?`,ok:D8N[(i+4)%8],bad:pickN(D8N.filter((_,k)=>k!==(i+4)%8&&k!==i),3),expl:`Naprzeciwko ${D8[i][0]} na róży wiatrów leży ${D8[(i+4)%8][0]}, czyli ${D8N[(i+4)%8]}.`}}),
 D(3,()=>{const s=R(0,3),n=R(1,3),end=DIRS[(s+n)%4];return{q:`Obchodzisz prostokątne boisko wzdłuż krawędzi. Zaczynasz, idąc na <b>${DIRS[s]}</b>. W którym kierunku idziesz po skręcie w prawo po raz <b>${['pierwszy','drugi','trzeci'][n-1]}</b>?`,ok:end,bad:DIRS.filter(d=>d!==end),expl:`Skręt w prawo to krok zgodnie z ruchem wskazówek zegara: północ → wschód → południe → zachód. Z kierunku ${DIRS[s]} po ${n} ${plural(n,'skręcie','skrętach','skrętach')} idziesz na ${end}.`}}),
 O(3,'Około południa stoisz plecami do Słońca, a trasa prowadzi na południowy zachód. W którą stronę idziesz?','Między południem a zachodem, czyli ukośnie do tyłu w lewo',['Prosto przed siebie','Ukośnie do przodu w prawo','Prosto w prawo'],'Przed tobą jest północ, za plecami południe, po lewej zachód. Południowy zachód leży między plecami a lewą ręką.')
],
kodeks:[
 SQ(1,'Jak zachowuje się ta osoba na wycieczce w lesie?',['dobrze','źle'],BEHAV,4,'Dobry gość lasu trzyma się grupy, jest cicho, nie niszczy roślin i grzybów, nie płoszy zwierząt i zabiera swoje śmieci.'),
 O(1,'Które trzy zasady tworzą kodeks młodego przyrodnika?','Zachowaj bezpieczeństwo, okaż szacunek przyrodzie, zabieraj śmieci ze sobą',['Biegaj, krzycz, zbieraj grzyby','Zrywaj kwiaty, karm zwierzęta, zostawiaj ślady','Chodź sam, idź na skróty, rozpal ognisko'],'Las, park i łąka to dom zwierząt, roślin i grzybów. Ty jesteś tam gościem.'),
 SQ(2,'Jak zachowuje się ta osoba na wycieczce w lesie?',['dobrze','źle'],BEHAV,6,'Dobry gość lasu trzyma się grupy, jest cicho, nie niszczy roślin i grzybów, nie płoszy zwierząt i zabiera swoje śmieci.'),
 O(2,'W ciepły jesienny dzień idziesz z klasą do lasu. Dlaczego krótkie spodenki to zły pomysł?','Bo odsłonięte nogi narażają na kleszcze, owady i parzące rośliny',['Bo w lesie zawsze pada śnieg','Bo są zbyt kolorowe','To dobry pomysł, bo jest ciepło'],'Do lasu zakłada się ubranie i buty zakrywające ciało.'),
 O(2,'W trawie siedzi zajączek i wygląda na opuszczonego. Co robisz?','Nie podchodzę i nie dotykam go, obserwuję z daleka',['Zabieram go do domu','Głaszczę go, żeby się nie bał','Karmię go kanapką'],'Nie zbliżaj się do zwierząt, nawet jeśli wydają się opuszczone. Matka zwykle jest w pobliżu.'),
 O(2,'Kolega namawia, żeby zejść ze szlaku i sprawdzić dziwną jaskinię. Co robisz?','Zostaję z grupą, a o jaskini mówię opiekunowi',['Idę z kolegą, ale szybko','Idę sam, żeby było ciszej','Wchodzę do jaskini z latarką w telefonie'],'Trzymaj się grupy i pozostawaj w zasięgu wzroku opiekuna.'),
 O(2,'Dlaczego klapki są niebezpieczne na leśnej ścieżce?','Łatwo potknąć się o korzenie i kamienie, a stopy nie są osłonięte',['Bo są za ciężkie','Bo płoszą ptaki','Nie są niebezpieczne'],'Patrz pod nogi i wkładaj wygodne buty zakrywające stopy.'),
 SQ(3,'Prawda czy fałsz?',['prawda','fałsz'],[['W lesie należy zachować ciszę, bo hałas płoszy i stresuje zwierzęta.',0],['Skórkę od banana wolno wyrzucić pod drzewo.',1],['Jagody można jeść prosto z krzaczka, bo w lesie jest czysto.',1],['W lesie wolno robić zdjęcia i filmy.',0],['W lesie wolno rozpalać ognisko w dowolnym miejscu.',1],['Wiele roślin i grzybów jest pod ochroną albo może być trujących.',0]],4,'Ciszę zachowujemy dla zwierząt. Żadnych śmieci nie zostawiamy, nawet skórki od banana. Nieumytych i nieznanych owoców nie jemy. Ognia w lesie nie rozpalamy.'),
 SQ(3,'Do której grupy kodeksu pasuje zasada?',['bezpieczeństwo','szacunek','nie śmieć'],RULES,5,listExpl),
 O(3,'Lumo chce wziąć do lasu głośnik i balony na „imprezę dla zwierząt”. Co się stanie, gdy balon pęknie i zostanie w lesie?','Zostanie śmieciem, który zwierzę może połknąć albo się w nim zaplątać',['Nic, balon szybko zniknie','Zwierzęta będą miały zabawkę','Balon nawiezie glebę'],'Nie zostawiaj śladów swojej obecności. Głośnik też jest złym pomysłem, bo hałas płoszy zwierzęta.')
],
smieci:[
 D(1,()=>{const t=P(TRASH);return{q:`Ile mniej więcej rozkłada się w przyrodzie: <b>${t[0]}</b>?`,ok:t[1],bad:pickN(TRASH.filter(x=>x!==t).map(x=>x[1]),3),expl:`${t[0][0].toUpperCase()+t[0].slice(1)}: ${t[1]}.`}}),
 O(1,'Który z tych śmieci rozkłada się najdłużej?','szklana butelka',['papier','guma do żucia','puszka aluminiowa'],'Szkło rozkłada się około 4000 lat.'),
 O(1,'Gdzie należy wyrzucać śmieci?','Tylko w wyznaczonych miejscach, do odpowiednich pojemników',['Pod drzewo, bo się rozłożą','Do strumienia','Gdziekolwiek, byle nikt nie widział'],'Segregowanie pozwala ponownie wykorzystać odzyskane materiały.'),
 D(2,()=>{const a=R(8,12);return{q:`${P(['Lumo','Franek','Kuba'])} ma ${a} lat i wyrzucił w lesie gumę do żucia. Ile lat będzie miał, gdy guma zniknie z lasu?`,ok:String(a+5),bad:[String(a+1),String(a+50),String(a)],expl:`Guma rozkłada się około 5 lat: ${a} + 5 = ${a+5}.`}}),
 O(2,'Aura ma 9 lat i zostawiła w lesie foliową torebkę. Czy torebka zniknie w ciągu jej życia, jeśli nikt jej nie sprzątnie?','Nie, bo torba foliowa rozkłada się 100–400 lat',['Tak, za rok','Tak, za 5 lat','Tak, jeśli będzie padać'],'Torebka przetrwa znacznie dłużej niż życie człowieka.'),
 O(2,'Dlaczego porzucona szklana butelka jest groźna dla zwierząt?','Owady i małe gryzonie wchodzą do środka, ale nie umieją się wydostać',['Bo jest za ciężka','Bo przyciąga burze','Nie jest groźna'],'Butelka to śmiertelna pułapka dla małych zwierząt.'),
 O(2,'Co zanieczyszczają śmieci w przyrodzie?','ziemię, wodę i powietrze',['tylko powietrze','tylko wodę','niczego nie zanieczyszczają'],'Śmieci sprawiają też, że okolica staje się nieuporządkowana i nieprzyjazna.'),
 {l:2,f:()=>{const s=sortedPick(TRASH_ORD,4);return Ord(2,'Ułóż od tego, co rozkłada się <b>najszybciej</b>, do tego, co najdłużej.',s,s.map(x=>`${x}: ${TRASH.find(t=>t[0]===x)[1]}`).join('; ')+'.').f()}},
 {l:3,f:()=>{const s=sortedPick(TRASH_ORD,5);return Ord(3,'Ułóż od tego, co rozkłada się <b>najszybciej</b>, do tego, co najdłużej.',s,s.map(x=>`${x}: ${TRASH.find(t=>t[0]===x)[1]}`).join('; ')+'.').f()}},
 O(3,'Dlaczego nie wolno wyrzucać śmieci w lesie? Wybierz najlepszy powód.','Bo latami zanieczyszczają środowisko i szkodzą zwierzętom',['Bo las jest prywatny','Bo śmieci szybko się rozkładają','Bo leśniczy da mandat, a poza tym nic się nie stanie'],'Nawet puszka leży w lesie 100–200 lat, a zwierzęta mogą się nią zranić albo w niej uwięznąć.')
],
wyprawa:[
 D(1,()=>{const i=R(0,5);return{q:`Który to etap przygotowań do wyprawy? <b>${PLAN_D[i]}</b>`,ok:PLAN[i],bad:pickN(PLAN.filter((_,k)=>k!==i),3),expl:`To etap ${i+1}: ${PLAN[i].toLowerCase()}.`}}),
 SQ(1,'Spakuj plecak na wyprawę do lasu.',['zabieram','zostawiam'],PACK,4,'Na wyprawę bierzesz mapę, kompas, apteczkę, wodę, przekąski, worek na śmieci i naładowany telefon. Głośnik, balony i klapki zostają w domu.'),
 O(1,'Po co przed wyjściem w teren sprawdza się prognozę pogody?','Żeby dobrać ubiór i nie dać się zaskoczyć burzy czy ulewie',['Żeby wiedzieć, ile kosztuje bilet','Żeby wybrać kolor plecaka','Nie trzeba jej sprawdzać'],'Sprawdzenie pogody to ostatni etap przed wyruszeniem, razem z naładowaniem telefonu.'),
 {l:2,f:()=>{const s=sortedPick(PLAN,4);return Ord(2,'Ułóż etapy przygotowań do wyprawy we właściwej kolejności.',s,'Kolejność: '+PLAN.join(' → ')+'.').f()}},
 SQ(2,'Spakuj plecak na wyprawę do lasu.',['zabieram','zostawiam'],PACK,6,'Na wyprawę bierzesz mapę, kompas, apteczkę, wodę, przekąski, worek na śmieci i naładowany telefon. Głośnik, balony i klapki zostają w domu.'),
 O(2,'Co sprawdzasz na etapie „poziom trudności”?','Po jakim terenie będziesz iść: płaskim, górzystym, przez las',['Ile kosztują przekąski','Jaką ocenę dostaniesz','Kto pójdzie pierwszy'],'Trudność trasy wpływa na czas wyprawy i potrzebny sprzęt.'),
 Ord(3,'Ułóż wszystkie etapy przygotowań do wyprawy.',PLAN,'Kolejność: '+PLAN.join(' → ')+'.'),
 O(3,'Na którym etapie przygotowań prosisz opiekunów, żeby ci towarzyszyli?','na ostatnim, tuż przed wyruszeniem',['na pierwszym, razem z celem','przy wyborze transportu','wcale, bo dzieci chodzą same'],'Ostatni etap: pogoda, naładowany telefon i ustalenie szczegółów z opiekunem.')
]};
B.zywe.push(O(3,'Automatyczna kosiarka sama jeździ po ogrodzie, „reaguje” na płot i „je” trawę. Czy jest organizmem?','Nie, bo nie rośnie, nie rozmnaża się i nie oddycha',['Tak, bo się porusza','Tak, bo je trawę','Tak, bo reaguje na płot'],'Organizm wykonuje wszystkie czynności życiowe. Kosiarka tylko ścina trawę, a nie odżywia się nią, i nie rozmnaża się.'));
B.zmysly.push(O(3,'Lumo widzi krzak z nieznanymi, apetycznymi czerwonymi jagodami. Co powinien zrobić?','Nie próbować ich ani nie dotykać, obejrzeć z bliska i zapytać opiekuna',['Spróbować jednej, żeby poznać smak','Zjeść, bo w lesie wszystko jest czyste','Zerwać całą garść na później'],'Nieznane rośliny mogą być trujące. Przy nieznanych obiektach nie używa się smaku, a dotyku tylko ostrożnie.'));
B.metoda.push(O(3,'Aura sprawdza, czy fasola potrzebuje światła do wzrostu i jak działa na nią woda z solą. Na ile pytań badawczych szuka odpowiedzi?','2',['1','3','4'],'Pytanie 1: czy fasola potrzebuje światła? Pytanie 2: jak wpływa na nią słona woda?'));
B.dosw.push(O(3,'Aura chce sprawdzić, jak słona woda wpływa na fasolę. Jak powinna ułożyć doświadczenie?','Dwie doniczki w tym samym świetle; jedną podlewa zwykłą wodą, drugą słoną',['Jedną doniczkę w ciemności ze słoną wodą, drugą na oknie ze zwykłą','Obie podlewa słoną wodą','Sadzi różne rośliny w różnej ziemi'],'Zmieniamy tylko jedną rzecz naraz. Ziemia, nasiona i światło muszą być takie same.'));
