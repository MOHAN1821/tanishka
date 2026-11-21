document.querySelectorAll('.her').forEach(e=>e.textContent=C.her);
document.querySelectorAll('.him').forEach(e=>e.textContent=C.him);
document.title=C.her+", oka chinna vishayam 💌";
let curV='home',typing,fireT,seen={},built={};
const ROOMS={};
function show(id){
 if(!document.getElementById(id))id='home';
 micStop();clearInterval(typing);clearInterval(fireT);gRun=false;curV=id;
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id===id));
 $('#home-btn').classList.toggle('hide',id==='home'||id==='thanks');
 const m=document.getElementById(id);m.scrollTop=0;
 if(/^r\d/.test(id)){seen[id]=1;document.querySelectorAll('.menu').forEach(a=>a.classList.toggle('seen',!!seen[a.getAttribute('href').slice(1)]))}
 if(ROOMS[id])ROOMS[id]();
}
addEventListener('hashchange',()=>show(location.hash.slice(1)||'home'));
function fire(n){let k=0;clearInterval(fireT);fireT=setInterval(()=>{firework();if(++k>=n)clearInterval(fireT)},600)}

/* r1 sorry bubbles */
let bpop=0;
function popB(b){if(!b.isConnected)return;const r=b.getBoundingClientRect();
 spark(r.left+r.width/2,r.top+r.height/2,18,{s:4,g:.03});snd(500+Math.random()*300,.09);navigator.vibrate&&navigator.vibrate(12);
 b.remove();bpop++;
 $('#bcap').textContent=$('#field').children.length?C.reasons[(bpop-1)%C.reasons.length]:'Anni sorries egiripoyayi. Ippudu manasu halka 🥹';
 if(!$('#field').children.length)rain(24)}
ROOMS.r1=()=>{
 if(built.r1)return;built.r1=1;const f=$('#field');
 C.bubbles.forEach((t,i)=>{const b=document.createElement('button'),s=70+Math.random()*14;
  b.className='bub';b.textContent=t;
  b.style.cssText=`width:${s}px;height:${s}px;left:${(i%3)*33+Math.random()*4}%;top:${(i/3|0)*24+Math.random()*2}%;--t:${3.5+Math.random()*3}s;--dx:${(Math.random()-.5)*20}px`;
  b.addEventListener('click',()=>popB(b));f.appendChild(b)});
 let last=0;
 $('#blow1').addEventListener('click',async()=>{const y=await micStart(()=>{if(Date.now()-last>120){last=Date.now();const l=$('#field').children;if(l.length)popB(l[0])}});
  $('#blow1').textContent=y?'🌬️ Ippudu oodu…':'Mic raledu, tap chesi pagalagottu 🫧'});
};

/* r2 birthday */
ROOMS.r2=()=>{
 fire(5);rain(18);
 if(built.r2)return;built.r2=1;let wi=0,out=0;
 $('#wnext').addEventListener('click',()=>{$('#wish').textContent=C.wishes[wi%C.wishes.length];wi++;spark(W/2,H/2,16,{e:['💗','✨'],s:4,up:2,r:5});snd(600,.1)});
 const cs=[];
 function blowC(c){if(c.classList.contains('out'))return;c.classList.add('out');out++;snd(260,.12);
  $('#cmsg').textContent=out<5?out+' / 5 aarpavu':'Wish chesukunnava? Adi nijam avutundi 🌟';
  if(out===5){rain(30);fire(5)}}
 for(let i=0;i<5;i++){const c=document.createElement('button');c.className='candle';c.setAttribute('aria-label','Candle '+(i+1));c.addEventListener('click',()=>blowC(c));$('#cand').appendChild(c);cs.push(c)}
 let last=0;$('#blow2').addEventListener('click',async()=>{const y=await micStart(()=>{if(Date.now()-last>260){last=Date.now();const c=cs.find(x=>!x.classList.contains('out'));if(c)blowC(c)}});
  $('#blow2').textContent=y?'🌬️ Ippudu oodu…':'Mic raledu, candles tap chey 🕯️'});
};

/* r3 wrong behaviour letter */
ROOMS.r3=()=>{
 if(!built.r3){built.r3=1;C.change.forEach(t=>{const li=document.createElement('li');li.innerHTML='<b style="color:#fff;background:var(--rose)">✓</b><span>'+t+'</span>';$('#chglist').appendChild(li)})}
 const el=$('#letter');el.textContent='';$('#chg').classList.add('hide');let i=0;
 typing=setInterval(()=>{el.textContent+=C.letter3[i++]||'';if(i>=C.letter3.length){clearInterval(typing);$('#chg').classList.remove('hide');spark(W/2,H/2,20,{e:['💗'],s:4,up:2,r:5})}},38);
};

/* r4 catch game */
const gc=$('#gc'),g=gc.getContext('2d');let items=[],gScore=0,gRun=false,gw,gh,px,gLast,gSp;
gc.addEventListener('pointermove',e=>{px=e.clientX-gc.getBoundingClientRect().left});
gc.addEventListener('pointerdown',e=>{px=e.clientX-gc.getBoundingClientRect().left});
function gameStart(){gc.width=gw=gc.clientWidth;gc.height=gh=gc.clientHeight;px=gw/2;items=[];gScore=0;gSp=0;gRun=true;gLast=performance.now();
 $('#gs').textContent='0 / 12';$('#gagain').classList.add('hide');requestAnimationFrame(gl)}
ROOMS.r4=gameStart;
$('#gagain').addEventListener('click',gameStart);
function gl(t){if(!gRun||curV!=='r4')return;const dt=Math.min(t-gLast,40);gLast=t;gSp+=dt;
 if(gSp>650){gSp=0;items.push({x:24+Math.random()*(gw-48),y:-20,good:Math.random()>.28,v:2.2+gScore*.1})}
 g.clearRect(0,0,gw,gh);g.textAlign='center';g.font='34px serif';
 for(const it of items){it.y+=it.v*dt/16;g.fillText(it.good?'💗':'⛈️',it.x,it.y);
  if(it.y>gh-56&&it.y<gh-6&&Math.abs(it.x-px)<46){it.dead=true;const r=gc.getBoundingClientRect();
   if(it.good){gScore++;spark(r.left+it.x,r.top+it.y,8,{c:'#ff6f91',s:3,g:.02});snd(600,.08)}else{gScore=Math.max(0,gScore-1);snd(160,.15)}
   $('#gs').textContent=gScore+' / 12'}
  if(it.y>gh+30)it.dead=true}
 items=items.filter(i=>!i.dead);g.font='50px serif';g.fillText('🧺',px,gh-12);
 if(gScore>=12){gRun=false;rain(30);fire(4);$('#gs').textContent='Nuvvu naa sorries anni pattukunnav 🥹';$('#gagain').classList.remove('hide');return}
 requestAnimationFrame(gl)}

/* r5 meter + promises */
ROOMS.r5=()=>{
 if(built.r5)return;built.r5=1;const sl=$('#slider');
 sl.addEventListener('input',()=>{const v=+sl.value;$('#mval').textContent=v+'%';
  $('#mmsg').textContent=v>70?'Entha kopam undo naku telusu… 🥲':v>40?'Konchem taggindi 🥺':v>10?'Inka koncham, please 🤞':'Thank you, ra… ♥';
  if(v<=5){rain(20)}});
 const pl=$('#prom');C.promises.forEach(t=>{const li=document.createElement('li');li.innerHTML='<b>✓</b><span>'+t+'</span>';
  li.addEventListener('click',()=>{li.classList.toggle('on');if(li.classList.contains('on')){const r=li.getBoundingClientRect();spark(r.left+30,r.top+20,8,{e:['💗'],s:3,up:2,r:5})}
   if(pl.querySelectorAll('.on').length===C.promises.length)rain(24)});pl.appendChild(li)});
};

/* r6 scratch + memories */
ROOMS.r6=()=>{
 if(built.r6)return;built.r6=1;
 const sc=$('#sc'),sx=sc.getContext('2d'),w=sc.width=sc.parentElement.clientWidth,h=sc.height=sc.parentElement.clientHeight;
 const gr=sx.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#c9b6ff');gr.addColorStop(.5,'#ffd58a');gr.addColorStop(1,'#ff9ec0');sx.fillStyle=gr;sx.fillRect(0,0,w,h);
 sx.fillStyle='#2b0f2e';sx.font='700 24px sans-serif';sx.textAlign='center';sx.fillText('Scratch chey ✨',w/2,h/2+8);
 let down=false,lx,ly,n=0,done=false;const pt=e=>{const r=sc.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
 sc.addEventListener('pointerdown',e=>{down=true;[lx,ly]=pt(e);sc.setPointerCapture(e.pointerId)});
 sc.addEventListener('pointerup',()=>down=false);sc.addEventListener('pointercancel',()=>down=false);
 sc.addEventListener('pointermove',e=>{if(!down||done)return;const[x,y]=pt(e);sx.globalCompositeOperation='destination-out';sx.lineWidth=40;sx.lineCap='round';
  sx.beginPath();sx.moveTo(lx,ly);sx.lineTo(x,y);sx.stroke();lx=x;ly=y;
  if(++n%10===0){const d=sx.getImageData(0,0,w,h).data;let c=0,t=0;for(let i=3;i<d.length;i+=96){t++;if(!d[i])c++}
   if(c/t>.5){done=true;sx.clearRect(0,0,w,h);rain(24);snd(700,.3)}}});
 const box=$('#mem');C.memories.forEach(([e,t,d])=>{const b=document.createElement('button');b.className='card';b.innerHTML='<span class="big">'+e+'</span>'+t;
  b.addEventListener('click',()=>{if(b.classList.contains('open'))return;b.classList.add('open');b.innerHTML='<span class="big">'+e+'</span><b>'+t+'</b><small>'+d+'</small>';
   const r=b.getBoundingClientRect();spark(r.left+r.width/2,r.top+30,8,{e:['💗','✨'],s:3,up:2,r:5})});box.appendChild(b)});
};

/* r7 talk + final question */
ROOMS.r7=()=>{
 if(built.r7)return;built.r7=1;
 C.talk.forEach(([e,t,reply,wat])=>{const b=document.createElement('button');b.className='card';b.innerHTML='<span class="big">'+e+'</span>'+t;
  b.addEventListener('click',()=>{let h='<div class="reply">'+reply;
   if(C.wa)h+='<br><a class="btn" target="_blank" rel="noopener" href="https://wa.me/'+C.wa+'?text='+encodeURIComponent(wat)+'">💬 Naaku cheppu</a>';
   $('#treply').innerHTML=h+'</div>';spark(W/2,H/2,14,{e:['💗'],s:4,up:2,r:5});$('#treply').scrollIntoView({behavior:'smooth',block:'center'})});$('#talk').appendChild(b)});
 let tries=0;const no=$('#no'),yes=$('#yes'),msgs=['No','Nijanga?','Alochinchu 🥺','Please…','Ika last chance','Yes nokku ra 😭'];
 function dodge(e){e.preventDefault();tries++;no.textContent=msgs[Math.min(tries,msgs.length-1)];const b=$('.yn').getBoundingClientRect();
  no.style.transform='none';no.style.left=Math.random()*(b.width-110)+'px';no.style.top=Math.random()*(b.height-50)+'px';
  yes.style.transform='translateX(-50%) scale('+Math.min(1+tries*.12,1.8)+')'}
 no.addEventListener('pointerenter',dodge);no.addEventListener('pointerdown',dodge);
 yes.addEventListener('click',()=>{spark(W/2,H/2,70,{s:7,g:.04});location.hash='thanks';setTimeout(()=>{fire(8);rain(30)},300)});
 if(C.wa){const a=$('#wa');a.classList.remove('hide');a.href='https://wa.me/'+C.wa+'?text='+encodeURIComponent('Sare, nenu forgive chesanu 🥰')}
};
show(location.hash.slice(1)||'home');

/* birthday maths from C.dob */
(function(){
 const[y,m,d]=C.dob.split('-').map(Number),now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 let bd=new Date(today.getFullYear(),m-1,d),age=today.getFullYear()-y,next=bd;
 if(bd<today){next=new Date(today.getFullYear()+1,m-1,d)}else if(bd>today){age--}
 const days=Math.round((next-today)/864e5),ord=n=>{const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};
 const dob=new Date(y,m-1,d).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
 $('#bdTitle').textContent='Happy '+ord(age)+' Birthday';
 $('#dobline').textContent=days===0?'🎉 Ee roju nee birthday! '+dob:'🎂 '+dob+' · Nee next birthday ki '+days+' rojulu. Appudu nenu nee pakkana untanu 💗';
 fetch('/api/me').then(r=>r.json()).then(u=>{if(u.name)$('#who').textContent='Hi '+u.name+' ·'}).catch(()=>{});
})();
