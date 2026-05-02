import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getSettings, listRegistrations, type Registration } from "@/lib/wedding"
import { approveAction, rejectAction, logoutAction, updateSettingsAction } from "./actions"
import { LogOut, CheckCircle2, XCircle, Save, Users, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login")

  const [settings, registrations] = await Promise.all([getSettings(), listRegistrations()])
  const { saved, error } = await searchParams

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "PENDENTE").length,
    approved: registrations.filter((r) => r.status === "APROVADO").length,
    guests: registrations
      .filter((r) => r.status === "APROVADO")
      .reduce((acc, r) => acc + r.adults + r.children, 0),
  }

  // Editable settings (whitelist exposed to the textarea)
  const editable = {
    couple_names: settings.couple_names,
    welcome_title: settings.welcome_title,
    welcome_subtitle: settings.welcome_subtitle,
    event_date: settings.event_date,
    venue_name: settings.venue_name,
    venue_address: settings.venue_address,
    map_url: settings.map_url,
    dress_code: settings.dress_code,
    timeline: settings.timeline,
    hotels: settings.hotels,
    whatsapp_group_link: settings.whatsapp_group_link,
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Admin</p>
          <h1 className="mt-1 font-serif text-3xl">{settings.couple_names}</h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Terminar sessão
          </button>
        </form>
      </header>

      {saved ? (
        <div role="status" className="mt-4 rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-accent-foreground">
          Configurações guardadas.
        </div>
      ) : null}
      {error ? (
        <div role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error === "invalid-json" ? "JSON inválido — verifica a sintaxe." : "Não foi possível guardar."}
        </div>
      ) : null}

      <section aria-labelledby="stats-title" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="stats-title" className="sr-only">Resumo</h2>
        <Stat label="Total" value={stats.total} icon={<Users className="h-4 w-4" />} />
        <Stat label="Pendentes" value={stats.pending} icon={<Clock className="h-4 w-4" />} />
        <Stat label="Aprovados" value={stats.approved} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Stat label="Convidados confirmados" value={stats.guests} icon={<Users className="h-4 w-4" />} />
      </section>

      <section aria-labelledby="reg-title" className="mt-10">
        <h2 id="reg-title" className="font-serif text-2xl">Inscrições</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Aprova ou rejeita pedidos. Ao aprovar, abre uma janela do WhatsApp para enviares o link do grupo.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Pessoas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Ainda não há inscrições.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => <Row key={r.id} r={r} />)
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="settings-title" className="mt-12">
        <h2 id="settings-title" className="font-serif text-2xl">Configurações</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Edita o JSON. Apenas chaves permitidas são aceites: <code className="font-mono text-xs">couple_names</code>,{" "}
          <code className="font-mono text-xs">welcome_title</code>, <code className="font-mono text-xs">welcome_subtitle</code>,{" "}
          <code className="font-mono text-xs">event_date</code>, <code className="font-mono text-xs">venue_name</code>,{" "}
          <code className="font-mono text-xs">venue_address</code>, <code className="font-mono text-xs">map_url</code>,{" "}
          <code className="font-mono text-xs">dress_code</code>, <code className="font-mono text-xs">timeline</code>,{" "}
          <code className="font-mono text-xs">hotels</code>, <code className="font-mono text-xs">whatsapp_group_link</code>.
        </p>

        <form action={updateSettingsAction} className="mt-4 grid gap-3">
          <textarea
            name="settings"
            defaultValue={JSON.stringify(editable, null, 2)}
            spellCheck={false}
            className="min-h-[420px] w-full rounded-lg border bg-card p-4 font-mono text-xs leading-relaxed outline-none focus:border-ring"
          />
          <div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" aria-hidden />
              Guardar
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  )
}

function Row({ r }: { r: Registration }) {
  const statusClasses: Record<Registration["status"], string> = {
    PENDENTE: "border-amber-700/30 bg-amber-700/10 text-amber-900",
    APROVADO: "border-accent/40 bg-accent/10 text-accent-foreground",
    REJEITADO: "border-destructive/30 bg-destructive/10 text-destructive",
  }

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div className="font-medium">{r.name}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-foreground">{r.email}</div>
        <div className="text-xs text-muted-foreground">{r.phone}</div>
      </td>
      <td className="px-4 py-3 text-sm">
        {r.adults} adulto{r.adults > 1 ? "s" : ""}
        {r.children > 0 ? `, ${r.children} criança${r.children > 1 ? "s" : ""}` : ""}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClasses[r.status]}`}>
          {r.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(r.created_at).toLocaleString("pt-PT")}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {r.status !== "APROVADO" ? (
            <form action={approveAction}>
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/20"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Aprovar
              </button>
            </form>
          ) : null}
          {r.status !== "REJEITADO" ? (
            <form action={rejectAction}>
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-3.5 w-3.5" aria-hidden />
                Rejeitar
              </button>
            </form>
          ) : null}
        </div>
      </td>
    </tr>
  )
}
