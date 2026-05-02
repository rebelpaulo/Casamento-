import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "node:crypto"

const COOKIE_NAME = "guest_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14 // 14 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-insecure-secret-change-me"
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

function bufferEq(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

export async function createGuestSession(email: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  // base64url-encode the email to make it cookie-safe
  const encEmail = Buffer.from(email).toString("base64url")
  const payload = `${expires}.${encEmail}`
  const token = `${payload}.${sign(payload)}`

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function destroyGuestSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getGuestSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [expires, encEmail, mac] = parts
  if (!bufferEq(sign(`${expires}.${encEmail}`), mac)) return null
  if (Number(expires) * 1000 < Date.now()) return null
  try {
    const email = Buffer.from(encEmail, "base64url").toString("utf-8")
    return { email }
  } catch {
    return null
  }
}
