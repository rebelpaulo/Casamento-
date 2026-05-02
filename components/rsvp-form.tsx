"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "ok" } | { kind: "error"; msg: string }

export function RsvpForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus({ kind: "loading" })
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      adults: Number(fd.get("adults") ?? 1),
      children: Number(fd.get("children") ?? 0),
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ kind: "error", msg: data?.error ?? "Erro ao enviar pedido." })
        return
      }
      setStatus({ kind: "ok" })
      form.reset()
    } catch {
      setStatus({ kind: "error", msg: "Erro de rede. Tenta novamente." })
    }
  }

  if (status.kind === "ok") {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-accent" aria-hidden />
        <h3 className="font-serif text-2xl">Pedido enviado</h3>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Obrigado! Vamos rever o teu pedido e enviar-te uma confirmação por WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-4 text-sm text-primary underline-offset-4 hover:underline"
        >
          Submeter outro pedido
        </button>
      </div>
    )
  }

  const loading = status.kind === "loading"

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field id="name" label="Nome">
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className="input"
          placeholder="O teu nome completo"
        />
      </Field>

      <Field id="email" label="Email">
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className="input"
          placeholder="exemplo@email.com"
        />
      </Field>

      <Field id="phone" label="Telefone (com indicativo)">
        <input
          id="phone"
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel"
          pattern="[+\d\s().-]{6,30}"
          className="input"
          placeholder="+351 912 345 678"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field id="adults" label="Adultos">
          <select id="adults" name="adults" defaultValue="1" className="input">
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </Field>
        <Field id="children" label="Crianças">
          <select id="children" name="children" defaultValue="0" className="input">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Field>
      </div>

      {status.kind === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{status.msg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {loading ? "A enviar..." : "Enviar pedido"}
      </button>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          padding: 0.65rem 0.85rem;
          font-size: 0.95rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: var(--color-ring);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-ring) 25%, transparent);
        }
      `}</style>
    </form>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="grid gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
