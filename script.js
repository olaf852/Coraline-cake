const CATS=[
{k:'cake',label:'Cake flavor',opts:[
 {n:'Chocolate soil',c:'#4a2c1d'},{n:'Honey spice',c:'#c98a2b'},{n:'Blueberry night',c:'#3b3f8f'},{n:'Lemon raincoat',c:'#f2d03b'},{n:'Red velvet',c:'#9c1f3a'}]},
{k:'cream',label:'Cream',opts:[
 {n:'Cherry',c:'#c2304a'},{n:'Vanilla bean',c:'#f6ecd2'},{n:'Blackberry',c:'#5a2a6b'},{n:'Garden mint',c:'#8fd0a0'},{n:'Pumpkin',c:'#e88a2c'}]},
{k:'deco',label:'Decoration',opts:[
 {n:'Button eyes',e:'🔘'},{n:'Golden star',e:'⭐'},{n:'Black cat',e:'🐈‍⬛'},{n:'Little key',e:'🗝️'},{n:'Dragonfly',e:'🪲'},{n:'Mouse',e:'🐭'}]},
{k:'drizzle',label:'Drizzle',opts:[
 {n:'Honey',c:'#f0b323'},{n:'Fudge',c:'#3a1c10'},{n:'Moon sugar',c:'#f4f4ff'},{n:'Berry syrup',c:'#7b1f6e'}]}
];
const $=id=>document.getElementById(id);

// ---- Sounds (Web Audio, no files needed) ----
let audioCtx;
function getAudio(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq,start,dur,type='sine',vol=0.2){
  const ctx=getAudio(), t=ctx.currentTime+start;
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type=type; o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(vol,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t+dur+0.05);
}
function playWin(){
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,i*0.12,0.3,'triangle',0.22));
  tone(1318.5,0.5,0.5,'sine',0.18);
  tone(1568,0.6,0.6,'sine',0.12);
}
function playLose(){
  [392,349.23,311.13].forEach((f,i)=>tone(f,i*0.3,0.35,'sawtooth',0.12));
  tone(196,0.9,0.9,'sawtooth',0.14);
}
let score=0,round=1,lives=3,recipe={},pick={},timer=null,streak=0;

// background stars
const st=$('stars');
for(let i=0;i<22;i++){const s=document.createElement('i');s.textContent='★';
 s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
 s.style.fontSize=(10+Math.random()*26)+'px';s.style.animationDelay=(Math.random()*4)+'s';st.appendChild(s)}

function cakeHTML(s,fail){
 const g=k=>s[k]!=null?CATS.find(c=>c.k===k).opts[s[k]]:null;
 const a=g('cake'),b=g('cream'),d=g('deco'),r=g('drizzle');
 const bg=o=>o&&o.c?`background:${o.c}`:'';
 return `<div class="plate"></div>
 <div class="l1 ${a?'':'empty'}" style="${bg(a)}"></div>
 <div class="cr ${b?'':'empty'}" style="${bg(b)}"></div>
 <div class="l2 ${a?'':'empty'}" style="${bg(a)}"></div>
 <div class="top ${b?'':'empty'}" style="${bg(b)}"></div>
 ${r?`<div class="dr" style="${bg(r)}"></div>`:''}
 ${d?`<div class="dec">${d.e}</div>`:''}`;
}
function setCake(s,cls=''){const c=$('cake');c.className='cake '+cls;c.innerHTML=cakeHTML(s)}
function cats(){return round<3?CATS.slice(0,3):CATS}
function swatch(cat,i){const o=cat.opts[i];return `<div class="sw" style="${o.c?'background:'+o.c:'background:#fff'}">${o.e||''}</div>`}

function newRound(){
 recipe={};pick={};
 cats().forEach(c=>recipe[c.k]=Math.floor(Math.random()*c.opts.length));
 $('result').classList.add('hide');$('build').classList.add('hide');
 $('recipe').classList.remove('hide');$('barWrap').classList.remove('hide');
 $('phase').textContent='Memorize the recipe';
 $('recipe').innerHTML=cats().map(c=>`<div class="card">${swatch(c,recipe[c.k])}<small>${c.label}</small><b>${c.opts[recipe[c.k]].n}</b></div>`).join('');
 setCake(recipe);
 const secs=Math.max(4,9-round*0.5),bar=$('bar');
 bar.style.transition='none';bar.style.transform='scaleX(1)';
 void bar.offsetWidth;bar.style.transition=`transform ${secs}s linear`;bar.style.transform='scaleX(0)';
 clearTimeout(timer);timer=setTimeout(startBuild,secs*1000);
 updateHud();
}
function startBuild(){
 $('phase').textContent='Now bake it from memory';
 $('barWrap').classList.add('hide');
 $('recipe').innerHTML=cats().map(c=>`<div class="card q"><small>${c.label}</small><b>?</b></div>`).join('');
 pick={};setCake(pick);$('bake').disabled=true;
 $('rows').innerHTML=cats().map(c=>`<div class="row"><b>${c.label}</b><div class="opts">${c.opts.map((o,i)=>`<button class="opt" aria-pressed="false" data-k="${c.k}" data-i="${i}">${o.c?`<span class="d" style="background:${o.c}"></span>`:o.e} ${o.n}</button>`).join('')}</div></div>`).join('');
 $('build').classList.remove('hide');
}
$('rows').addEventListener('click',e=>{
 const b=e.target.closest('.opt');if(!b)return;
 const k=b.dataset.k;pick[k]=+b.dataset.i;
 document.querySelectorAll(`.opt[data-k="${k}"]`).forEach(x=>x.setAttribute('aria-pressed',x===b));
 setCake(pick);$('bake').disabled=cats().some(c=>pick[c.k]==null);
});
$('bake').onclick=()=>{
 const ok=cats().filter(c=>pick[c.k]===recipe[c.k]).length,all=ok===cats().length;
 all?playWin():playLose();
 $('build').classList.add('hide');$('recipe').classList.add('hide');
 setCake(pick,all?'win':'fail');
 $('phase').textContent=all?'A perfect cake!':'It collapsed…';
 if(all){streak++;score+=100+streak*25;$('resTxt').textContent=`Every ingredient right. Streak: ${streak}`;}
 else{streak=0;lives--;$('resTxt').textContent=`${ok} of ${cats().length} ingredients matched. The cake sags into the dark.`}
 $('cmp').innerHTML=cats().map(c=>{const r=c.opts[recipe[c.k]],p=c.opts[pick[c.k]],good=recipe[c.k]===pick[c.k];
  return `<div class="${good?'ok':'no'}"><b>${c.label}:</b> ${good?r.n:`${p.n} (needed ${r.n})`}</div>`}).join('');
 $('next').textContent=lives<=0?'Play again':'Next recipe';
 $('result').classList.remove('hide');
 if(all)round++;
 updateHud();
};
$('next').onclick=()=>{
 if(lives<=0){score=0;round=1;lives=3;streak=0}
 newRound();
};
function updateHud(){$('sc').textContent='Score '+score;$('rd').textContent='Round '+round;$('lv').textContent='Lives '+'♥'.repeat(Math.max(lives,0))+'♡'.repeat(3-Math.max(lives,0))}
$('start').onclick=()=>{
 getAudio();
 $('intro').classList.add('hide');
 $('game').classList.remove('hide');
 newRound();
};
