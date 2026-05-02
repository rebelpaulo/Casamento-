import { getSettings } from "@/lib/wedding"
import { formatEventDate } from "@/lib/format"
import { RsvpForm } from "@/components/rsvp-form"
import { MapPin, Clock, Hotel, Shirt, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const s = await getSettings()
  const dateLabel = formatEventDate(s.event_date)

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 md:py-16">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          {dateLabel}
        </p>
        <h1 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-6xl">
          {s.welcome_title}
        </h1>
        <p className="mt-4 font-serif text-2xl text-primary md:text-3xl">{s.couple_names}</p>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
          {s.welcome_subtitle}
        </p>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-5">
        <section
          aria-labelledby="rsvp-title"
          className="md:col-span-3 rounded-xl border bg-card p-6 shadow-sm md:p-8"
        >
          <h2 id="rsvp-title" className="font-serif text-2xl md:text-3xl">
            Foste convidado? Confirma a tua presença
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preenche o formulário. Vamos rever o pedido e confirmar contigo por WhatsApp.
          </p>
          <div className="mt-6">
            <RsvpForm />
          </div>
        </section>

        <aside className="md:col-span-2 grid gap-4 content-start">
          <InfoCard icon={<MapPin className="h-5 w-5" aria-hidden />} title="Local">
            <p className="font-medium">{s.venue_name}</p>
            <p className="text-sm text-muted-foreground">{s.venue_address}</p>
            <a
              href={s.map_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Ver no mapa <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </InfoCard>

          <InfoCard icon={<Clock className="h-5 w-5" aria-hidden />} title="Programa">
            <ul className="grid gap-2 text-sm">
              {s.timeline.map((t, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-primary tabular-nums">{t.time}</span>
                  <span className="text-foreground">{t.label}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard icon={<Shirt className="h-5 w-5" aria-hidden />} title="Dress code">
            <p className="text-sm text-muted-foreground text-pretty">{s.dress_code}</p>
          </InfoCard>

          {s.hotels.length > 0 && (
            <InfoCard icon={<Hotel className="h-5 w-5" aria-hidden />} title="Onde dormir">
              <ul className="grid gap-1.5 text-sm">
                {s.hotels.map((h, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3">
                    <span className="text-foreground">{h.name}</span>
                    <span className="text-xs text-muted-foreground">{h.distance}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
        </aside>
      </div>

      <footer className="mt-16 border-t pt-8 text-center text-xs text-muted-foreground">
        <p>Feito com carinho para {s.couple_names}.</p>
      </footer>
    </main>
  )
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      {children}
    </div>
  )
}
