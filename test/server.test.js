import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.env.NODE_ENV='test';
process.env.DB_PATH = join(mkdtempSync(join(tmpdir(),'casamento-')),'db.json');
const { server } = await import('../src/server.js');

function req(path, options={}){return fetch(`http://127.0.0.1:${addr.port}${path}`,options);} 
const addr=await new Promise(r=>server.listen(0,()=>r(server.address())));

const auth='Basic '+Buffer.from('paulimoria:morianeto').toString('base64');

test('register and approve flow', async()=>{
  let r=await req('/api/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Ana',email:'a@a.com',phone:'911',adults:2,children:1})});
  assert.equal(r.status,201);
  r=await req('/admin',{headers:{authorization:auth}});
  const html=await r.text();
  assert.match(html,/Ana/);
  const id=html.match(/approve\('([^']+)'\)/)[1];
  r=await req('/api/admin/approve/'+id,{method:'POST',headers:{authorization:auth}});
  const j=await r.json();
  assert.match(j.whatsappUrl,/wa\.me/);
});

test.after(()=>server.close());
