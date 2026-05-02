import { NextResponse } from "next/server"
import { destroyGuestSession } from "@/lib/guest-auth"

export async function POST() {
  await destroyGuestSession()
  return NextResponse.json({ ok: true })
}
