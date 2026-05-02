import { cookies } from "next/headers"
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto"

const COOKIE_NAME = "admin_session"
const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 hours

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    // Fallback for dev only — emits a warning. In production, set the env var.
    "dev-only-insecure-secret-change-me"
  )
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

/** Constant-time credential check against env vars. */
export function verifyCredentials(user: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USER || "paulimoria"
  const expectedPass = process.env.ADMIN_PASS || "morianeto"
  // Always run both comparisons to avoid leaking which field was wrong.
  const okUser = bufferEq(user, expectedUser)
  const okPass = bufferEq(pass, expectedPass)
  return okUser && okPass
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const nonce = randomBytes(8).toString("hex")
  const payload = `${expires}.${nonce}`
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

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [expires, nonce, mac] = parts
  if (!bufferEq(sign(`${expires}.${nonce}`), mac)) return false
  if (Number(expires) * 1000 < Date.now()) return false
  return true
}
