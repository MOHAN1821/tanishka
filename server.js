const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,ROOT=path.join(__dirname,'public');
const SECRET=process.env.SECRET||'dev-secret-change-me';
const USERS={};
(process.env.USERS||'tanishka:30042007').split(',').slice(0,100).forEach(p=>{const i=p.indexOf(':');if(i>0)USERS[p.slice(0,i).trim().toLowerCase()]=p.slice(i+1).trim()});
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mp4':'video/mp4','.webm':'video/webm','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.mp3':'audio/mpeg','.json':'application/json'};
const sign=v=>crypto.createHmac('sha256',SECRET).update(v).digest('base64url');
const h=v=>crypto.createHash('sha256').update(String(v)).digest();
const same=(a,b)=>crypto.timingSafeEqual(h(a),h(b));
function token(name){const b=Buffer.from(JSON.stringify({n:name,e:Date.now()+30*864e5})).toString('base64url');return b+'.'+sign(b)}
function session(req){
 const m=/(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie||'');if(!m)return null;
 const[b,s]=m[1].split('.');if(!b||!s||!same(s,sign(b)))return null;
 try{const d=JSON.parse(Buffer.from(b,'base64url'));return d.e>Date.now()?d:null}catch{return null}
}
const tries=new Map();setInterval(()=>tries.clear(),10*60*1000).unref();
function limited(ip){const now=Date.now(),a=(tries.get(ip)||[]).filter(t=>now-t<6e4);a.push(now);tries.set(ip,a);return a.length>8}
const cookie=(req,v,age)=>`sid=${v}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${req.headers['x-forwarded-proto']==='https'?'; Secure':''}`;
const json=(res,code,o,extra={})=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store',...extra});res.end(JSON.stringify(o))};

http.createServer((req,res)=>{
 let p;try{p=decodeURIComponent(new URL(req.url,'http://x').pathname)}catch{res.writeHead(400);return res.end()}
 if(p==='/healthz'){res.writeHead(200);return res.end('ok')}
 if(req.method==='POST'&&p==='/api/login'){
  const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();
  if(limited(ip))return json(res,429,{ok:false});
  let body='';req.on('data',c=>{body+=c;if(body.length>1024)req.destroy()});
  req.on('end',()=>{let d={};try{d=JSON.parse(body)}catch{}
   const name=String(d.name||'').trim().toLowerCase(),pass=String(d.password||'').trim();
   if(Object.prototype.hasOwnProperty.call(USERS,name)&&same(USERS[name],pass))return json(res,200,{ok:true},{'Set-Cookie':cookie(req,token(name),2592000)});
   json(res,401,{ok:false})});return;
 }
 if(p==='/api/logout'){res.writeHead(302,{'Set-Cookie':cookie(req,'',0),Location:'/login.html'});return res.end()}
 const s=session(req);
 if(p==='/api/me')return json(res,s?200:401,{name:s?s.n:null});
 if(p!=='/login.html'&&!s){res.writeHead(302,{Location:'/login.html'});return res.end()}
 if(p==='/')p='/index.html';
 const file=path.join(ROOT,path.normalize(p));
 if(!file.startsWith(ROOT)){res.writeHead(403);return res.end()}
 fs.stat(file,(e,st)=>{
  if(e||!st.isFile()){res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Not found')}
  const type=MIME[path.extname(file).toLowerCase()]||'application/octet-stream',range=req.headers.range;
  const base={'Content-Type':type,'Cache-Control':'no-cache','Accept-Ranges':'bytes'};
  if(range&&/^bytes=\d*-\d*$/.test(range)){
   let[a,b]=range.replace('bytes=','').split('-');a=a?+a:0;b=b?+b:st.size-1;
   if(a>b||b>=st.size){res.writeHead(416,{'Content-Range':'bytes */'+st.size});return res.end()}
   res.writeHead(206,{...base,'Content-Range':`bytes ${a}-${b}/${st.size}`,'Content-Length':b-a+1});return fs.createReadStream(file,{start:a,end:b}).pipe(res)}
  res.writeHead(200,{...base,'Content-Length':st.size});fs.createReadStream(file).pipe(res)});
}).listen(PORT,()=>console.log('Listening on '+PORT+' | users: '+Object.keys(USERS).length));
