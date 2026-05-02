import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import { readDb, writeDb, getDefaultSettings } from './store.js';

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', c => data += c);
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
    });
  });
}

function send(res, status, body, type='application/json'){res.writeHead(status, {'content-type': type});res.end(type==='application/json'?JSON.stringify(body):body);}
function unauthorized(res){res.writeHead(401, {'WWW-Authenticate':'Basic realm="Admin"'});res.end('Auth required');}
function isAdmin(req){
  const auth=req.headers.authorization||'';
  if(!auth.startsWith('Basic ')) return false;
  const [u,p]=Buffer.from(auth.slice(6),'base64').toString().split(':');
  return u===config.adminUser && p===config.adminPass;
}
function waUrl(message){return `https://wa.me/${config.whatsappNumber.replace(/\D/g,'')}?text=${encodeURIComponent(message)}`;}

function landingHtml(db){
  const s=db.settings;
  return `<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Casamento</title><link rel='stylesheet' href='/style.css'></head><body>
  <main><h1>${s.welcomeTitle}</h1><h2>${s.coupleNames}</h2>
  <section><h3>Foste convidado? Regista-te</h3>
  <form id='rsvp'><input name='name' placeholder='Nome' required><input name='email' type='email' placeholder='Email' required><input name='phone' placeholder='Telefone' required>
  <label>Adultos</label><select name='adults'><option>1</option><option>2</option></select>
  <label>Crianças</label><select name='children'><option>0</option><option>1</option><option>2</option><option>3</option></select>
  <button>Enviar pedido</button></form><p id='msg'></p></section>
  <section><h3>Informações</h3><p>${s.venueName}<br>${s.venueAddress}</p><a href='${s.mapUrl}'>Mapa</a><p>${s.dressCode}</p></section>
  </main><script>
  document.getElementById('rsvp').addEventListener('submit', async (e)=>{e.preventDefault();const f=e.target;const payload=Object.fromEntries(new FormData(f));payload.adults=Number(payload.adults);payload.children=Number(payload.children);const r=await fetch('/api/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});document.getElementById('msg').textContent=r.ok?'Pedido enviado!':'Erro ao enviar';if(r.ok)f.reset();});
  </script></body></html>`;
}

function adminHtml(db){
  const rows=db.registrations.map(r=>`<tr><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${r.adults}</td><td>${r.children}</td><td>${r.status}</td><td><button onclick="approve('${r.id}')">Aprovar</button><button onclick="reject('${r.id}')">Rejeitar</button></td></tr>`).join('');
  return `<!doctype html><html><head><meta charset='utf-8'><link rel='stylesheet' href='/style.css'></head><body><h1>Admin Dashboard</h1>
  <p>Credenciais ativas protegidas por Basic Auth.</p>
  <table border='1'><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Adultos</th><th>Crianças</th><th>Estado</th><th>Ações</th></tr>${rows}</table>
  <h2>Configurações</h2><form id='settings'><textarea name='settings' rows='12' cols='90'>${JSON.stringify(db.settings,null,2)}</textarea><br><button>Guardar</button></form>
  <p id='m'></p><script>
  async function approve(id){const r=await fetch('/api/admin/approve/'+id,{method:'POST'});const j=await r.json();if(j.whatsappUrl){window.open(j.whatsappUrl,'_blank');}location.reload();}
  async function reject(id){await fetch('/api/admin/reject/'+id,{method:'POST'});location.reload();}
  document.getElementById('settings').addEventListener('submit',async(e)=>{e.preventDefault();let settings;try{settings=JSON.parse(e.target.settings.value);}catch{return alert('JSON inválido');}await fetch('/api/admin/settings',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(settings)});document.getElementById('m').textContent='Guardado';});
  </script></body></html>`;
}

export const server = http.createServer(async (req,res)=>{
  const db=readDb();
  if(req.url==='/style.css') return send(res,200,`body{font-family:system-ui;max-width:980px;margin:20px auto;padding:10px;background:#f7f2e8}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}input,select,button,textarea{display:block;margin:8px 0;padding:10px;width:100%}table{width:100%;background:#fff}`, 'text/css');
  if(req.method==='GET' && req.url==='/') return send(res,200,landingHtml(db),'text/html');
  if(req.method==='POST' && req.url==='/api/register'){
    const b=await parseBody(req);
    if(!b.name||!b.email||!b.phone||![1,2].includes(b.adults)||![0,1,2,3].includes(b.children)) return send(res,400,{error:'Dados inválidos'});
    db.registrations.push({id:randomUUID(),...b,status:'PENDENTE',createdAt:new Date().toISOString()}); writeDb(db); return send(res,201,{ok:true});
  }
  if(req.url.startsWith('/admin')){ if(!isAdmin(req)) return unauthorized(res); if(req.method==='GET'&&req.url==='/admin') return send(res,200,adminHtml(db),'text/html'); }
  if(req.url.startsWith('/api/admin')){ if(!isAdmin(req)) return unauthorized(res);
    if(req.method==='POST' && req.url.startsWith('/api/admin/approve/')){const id=req.url.split('/').pop(); const r=db.registrations.find(x=>x.id===id); if(!r) return send(res,404,{error:'not found'}); r.status='APROVADO'; writeDb(db); const msg=`Olá ${r.name}, o teu pedido foi aprovado! Entra no grupo: ${config.groupLink}`; return send(res,200,{ok:true,whatsappUrl:waUrl(msg)});}
    if(req.method==='POST' && req.url.startsWith('/api/admin/reject/')){const id=req.url.split('/').pop(); const r=db.registrations.find(x=>x.id===id); if(!r) return send(res,404,{error:'not found'}); r.status='REJEITADO'; writeDb(db); return send(res,200,{ok:true});}
    if(req.method==='PUT' && req.url==='/api/admin/settings'){const b=await parseBody(req); db.settings={...getDefaultSettings(),...b}; writeDb(db); return send(res,200,{ok:true});}
  }
  send(res,404,{error:'not found'});
});

if (process.env.NODE_ENV !== 'test') server.listen(config.port, ()=>console.log('running',config.port));
