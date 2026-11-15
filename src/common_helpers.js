const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const P=a=>a[Math.floor(Math.random()*a.length)];
const plural=(n,a,b,c)=>{if(n===1)return a;const u=n%10,t=n%100;return(u>=2&&u<=4&&(t<12||t>14))?b:c};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pickN=(a,n)=>shuffle(a).slice(0,n);
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const today=()=>ymd(new Date());
const LV={1:'łatwy',2:'średni',3:'trudny'};
const CUR=new Date().getFullYear();

/* liczby rzymskie i wieki */
const toRoman=n=>{const m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const[v,r]of m)while(n>=v){s+=r;n-=v}return s};
const fromRoman=s=>{const v={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let n=0;for(let i=0;i<s.length;i++){const a=v[s[i]],b=v[s[i+1]];if(!a)return NaN;n+=b>a?-a:a}return toRoman(n)===s?n:NaN};
const cent=y=>Math.ceil(y/100);
const rk=(y,bc,ne)=>`${y} roku${bc?' p.n.e.':ne?' n.e.':''}`;
const near=(ok,extra=[])=>{const c=[...new Set([ok+1,ok-1,ok+10,ok-10,ok+2,ok-2,ok+5,...extra].filter(x=>x>0&&x!==ok))];return pickN(c,3).map(String)};
const rnear=n=>{const ok=toRoman(n);const c=[...new Set([n+1,n-1,n+2,n-2,n+10,n-10,n+5,n-5].filter(x=>x>0).map(toRoman).filter(x=>x!==ok))];return pickN(c,3)};
const wnear=(c,bc)=>{const ok=toRoman(c)+(bc?' p.n.e.':'');const cs=[...new Set([c+1,c-1,c+2,c-2].filter(x=>x>0))];return pickN(cs,3).map(x=>toRoman(x)+(bc?' p.n.e.':''))};
