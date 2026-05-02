import { readDb } from '@/lib/store'
export const dynamic='force-dynamic'
export default async function Admin(){const db=await readDb();return <main><h1>Dashboard de aprovação</h1><table><thead><tr><th>Nome</th><th>Estado</th></tr></thead><tbody>{db.registrations.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.status}</td></tr>)}</tbody></table></main>}
