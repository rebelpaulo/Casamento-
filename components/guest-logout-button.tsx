"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function GuestLogoutButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await fetch("/api/guest-logout", { method: "POST" })
        router.push("/")
        router.refresh()
      }}
      className="text-xs italic text-foreground/50 underline-offset-4 hover:underline disabled:opacity-60"
    >
      {busy ? "a sair..." : "sair"}
    </button>
  )
}
