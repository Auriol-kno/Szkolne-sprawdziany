const fs=require('fs');
const html=fs.readFileSync('stara/index.html','utf8');
const js=html.match(/<script>([\s\S]*)<\/script>/)[1];
const stubEl={addEventListener(){},querySelectorAll:()=>[],classList:{toggle(){}},set innerHTML(v){this._h=v},hidden:false};
global.document={querySelector:()=>stubEl,querySelectorAll:()=>[],documentElement:{dataset:{},removeAttribute(){}}};
global.window={matchMedia:()=>({matches:false})};global.matchMedia=window.matchMedia;
global.localStorage={getItem:()=>null,setItem(){}};
global.scrollTo=()=>{};global.navigator={};
const code=js+`
;let bad=0,tot=0;
for(const sid of Object.keys(SUBJECTS)){
 if(SUBJECTS[sid].custom)continue;
 setSubject(sid);
 // render all views
 for(const v of ['home','train','test','progress','hub']){VIEW=v;try{render()}catch(e){console.log('RENDER ERR',sid,v,e.message);bad++}}
 for(const id of Object.keys(B)){
 const lv={1:0,2:0,3:0};
 for(const e of B[id]){lv[e.l]++;
  for(let i=0;i<200;i++){
   let q;try{q=e.f()}catch(err){console.log('ERR',sid,id,e.l,err.message);bad++;break}
   tot++;
   const fail=m=>{bad++;if(bad<40)console.log('FAIL',sid,id,e.l,m,JSON.stringify(q).slice(0,300))};
   if(q.type==='one'){const s=new Set(q.opts);if(s.size!==q.opts.length)fail('dup opts');if(q.opts.length<3)fail('few opts');if(q.opts[q.fields[0].ans]===undefined)fail('ans')}
   if(q.type==='num'){q.fields.forEach(fd=>{if(fd.mark){if(!q.line)fail('mark noline');return}
      if(fd.ans==null||(typeof fd.ans==='number'&&(isNaN(fd.ans)||fd.ans<0)))fail('numans '+fd.label);
      const given=fd.kind==='w'?toRoman(fd.ans):String(fd.ans);if(!chk(fd,given))fail('chk self '+given)})}
   if(q.type==='order'&&new Set(q.steps).size!==q.steps.length)fail('dup steps');
   if(/NaN|undefined/.test(JSON.stringify(q)))fail('NaN/undefined');
   // render question body
   try{qBody(q,'r',[],false,false);qBody(q,'r',[],true,true)}catch(er){fail('qBody '+er.message)}
  }}
 console.log(sid,id,JSON.stringify(lv));
 }
}
console.log('total',tot,'bad',bad);
// full run flows
for(const sid of Object.keys(SUBJECTS)){if(SUBJECTS[sid].custom)continue;setSubject(sid);startRun('test',{level:2,timer:false,long:false});for(let i=0;i<RUN.n;i++){}
  VIEW='run';render();finishTest();VIEW='result';render();console.log(sid,'test ok',RUN.summary.pct)}
`;
eval(code);
