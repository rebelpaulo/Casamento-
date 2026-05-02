import { NextResponse } from "next/server"
import { getApprovedRegistrationByEmail } from "@/lib/wedding"
import { createGuestSession } from "@/lib/guest-auth"
import { rateLimit } from "@/lib/rate-limit"

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  const rl = rateLimit(`guest-login:${ip}`, { limit: 10, windowMs: 60_000 })
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas tentativas. Tenta novamente em alguns minutos." },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Pedido inválido." }, { status: 400 })
  }

  const email =
    typeof (body as { email?: unknown })?.email === "string"
      ? ((body as { email: string }).email).trim().toLowerCase()
      : ""

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: "Email inválido." }, { status: 400 })
  }

  const reg = await getApprovedRegistrationByEmail(email)
  if (!reg) {
    // Generic message — don't reveal whether the email exists or status.
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não encontrámos um convite aprovado para este email. Confirma com os noivos ou faz o RSVP primeiro.",
      },
      { status: 404 },
    )
  }

  await createGuestSession(reg.email)
  return NextResponse.json({ ok: true, redirect: "/info" })
}
