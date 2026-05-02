import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const rl = rateLimit(`guest-login:${ip}`)
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: 'Demasiadas tentativas. Tenta novamente em alguns minutos.' }, { status: 429 })
  }
  return NextResponse.json({ ok: true })
}
