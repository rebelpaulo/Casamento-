import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { getSettings, listRegistrations, type Registration } from "@/lib/wedding"
import { approveAction, rejectAction, logoutAction, updateSettingsAction } from "./actions"
import { OliveFlourish, HeartDivider } from "@/components/decorations"

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
    <main className="mx-auto max-w-5xl px-5 py-10 md:py-14">
      <header className="paper-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="font-handwritten text-xl text-accent/80">painel dos noivos</p>
          <h1 className="mt-1 font-serif text-3xl italic text-primary">{settings.couple_names}</h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm italic text-foreground/80 transition hover:border-accent hover:text-accent"
          >
            <LogoutGlyph />
            Terminar sessão
          </button>
        </form>
      </header>

      {saved ? (
        <div role="status" className="mt-4 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm italic text-primary">
          Configurações guardadas.
        </div>
      ) : null}
      {error ? (
        <div role="alert" className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-4 py-2 text-sm italic text-accent">
          {error === "invalid-json" ? "JSON inválido — verifica a sintaxe." : "Não foi possível guardar."}
        </div>
      ) : null}

      <section aria-labelledby="stats-title" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <h2 id="stats-title" className="sr-only">Resumo</h2>
        <Stat label="Total" value={stats.total} />
        <Stat label="Pendentes" value={stats.pending} />
        <Stat label="Aprovados" value={stats.approved} />
        <Stat label="Convidados confirmados" value={stats.guests} />
      </section>

      <section aria-labelledby="reg-title" className="mt-12">
        <header className="text-center">
          <h2 id="reg-title" className="font-serif text-3xl italic text-accent">
            Dashboard de aprovação
          </h2>
          <OliveFlourish className="mt-3" />
        </header>

        <div className="paper-card mt-6 overflow-x-auto p-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs italic uppercase tracking-wider text-foreground/60">
                <th className="px-4 py-3 font-normal">Nome</th>
                <th className="px-4 py-3 font-normal">Contacto</th>
                <th className="px-4 py-3 font-normal">Convidados</th>
                <th className="px-4 py-3 font-normal">Estado</th>
                <th className="px-4 py-3 font-normal">Data</th>
                <th className="px-4 py-3 text-right font-normal">Ações</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center italic text-foreground/60">
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

      <section aria-labelledby="settings-title" className="mt-14">
        <HeartDivider className="mb-8" />
        <header className="text-center">
          <h2 id="settings-title" className="font-serif text-3xl italic text-primary">
            Configurações
          </h2>
          <OliveFlourish className="mt-3" />
          <p className="mx-auto mt-3 max-w-xl text-sm italic text-foreground/70">
            Edita o JSON. Apenas chaves permitidas são aceites.
          </p>
        </header>

        <form action={updateSettingsAction} className="mt-6 space-y-3">
          <textarea
            name="settings"
            defaultValue={JSON.stringify(editable, null, 2)}
            spellCheck={false}
            className="paper-card min-h-[420px] w-full p-4 font-mono text-xs leading-relaxed text-foreground/90 outline-none focus:border-primary"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm italic text-primary-foreground transition hover:opacity-95"
            >
              <SaveGlyph />
              Guardar
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="paper-card p-5">
      <span className="text-xs italic uppercase tracking-wider text-foreground/60">{label}</span>
      <p className="mt-2 font-serif text-3xl italic text-primary">{value}</p>
    </div>
  )
}

function Row({ r }: { r: Registration }) {
  return (
    <tr className="border-b border-border/40 last:border-b-0 align-top">
      <td className="px-4 py-4 italic">{r.name}</td>
      <td className="px-4 py-4">
        <div className="italic text-foreground">{r.email}</div>
        <div className="text-xs italic text-foreground/60">{r.phone}</div>
      </td>
      <td className="px-4 py-4 text-sm italic">
        {r.adults} adulto{r.adults > 1 ? "s" : ""}
        {r.children > 0 ? `, ${r.children} criança${r.children > 1 ? "s" : ""}` : ""}
      </td>
      <td className="px-4 py-4">
        <span className={`status-pill status-pill--${r.status.toLowerCase()}`}>{r.status}</span>
      </td>
      <td className="px-4 py-4 text-xs italic text-foreground/60">
        {new Date(r.created_at).toLocaleString("pt-PT")}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap justify-end gap-2">
          {r.status !== "APROVADO" ? (
            <form action={approveAction}>
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs italic text-primary transition hover:bg-primary/20"
              >
                <CheckGlyph />
                Aprovar
              </button>
            </form>
          ) : null}
          {r.status !== "REJEITADO" ? (
            <form action={rejectAction}>
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs italic text-accent transition hover:bg-accent/20"
              >
                <XGlyph />
                Rejeitar
              </button>
            </form>
          ) : null}
        </div>
      </td>
    </tr>
  )
}

function LogoutGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M9 5H6a2 2 0 00-2 2v10a2 2 0 002 2h3" strokeLinecap="round" />
      <path d="M14 8l4 4-4 4M18 12H10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function SaveGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M5 5h11l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
      <path d="M7 5v5h8V5M9 19v-5h6v5" />
    </svg>
  )
}
function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}
