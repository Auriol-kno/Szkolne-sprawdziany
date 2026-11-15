/* ---------- typy zadań ---------- */
function D(l,fn){return{l,f:()=>{const o=fn();const opts=shuffle([o.ok,...o.bad]);return{type:'one',html:o.q,opts,fields:[{ans:opts.indexOf(o.ok)}],expl:o.expl,hint:o.hint,key:o.q}}}}
const O=(l,q,ok,bad,expl,hint)=>D(l,()=>({q,ok,bad,expl,hint}));
function SQ(l,q,cats,pool,n,expl,hint){return{l,f:()=>{
  let ch=[];cats.forEach((c,ci)=>{const g=pool.filter(p=>p[1]===ci);if(g.length&&ch.length<n)ch.push(P(g))});
  ch=ch.concat(pickN(pool.filter(p=>!ch.includes(p)),n-ch.length));ch=shuffle(ch);
  const ex=typeof expl==='function'?expl(ch,cats):expl;
  return{type:'sort',html:q,cats,fields:ch.map(p=>({item:p[0],ans:p[1]})),expl:ex,hint,key:q+ch.map(p=>p[0]).join('|')}}}}
function Ord(l,q,steps,expl,hint){return{l,f:()=>{let s;do{s=shuffle(steps.map((_,i)=>i))}while(s.every((v,i)=>v===i));
  return{type:'order',html:q,steps,shuf:s,fields:steps.map((_,k)=>({ans:k})),expl,hint,key:q+Math.random()}}}}
const SQd=(l,q,cats,poolFn,n,expl,hint)=>({l,f:()=>SQ(l,q,cats,poolFn(),n,expl,hint).f()});
const OrdD=(l,q,genFn)=>({l,f:()=>{const g=genFn();return Ord(l,q,g.steps,g.expl,g.hint).f()}});
const NM=(l,fn)=>({l,f:()=>{const o=fn();return{type:'num',html:o.q,fields:o.fields,expl:o.expl,hint:o.hint,key:o.q}}});
const F=(label,ans,kind,more)=>Object.assign({label,ans,kind:kind||'n'},more||{});
const listExpl=(ch,cats)=>ch.map(p=>`${p[0]} – ${cats[p[1]]}`).join('; ')+'.';

/* sprawdzanie odpowiedzi liczbowych: n = liczba, w = wiek (rzymski lub arabski), r = liczba rzymska */
function chk(fd,raw){
  let s=String(raw==null?'':raw).trim().toUpperCase().replace(/\s+/g,' ');
  s=s.replace(/\b(WIEK|LAT|LATA|DNI|DZIEŃ|KM|WIEKÓW|WIEKI|P\.N\.E\.|N\.E\.)\b/g,'').replace(/\./g,'').replace(/\s+/g,' ').trim();
  if(fd.kind==='r')return s.replace(/\s/g,'')===fd.ans;
  if(fd.kind==='w'){if(/^\d+$/.test(s))return+s===fd.ans;return fromRoman(s.replace(/\s/g,''))===fd.ans}
  return /^\d+$/.test(s)&&+s===fd.ans;
}
