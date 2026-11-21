const $=s=>document.querySelector(s),pick=a=>a[Math.random()*a.length|0];
const cv=document.createElement('canvas');cv.id='fx';document.body.appendChild(cv);
const cx=cv.getContext('2d'),COL=['#ff6f91','#ffd58a','#c9b6ff','#ffffff','#ff9ec0'];let P=[],W,H,run=false;
function rs(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',rs);rs();
function tick(){
 cx.clearRect(0,0,W,H);P=P.filter(p=>p.l>0&&p.y<H+40);
 for(const p of P){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l-=p.d;cx.globalAlpha=Math.max(p.l,0);
  if(p.e){cx.font=p.r*3+'px serif';cx.textAlign='center';cx.fillText(p.e,p.x,p.y)}
  else{cx.fillStyle=p.c;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}}
 cx.globalAlpha=1;
 if(P.length)requestAnimationFrame(tick);else run=false;
}
function kick(){if(!run){run=true;requestAnimationFrame(tick)}}
function spark(x,y,n=10,o={}){
 for(let i=0;i<n&&P.length<150;i++){const a=Math.random()*6.283,s=(o.s||3)*(.3+Math.random());
  P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(o.up||0),l:1,d:o.d||.016+Math.random()*.02,c:o.c||pick(COL),r:o.r||2+Math.random()*2.5,g:o.g??.06,e:o.e&&pick(o.e)})}
 kick()}
function rain(n=20){for(let i=0;i<n&&P.length<150;i++)P.push({x:Math.random()*W,y:-20-Math.random()*H*.4,vx:(Math.random()-.5),vy:1.5+Math.random()*2,l:1,d:.004,r:6+Math.random()*4,g:0,e:pick(['💗','✨','🌸','🎉','💖','⭐'])});kick()}
function firework(){spark(W*(.12+.76*Math.random()),H*(.15+.35*Math.random()),40,{s:5,c:pick(COL),g:.05,r:2.2})}
addEventListener('pointerdown',e=>spark(e.clientX,e.clientY,5,{e:['💗','✨'],s:3,up:1.5,r:5,g:.05}));
let AC;function snd(f,d=.1){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.8,t+d);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(t+d)}catch(e){}}
let mic;
async function micStart(onBlow){micStop();
 try{const s=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
  const ac=new(window.AudioContext||window.webkitAudioContext)(),an=ac.createAnalyser();an.fftSize=512;ac.createMediaStreamSource(s).connect(an);
  const buf=new Uint8Array(an.fftSize);let on=true;
  (function l(){if(!on)return;an.getByteTimeDomainData(buf);let m=0;for(const v of buf){const d=(v-128)/128;m+=d*d}
   if(Math.sqrt(m/buf.length)>.14)onBlow();requestAnimationFrame(l)})();
  mic={stop(){on=false;s.getTracks().forEach(t=>t.stop());ac.close()}};return true}catch(e){return false}}
function micStop(){if(mic){mic.stop();mic=null}}
