"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function GuestLoginForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    const form = e.currentTarget
    const email = String(new FormData(form).get("email") || "").trim().toLowerCase()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/guest-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        redirect?: string
      }
      if (!res.ok || !json.ok) {
        setError(json.error || "Não foi possível entrar.")
        setSubmitting(false)
        return
      }
      router.push(json.redirect || "/info")
      router.refresh()
    } catch {
      setError("Erro de rede. Tenta novamente.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <label className="block">
        <span className="sr-only">Email</span>
        <span className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-primary/70" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 7 9-7" />
            </svg>
          </span>
          <input
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="O teu e-mail"
            className="w-full rounded-md border border-border bg-card pl-10 pr-3 py-3 text-base italic text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </span>
      </label>
      {error ? <p className="text-center text-sm italic text-accent">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-primary py-3 text-base font-medium tracking-wide text-primary-foreground italic transition hover:opacity-95 disabled:opacity-60"
      >
        {submitting ? "A entrar..." : "Entrar"}
      </button>
    </form>
  )
}
