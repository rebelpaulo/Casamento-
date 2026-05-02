import { NextResponse } from "next/server"
import { validateRegistration } from "@/lib/validation"
import { getClientIp, rateLimit } from "@/lib/rate-limit"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const ip = getClientIp(req.headers)
  const limit = rateLimit(`register:${ip}`)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta de novo em instantes." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const result = validateRegistration(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("wedding_registrations").insert({
    name: result.data.name,
    email: result.data.email,
    phone: result.data.phone,
    adults: result.data.adults,
    children: result.data.children,
  })

  if (error) {
    console.log("[v0] Insert registration failed:", error.message)
    return NextResponse.json({ error: "Não foi possível registar. Tenta novamente." }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
