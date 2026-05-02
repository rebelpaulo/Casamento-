import { redirect } from "next/navigation"
import { getGuestSession } from "@/lib/guest-auth"
import { getApprovedRegistrationByEmail, getSettings } from "@/lib/wedding"
import { formatEventDate } from "@/lib/format"
import {
  HeartDivider,
  HeartGlyph,
  OliveFlourish,
  DottedDivider,
} from "@/components/decorations"
import { GuestLogoutButton } from "@/components/guest-logout-button"

export const dynamic = "force-dynamic"

export default async function InfoPage() {
  const session = await getGuestSession()
  if (!session) redirect("/")

  // Re-validate that the guest is still APROVADO (couple may have revoked).
  const reg = await getApprovedRegistrationByEmail(session.email)
  if (!reg) redirect("/")

  const s = await getSettings()
  const dateLabel = formatEventDate(s.event_date)
  const guests = `${reg.adults} adulto${reg.adults > 1 ? "s" : ""}${
    reg.children > 0 ? ` + ${reg.children} criança${reg.children > 1 ? "s" : ""}` : ""
  }`

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-10 md:max-w-2xl md:gap-12 md:py-16">
      <section className="paper-card p-7 text-center md:p-10">
        <p className="font-handwritten text-2xl text-accent/80">{dateLabel}</p>
        <h1 className="mt-2 text-balance font-serif text-3xl italic leading-tight text-primary md:text-4xl">
          Informações para convidados aprovados
        </h1>
        <OliveFlourish className="mt-5" />
        <p className="mt-4 italic text-foreground/80">
          {`Bem-vind${reg.adults > 1 ? "os" : "o"}, `}
          <span className="text-accent">{reg.name}</span>.
        </p>
        <p className="mt-1 text-sm italic text-foreground/60">{guests}</p>
      </section>

      {/* Onde vai ser */}
      <Section title="Onde vai ser" icon={<HouseGlyph />}>
        <p className="font-serif text-xl italic text-foreground">{s.venue_name}</p>
        <p className="mt-1 italic text-foreground/70 whitespace-pre-line">{s.venue_address}</p>
        <a
          href={s.map_url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-accent px-4 py-2 text-sm italic text-accent transition hover:bg-accent/5"
        >
          <PinGlyph /> Abrir no mapa
        </a>
      </Section>

      {/* Hotéis */}
      {s.hotels.length > 0 ? (
        <Section title="Hotéis por perto" icon={<SuitcaseGlyph />}>
          <ul className="divide-y divide-border/60">
            {s.hotels.map((h, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex items-baseline gap-2 italic text-foreground">
                  <HotelGlyph />
                  {h.name}
                </span>
                <span className="text-sm italic text-foreground/60">{h.distance}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Horário */}
      {s.timeline.length > 0 ? (
        <Section title="Horário" icon={<RingsGlyph />}>
          <ol className="relative space-y-4 pl-4">
            <span
              className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-border"
              aria-hidden="true"
            />
            {s.timeline.map((t, i) => (
              <li key={i} className="relative pl-4">
                <span
                  className="absolute -left-[1px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-handwritten text-xl text-primary tabular-nums">
                    {t.time}
                  </span>
                  <span className="italic text-foreground/85">{t.label}</span>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* Dress code */}
      <Section title="Dress code" icon={<HangerGlyph />}>
        <p className="text-pretty italic leading-relaxed text-foreground/85">{s.dress_code}</p>
        <p className="mt-3 font-handwritten text-xl text-foreground/70">
          sê tu, mas em modo festa
          <HeartGlyph className="ml-2 inline-block h-3 w-3 text-accent" />
        </p>
      </Section>

      {/* WhatsApp */}
      <Section title="Grupo de convidados" icon={<ChatGlyph />}>
        <p className="italic text-foreground/80">
          Toda a comunicação acontece no grupo de WhatsApp dos convidados aprovados.
        </p>
        <a
          href={s.whatsapp_group_link}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm italic text-primary-foreground transition hover:opacity-95"
        >
          <WhatsappGlyph /> Entrar no grupo
        </a>
      </Section>

      <footer className="flex flex-col items-center gap-3 pb-2 text-center">
        <HeartDivider />
        <p className="mt-2 font-handwritten text-lg text-foreground/60">{`mal podemos esperar para te ver`}</p>
        <GuestLogoutButton />
      </footer>
    </main>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="paper-card p-7 md:p-9">
      <header className="flex items-center gap-3 text-primary">
        <span aria-hidden="true">{icon}</span>
        <h2 className="font-serif text-2xl italic">{title}</h2>
      </header>
      <DottedDivider className="my-5" />
      <div>{children}</div>
    </section>
  )
}

function HouseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <path d="M3 11l9-7 9 7" strokeLinejoin="round" />
      <path d="M5 10v9h14v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  )
}
function SuitcaseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
    </svg>
  )
}
function HotelGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4 text-primary/70">
      <path d="M4 21V6h6v6h10v9" />
      <path d="M8 11h.01M14 16h.01M18 16h.01" />
    </svg>
  )
}
function RingsGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
      <path d="M7 9l1-3h2M17 9l-1-3h-2" strokeLinecap="round" />
    </svg>
  )
}
function HangerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <path d="M12 8a2 2 0 112-2" />
      <path d="M12 8L3 18h18L12 8z" strokeLinejoin="round" />
    </svg>
  )
}
function ChatGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
      <path d="M4 5h16v11H8l-4 4V5z" strokeLinejoin="round" />
    </svg>
  )
}
function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}
function WhatsappGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2a10 10 0 00-8.7 14.9L2 22l5.3-1.4A10 10 0 1012 2zm5.3 13.6c-.2.6-1.3 1.2-1.8 1.2-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.7.5.3.7.9 2.3 1 2.4.1.2.1.3 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.4 1 1.6 2 2.6 1.4 1.2 2.6 1.6 2.9 1.7.3.1.5.1.7-.1.2-.2.8-1 1-1.3.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.1.1.7-.2 1.3z" />
    </svg>
  )
}
