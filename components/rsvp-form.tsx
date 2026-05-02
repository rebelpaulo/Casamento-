"use client"

import { useState } from "react"
import { OliveFlourish, HeartGlyph } from "@/components/decorations"

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string }

export function RsvpForm() {
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [state, setState] = useState<State>({ kind: "idle" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state.kind === "submitting") return
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim().toLowerCase(),
      phone: String(data.get("phone") || "").trim(),
      adults,
      children,
    }

    setState({ kind: "submitting" })
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) {
        setState({ kind: "error", message: json.error || "Não foi possível enviar o pedido." })
        return
      }
      setState({ kind: "success" })
      form.reset()
      setAdults(1)
      setChildren(0)
    } catch {
      setState({ kind: "error", message: "Erro de rede. Tenta novamente." })
    }
  }

  if (state.kind === "success") {
    return (
      <div className="paper-card p-8 text-center">
        <OliveFlourish className="mb-4" />
        <h3 className="font-serif text-2xl italic text-primary">Pedido enviado</h3>
        <p className="mt-3 italic text-foreground/80">
          {"Recebemos o teu pedido. Vamos confirmar e enviar-te uma mensagem em breve."}
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: "idle" })}
          className="mt-6 inline-flex items-center gap-2 text-sm italic text-accent underline-offset-4 hover:underline"
        >
          <HeartGlyph className="h-3 w-3" />
          enviar outro pedido
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field name="name" label="Nome" placeholder="Nome" autoComplete="name" required>
        <UserIcon />
      </Field>
      <Field
        name="email"
        type="email"
        label="E-mail"
        placeholder="E-mail"
        autoComplete="email"
        required
      >
        <MailIcon />
      </Field>
      <Field name="phone" type="tel" label="Telefone" placeholder="Telefone" autoComplete="tel" required>
        <PhoneIcon />
      </Field>

      <div className="flex items-center justify-between gap-4">
        <span className="italic text-foreground/80">N.º de adultos</span>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <button
              type="button"
              key={n}
              className="num-pill"
              data-checked={adults === n}
              aria-pressed={adults === n}
              onClick={() => setAdults(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="italic text-foreground/80">N.º de crianças</span>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((n) => (
            <button
              type="button"
              key={n}
              className="num-pill"
              data-checked={children === n}
              aria-pressed={children === n}
              onClick={() => setChildren(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {state.kind === "error" ? (
        <p className="text-center text-sm italic text-accent">{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-md bg-accent py-3 text-center text-base font-medium tracking-wide italic text-accent-foreground transition hover:opacity-95 disabled:opacity-60"
      >
        {state.kind === "submitting" ? "A enviar..." : "Enviar pedido"}
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
  children,
}: {
  name: string
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-primary/70" aria-hidden="true">
          {children}
        </span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-md border border-border bg-card pl-10 pr-3 py-3 text-base italic text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </span>
    </label>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M5 4h3l2 5-2 1a12 12 0 006 6l1-2 5 2v3a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" strokeLinejoin="round" />
    </svg>
  )
}
