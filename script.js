/* ================= البيانات ================= */
const CATS=[
{k:'tiers',label:'عدد الطوابق',opts:[
 {n:'طابق واحد',e:'١'},{n:'طابقين',e:'٢'},{n:'ثلاثة طوابق',e:'٣'},{n:'أربعة طوابق',e:'٤'}]},
{k:'flavor',label:'نكهة الكيكة',opts:[
 {n:'تراب الشوكولا',c:'#4a2c1d'},{n:'عسل وبهارات',c:'#c98a2b'},{n:'توت الليل',c:'#3b3f8f'},{n:'ليمون المطر',c:'#f2d03b'},{n:'ريد فلفت',c:'#9c1f3a'},
 {n:'ماتشا',c:'#6c8a3b'},{n:'جزر',c:'#d9731e'},{n:'قهوة',c:'#6b4a35'},{n:'جوز الهند',c:'#efe4cf'},{n:'برقوق',c:'#5b2a5e'}]},
{k:'cream',label:'الكريمة',opts:[
 {n:'كرز',c:'#c2304a'},{n:'فانيلا',c:'#f6ecd2'},{n:'توت أسود',c:'#5a2a6b'},{n:'نعنع',c:'#8fd0a0'},{n:'يقطين',c:'#e88a2c'},
 {n:'فستق',c:'#a9c46b'},{n:'فراولة',c:'#f37a95'},{n:'كراميل',c:'#c4873a'},{n:'لافندر',c:'#b79be0'},{n:'خوخ',c:'#f6b48a'}]},
{k:'filling',label:'الحشوة',opts:[
 {n:'مربى فراولة',c:'#d62f55'},{n:'نوتيلا',c:'#4b2a1a'},{n:'كراميل مملّح',c:'#d28a2c'},{n:'كريمة فستق',c:'#b5d36b'},{n:'مربى مشمش',c:'#f39a2e'},
 {n:'كريمة ليمون',c:'#f6e45a'},{n:'توت أزرق',c:'#4a55c4'},{n:'موكا',c:'#8a5a3c'},{n:'جوز الهند',c:'#fbf5e6'},{n:'كريمة ورد',c:'#f08bb0'}]},
{k:'drizzle',label:'الصوص',opts:[
 {n:'عسل',c:'#f0b323'},{n:'فادج',c:'#3a1c10'},{n:'سكر القمر',c:'#f4f4ff'},{n:'شراب التوت',c:'#7b1f6e'},
 {n:'كراميل',c:'#b8691f'},{n:'نعنع',c:'#4fd6a8'},{n:'وردي',c:'#ff7fa8'},{n:'ثلج أزرق',c:'#6fb2ff'}]},
{k:'deco',label:'الزينة',opts:[
 {n:'عيون زراير',e:'🔘'},{n:'نجمة ذهبية',e:'⭐'},{n:'قطة سودا',e:'🐈‍⬛'},{n:'مفتاح صغير',e:'🗝️'},{n:'فراشة',e:'🦋'},{n:'فأر',e:'🐭'},
 {n:'هلال',e:'🌙'},{n:'فطر',e:'🍄'},{n:'وردة',e:'🌹'},{n:'شمعة',e:'🕯️'},{n:'كرزة',e:'🍒'},{n:'تاج',e:'👑'}]},
{k:'sprinkles',label:'الرشّات',opts:[
 {n:'قزحية',e:'🌈',kind:'rods',cols:['#ff5f7a','#f6c935','#6fdc8c','#6fb2ff','#b79be0']},
 {n:'لؤلؤ أبيض',e:'🤍',kind:'pearls',cols:['#fffaf0']},
 {n:'رقائق ذهب',e:'✨',kind:'flakes',cols:['#f6c935','#ffd966']},
 {n:'لؤلؤ وردي',e:'🌸',kind:'pearls',cols:['#ff9bb8','#ffc2d4']},
 {n:'عيدان شوكولا',e:'🍫',kind:'rods',cols:['#3a1c10','#5a3420']},
 {n:'رقائق فضة',e:'🪩',kind:'flakes',cols:['#dfe6f2','#bcc7da']},
 {n:'حبيبات زرقاء',e:'🫐',kind:'pearls',cols:['#4a66d8','#7f9cff']},
 {n:'عيدان خضرا',e:'🍃',kind:'rods',cols:['#4fb86a','#8fd86a']}]}
];
const CHARS=[
 {id:'coraline',name:'كورالين',img:'images/coraline.jpg'},
 {id:'wybie',name:'ويبي',img:'images/wybie.jpg'},
 {id:'cat',name:'القطة',img:'images/cat.jpg'},
 {id:'other',name:'الأم الأخرى',img:'images/other-mother.jpg'},
 {id:'bobinsky',name:'السيد بوبينسكي',img:'images/bobinsky.jpg'},
 {id:'spink',name:'سبينك وفورسيبل',img:'images/spink-forcible.jpg'}
 // في مجلد images كمان mom.jpg و dad.jpg: ضيفهم هون إذا بدك
];
const MEMO_BY_ROUND=[2,3,3,4,5]; // ثواني الحفظ حسب الجولة (الجولة 1 = ثانيتين ... الجولة 5+ = 5)
const MAX_MISTAKES=3;
const memoSecs=()=>MEMO_BY_ROUND[Math.min(round-1,MEMO_BY_ROUND.length-1)];
const COUNTS=[3,4,5,6,7]; // عدد الفئات بكل جولة (الجولة 1 = 3 ... الجولة 5+ = 7)
const $=id=>document.getElementById(id);
const CAT=k=>CATS.find(c=>c.k===k);

/* ================= الأصوات ================= */
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
function playCorrect(){tone(880,0,0.14,'sine',0.2);tone(1318.5,0.1,0.28,'triangle',0.18)}
function playWrong(){tone(180,0,0.18,'square',0.1);tone(140,0.12,0.3,'square',0.1)}
// صوت الشخصية (نطق إنجليزي من المتصفح)
function speak(text){
  if(!('speechSynthesis' in window))return;
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US';u.rate=1;u.pitch=1.15;u.volume=1;
    const v=speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang));if(v)u.voice=v;
    speechSynthesis.speak(u);
  }catch(err){}
}
const GOOD=['Great!','Bravo!'];
const BAD=['Ohhh, wrong! Try again.','Oh no, wrong! Try again.'];
const pickOne=a=>a[Math.floor(Math.random()*a.length)];
if('speechSynthesis' in window)speechSynthesis.getVoices();
function playWin(){
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,i*0.12,0.3,'triangle',0.22));
  tone(1318.5,0.5,0.5,'sine',0.18);tone(1568,0.6,0.6,'sine',0.12);
}
function playLose(){
  [392,349.23,311.13].forEach((f,i)=>tone(f,i*0.3,0.35,'sawtooth',0.12));
  tone(196,0.9,0.9,'sawtooth',0.14);
}

/* ================= الكيكة ثلاثية الأبعاد (three.js) ================= */
let scene,camera,renderer,cakeGroup,tierGroups=[],decoSprite=null,decoBase=null;
let spin=0,dragging=false,failT=0,failTarget=0,popT=0,confetti=[],focusY=2,focusTarget=2,distCur=11,distTarget=11,cakeTop=3,glOK=true;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clock=()=>performance.now()/1000;
let lastT=0;

function rng32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const solid=(hex,rough=.6,metal=0)=>new THREE.MeshStandardMaterial({color:new THREE.Color(hex),roughness:rough,metalness:metal});
const ghost=()=>new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.2,roughness:1,depthWrite:false});

function initScene(){
 const holder=$('stage');
 if(renderer||!glOK)return;
 try{
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 }catch(err){
  glOK=false;holder.innerHTML='<p class="nogl">المتصفح ما بيدعم العرض ثلاثي الأبعاد.</p>';return;
 }
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 holder.appendChild(renderer.domElement);
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(35,1,0.1,100);
 scene.add(new THREE.HemisphereLight(0xfff2dd,0x2a1f66,0.95));
 const sun=new THREE.DirectionalLight(0xffffff,0.85);sun.position.set(5,9,7);scene.add(sun);
 const gold=new THREE.PointLight(0xf6c935,0.7,30);gold.position.set(-6,4,5);scene.add(gold);
 cakeGroup=new THREE.Group();scene.add(cakeGroup);
 const dom=renderer.domElement;let lastX=0;
 dom.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;dom.setPointerCapture(e.pointerId)});
 dom.addEventListener('pointermove',e=>{if(!dragging)return;spin+=(e.clientX-lastX)*0.012;lastX=e.clientX});
 ['pointerup','pointercancel'].forEach(ev=>dom.addEventListener(ev,()=>dragging=false));
 new ResizeObserver(resize).observe(holder);resize();
 lastT=clock();requestAnimationFrame(tick);
}
function resize(){
 if(!renderer)return;
 const h=$('stage'),w=h.clientWidth,ht=h.clientHeight;if(!w||!ht)return;
 renderer.setSize(w,ht,false);camera.aspect=w/ht;camera.updateProjectionMatrix();
}
function clearCake(){
 for(let i=cakeGroup.children.length-1;i>=0;i--){
  const o=cakeGroup.children[i];cakeGroup.remove(o);
  o.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material){if(n.material.map)n.material.map.dispose();n.material.dispose()}});
 }
 tierGroups=[];decoSprite=null;
}
function cyl(r,h,y,mat,seg=56){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),mat);m.position.y=y;return m}
function emojiTex(e){
 const c=document.createElement('canvas');c.width=c.height=160;const x=c.getContext('2d');
 x.font='116px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,80,90);
 return new THREE.CanvasTexture(c);
}
function activeKeys(){return new Set(cats().map(c=>c.k))}

function buildCake(s){
 if(!renderer)return;
 clearCake();
 const active=activeKeys(),g=cakeGroup,rand=rng32(77);
 const val=k=>s[k]!=null?CAT(k).opts[s[k]]:null;
 const n=s.tiers!=null?s.tiers+1:1;
 const fl=val('flavor'),cr=val('cream'),fi=val('filling'),dr=val('drizzle'),de=val('deco'),sp=val('sprinkles');
 const mFlavor=fl?solid(fl.c,.85):ghost();
 const mFill=fi?solid(fi.c,.35):(active.has('filling')?ghost():solid('#f3e6c8',.4));
 const mCream=cr?solid(cr.c,.4):ghost();
 const mDrip=dr?solid(dr.c,.12):null;
 const mGold=solid('#e8b93a',.25,.85);
 // حامل الكيك الذهبي
 g.add(cyl(1.3,.12,.06,mGold));
 g.add(cyl(.28,.5,.37,mGold,24));
 g.add(cyl(3.15,.13,.66-.065,mGold,72));
 const rim=new THREE.Mesh(new THREE.TorusGeometry(3.15,.05,10,72),mGold);rim.rotation.x=Math.PI/2;rim.position.y=.6;g.add(rim);
 let y=.66;
 for(let t=0;t<n;t++){
  const r=2.35*Math.pow(.78,t),top=(t===n-1);
  const tg=new THREE.Group();tg.position.y=y;tg.userData={t};
  tg.add(cyl(r,.3,.15,mFlavor));
  tg.add(cyl(r+.04,.13,.365,mFill));
  tg.add(cyl(r,.3,.58,mFlavor));
  tg.add(cyl(r+.06,.07,.765,mCream));
  const rope=new THREE.Mesh(new THREE.TorusGeometry(r+.06,.06,12,64),mCream);rope.rotation.x=Math.PI/2;rope.position.y=.8;tg.add(rope);
  const rope2=new THREE.Mesh(new THREE.TorusGeometry(r+.03,.05,12,64),mCream);rope2.rotation.x=Math.PI/2;rope2.position.y=.03;tg.add(rope2);
  // نقاط كريمة على الحافة
  const nd=Math.round(r*7);
  for(let i=0;i<nd;i++){
   const a=i/nd*Math.PI*2,d=new THREE.Mesh(new THREE.SphereGeometry(.1,14,10),mCream);
   d.position.set(Math.cos(a)*(r+.02),.86,Math.sin(a)*(r+.02));d.scale.y=.85;tg.add(d);
  }
  // صوص يسيل
  if(mDrip){
   const nc=Math.round(r*5.5);
   for(let i=0;i<nc;i++){
    const a=(i+rand()*.5)/nc*Math.PI*2,L=.2+rand()*.45,rr=r+.075;
    const dc=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,L,10),mDrip);
    dc.position.set(Math.cos(a)*rr,.82-L/2,Math.sin(a)*rr);tg.add(dc);
    const ds=new THREE.Mesh(new THREE.SphereGeometry(.07,12,10),mDrip);
    ds.position.set(Math.cos(a)*rr,.82-L,Math.sin(a)*rr);tg.add(ds);
   }
   if(top){
    [.55,.3].forEach(k=>{const rg=new THREE.Mesh(new THREE.TorusGeometry(r*k,.035,8,48),mDrip);rg.rotation.x=Math.PI/2;rg.position.y=.83;tg.add(rg)});
   }
  }
  // رشّات
  if(sp){
   const mats=sp.cols.map(c=>solid(c,sp.kind==='flakes'?.2:.5,sp.kind==='flakes'?.8:0));
   const cnt=top?46:28,inner=top?0:r*.78+.12,outer=r*.9;
   for(let i=0;i<cnt;i++){
    const a=rand()*Math.PI*2,rad=Math.sqrt(inner*inner+rand()*(outer*outer-inner*inner));
    let m;const mt=mats[Math.floor(rand()*mats.length)];
    if(sp.kind==='rods'){m=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.15,6),mt);m.rotation.order='YXZ';m.rotation.set(Math.PI/2,rand()*Math.PI,0);m.position.set(Math.cos(a)*rad,.84,Math.sin(a)*rad)}
    else if(sp.kind==='pearls'){m=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),mt);m.position.set(Math.cos(a)*rad,.85,Math.sin(a)*rad)}
    else{m=new THREE.Mesh(new THREE.BoxGeometry(.11,.015,.07),mt);m.rotation.y=rand()*Math.PI;m.position.set(Math.cos(a)*rad,.835,Math.sin(a)*rad)}
    tg.add(m);
   }
  }
  g.add(tg);tierGroups.push(tg);y+=.8;
 }
 cakeTop=y;
 if(de){
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:emojiTex(de.e),transparent:true}));
  sprite.scale.set(1.5,1.5,1);sprite.position.set(0,y+.6,0);
  g.add(sprite);decoSprite=sprite;decoBase=sprite.position.clone();
 }
 const H=y+(de?1.4:.4);
 focusTarget=H*.45+.3;
 distTarget=9.5+H*.85;
}
function showCake(s,o={}){
 if(!renderer)return;
 buildCake(s);
 $('stage').classList.toggle('fail',!!o.fail);
 failTarget=o.fail?1:0;if(!o.fail)failT=0;
 if(o.win){popT=1;burst()}
}
const confGeo=()=>confGeoCache||(confGeoCache=new THREE.PlaneGeometry(.14,.22));let confGeoCache;
function burst(){
 const cols=[0xf6c935,0xff5f7a,0x6fdc8c,0x8fc4ff,0xffffff,0xb79be0];
 for(let i=0;i<80;i++){
  const m=new THREE.Mesh(confGeo(),new THREE.MeshBasicMaterial({color:cols[i%cols.length],side:THREE.DoubleSide}));
  m.position.set((Math.random()-.5)*5,focusTarget+3.5,(Math.random()-.5)*3);
  m.userData={v:new THREE.Vector3((Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)),r:(Math.random()-.5)*8};
  scene.add(m);confetti.push(m);
 }
}
function tick(){
 requestAnimationFrame(tick);
 const now=clock(),dt=Math.min(now-lastT,.05);lastT=now;
 if(!dragging&&!reduced)spin+=dt*.45;
 cakeGroup.rotation.y=spin;
 failT+=(failTarget-failT)*Math.min(1,dt*3);
 tierGroups.forEach((tg,i)=>{
  const s=i%2?1:-1;
  tg.rotation.z=s*.2*i*failT;tg.position.x=-s*.35*i*failT;
 });
 cakeGroup.rotation.z=-.05*failT;
 if(decoSprite){
  decoSprite.position.set(decoBase.x+failT*1.1,decoBase.y-failT*cakeTop*.3+Math.sin(now*2)*.05*(1-failT),decoBase.z);
 }
 popT=Math.max(0,popT-dt*1.4);cakeGroup.scale.setScalar(1+Math.sin(popT*Math.PI)*.08);
 focusY+=(focusTarget-focusY)*Math.min(1,dt*3);
 distCur+=(distTarget-distCur)*Math.min(1,dt*3);
 const asp=camera.aspect||1,dist=distCur*Math.max(1,1.15/asp);
 camera.position.set(0,focusY+dist*.3,dist);camera.lookAt(0,focusY,0);
 for(let i=confetti.length-1;i>=0;i--){
  const m=confetti[i],u=m.userData;u.v.y-=6*dt;m.position.addScaledVector(u.v,dt);m.rotation.x+=u.r*dt;m.rotation.z+=u.r*dt*.6;
  if(m.position.y<-4){scene.remove(m);m.material.dispose();confetti.splice(i,1)}
 }
 renderer.render(scene,camera);
}

/* ================= اللعبة ================= */
let score=0,round=1,lives=3,recipe={},pick={},timer=null,streak=0,mistakes=0,locked=false;
let player={name:'',char:null};

const st=$('stars');
for(let i=0;i<22;i++){const s=document.createElement('i');s.textContent='★';
 s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
 s.style.fontSize=(10+Math.random()*26)+'px';s.style.animationDelay=(Math.random()*4)+'s';st.appendChild(s)}

function submitName(){
 const v=$('name').value.trim();
 if(!v){$('nameErr').classList.remove('hide');$('name').focus();return}
 getAudio();player.name=v;
 $('nameErr').classList.add('hide');
 $('intro').classList.add('hide');
 $('charTitle').textContent=`${v}، اختار شخصيتك`;
 $('pickChar').classList.remove('hide');
}
$('start').onclick=submitName;
$('name').addEventListener('keydown',e=>{if(e.key==='Enter')submitName()});

$('chars').innerHTML=CHARS.map(c=>`<button class="char" role="radio" aria-checked="false" data-id="${c.id}"><img src="${c.img}" alt=""><span>${c.name}</span></button>`).join('');
$('chars').addEventListener('click',e=>{
 const b=e.target.closest('.char');if(!b)return;
 player.char=CHARS.find(c=>c.id===b.dataset.id);
 document.querySelectorAll('.char').forEach(x=>x.setAttribute('aria-checked',x===b));
 $('choose').disabled=false;tone(660,0,0.12,'triangle',0.15);
});
$('choose').onclick=()=>{
 $('pickChar').classList.add('hide');
 $('gameWrap').classList.remove('hide');
 $('avatar').src=player.char.img;$('sayImg').src=player.char.img;
 $('whoName').textContent=player.name;
 initScene();newRound();
};

function cats(){return CATS.slice(0,COUNTS[Math.min(round-1,COUNTS.length-1)])}
function swatch(cat,i){const o=cat.opts[i];return `<div class="sw" style="background:${o.c||'#fff'}">${o.e||''}</div>`}
function setFeedback(t,cls=''){const f=$('feedback');f.textContent=t;f.className='hint '+cls}
function leftTxt(l){return l<=0?'هاي آخر محاولة':l===1?'باقي محاولة وحدة':l===2?'باقي محاولتين':`باقي ${l} محاولات`}

function newRound(){
 recipe={};pick={};mistakes=0;locked=false;
 cats().forEach(c=>recipe[c.k]=Math.floor(Math.random()*c.opts.length));
 $('result').classList.add('hide');$('build').classList.add('hide');
 $('recipe').classList.remove('hide');$('barWrap').classList.remove('hide');$('tip').classList.remove('hide');
 $('phase').textContent=`احفظ الوصفة يا ${player.name}`;
 $('recipe').innerHTML=cats().map(c=>`<div class="card">${swatch(c,recipe[c.k])}<small>${c.label}</small><b>${c.opts[recipe[c.k]].n}</b></div>`).join('');
 showCake(recipe);
 const bar=$('bar');
 bar.style.transition='none';bar.style.transform='scaleX(1)';
 void bar.offsetWidth;bar.style.transition=`transform ${memoSecs()}s linear`;bar.style.transform='scaleX(0)';
 clearTimeout(timer);timer=setTimeout(startBuild,memoSecs()*1000);
 updateHud();
}
function startBuild(){
 $('phase').textContent='هلأ اعمل الكيكة من ذاكرتك';
 $('barWrap').classList.add('hide');$('tip').classList.add('hide');
 $('recipe').classList.add('hide');
 pick={};showCake(pick);
 $('rows').innerHTML=cats().map(c=>`<div class="row"><b>${c.label}</b><div class="opts">${c.opts.map((o,i)=>`<button class="opt" data-k="${c.k}" data-i="${i}">${o.c?`<span class="d" style="background:${o.c}"></span>`:o.e} ${o.n}</button>`).join('')}</div></div>`).join('');
 setFeedback(`اختار اللي حافظه. بتقدر تغلط ${MAX_MISTAKES} مرات بس.`);
 $('build').classList.remove('hide');
}

$('rows').addEventListener('click',e=>{
 const b=e.target.closest('.opt');if(!b||b.disabled||locked)return;
 const k=b.dataset.k,i=+b.dataset.i;
 if(recipe[k]===i){
  playCorrect();speak(pickOne(GOOD));pick[k]=i;
  document.querySelectorAll(`.opt[data-k="${k}"]`).forEach(x=>x.disabled=true);
  b.classList.add('right');showCake(pick);
  const done=cats().every(c=>pick[c.k]!=null);
  setFeedback(done?'كل المكوّنات صح!':`صح! ${CAT(k).opts[i].n}`,'good');
  if(done)finishRound(true);
 }else{
  playWrong();speak(pickOne(BAD));mistakes++;
  b.disabled=true;b.classList.add('wrong','shake');
  const left=MAX_MISTAKES-mistakes;
  if(left<0){setFeedback('غلطات كتير!','bad');finishRound(false)}
  else setFeedback(`مو هاد. ${leftTxt(left)}.`,'bad');
 }
});

function finishRound(all){
 locked=true;
 setTimeout(()=>{
  all?playWin():playLose();
  $('build').classList.add('hide');
  showCake(recipe,{win:all,fail:!all});
  $('phase').textContent=all?'كيكة مثالية!':'الكيكة انهارت…';
  if(all){
   streak++;
   const pts=Math.max(40,100+streak*25+cats().length*10-mistakes*30);
   score+=pts;
   $('resTxt').textContent=`+${pts} نقطة. ${mistakes?`غلطات: ${mistakes}. `:'بدون أي غلطة. '}السلسلة: ${streak}`;
  }else{
   streak=0;lives--;
   $('resTxt').textContent=`الكيكة وقعت بالعتمة يا ${player.name}.`;
  }
  $('cmp').innerHTML=cats().map(c=>`<div class="${pick[c.k]===recipe[c.k]?'ok':'no'}"><b>${c.label}:</b> ${c.opts[recipe[c.k]].n}</div>`).join('');
  $('next').textContent=lives<=0?'العب من جديد':'جولة جديدة';
  $('result').classList.remove('hide');
  if(all)round++;
  updateHud();
 },all?500:700);
}
$('next').onclick=()=>{
 if(lives<=0){score=0;round=1;lives=3;streak=0}
 newRound();
};
function updateHud(){
 $('sc').textContent='النقاط '+score;$('rd').textContent='الجولة '+round;
 $('lv').textContent='الأرواح '+'♥'.repeat(Math.max(lives,0))+'♡'.repeat(3-Math.max(lives,0));
}