import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/store';
import { randomUUID } from 'node:crypto';
export async function POST(req: Request){
 const fd=await req.formData();
 const name=String(fd.get('name')||''); const email=String(fd.get('email')||''); const phone=String(fd.get('phone')||'');
 const adults=Number(fd.get('adults')||0); const children=Number(fd.get('children')||0);
 if(!name||!email||!phone||![1,2].includes(adults)||![0,1,2,3].includes(children)) return NextResponse.json({ok:false},{status:400});
 const db=await readDb(); db.registrations.push({id:randomUUID(),name,email,phone,adults,children,status:'PENDENTE',createdAt:new Date().toISOString()}); await writeDb(db);
 return NextResponse.redirect(new URL('/', req.url));
}
