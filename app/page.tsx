import Link from "next/link"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/wedding"
import { formatEventDate } from "@/lib/format"
import { RsvpForm } from "@/components/rsvp-form"
import { GuestLoginForm } from "@/components/guest-login-form"
import { getGuestSession } from "@/lib/guest-auth"
import {
  HeartDivider,
  HeartGlyph,
  OliveFlourish,
  ScallopWave,
  CornerSpray,
} from "@/components/decorations"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const session = await getGuestSession()
  if (session) redirect("/info")

  const s = await getSettings()
  const dateLabel = formatEventDate(s.event_date)

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-10 px-5 py-10 md:max-w-2xl md:gap-14 md:py-16">
      {/* HERO */}
      <section
        aria-labelledby="hero-title"
        className="paper-card relative overflow-hidden p-8 text-center md:p-12"
      >
        <CornerSpray position="top-left" className="absolute left-2 top-2" />
        <CornerSpray position="top-right" className="absolute right-2 top-2" />

        <p className="font-handwritten text-2xl text-accent/80">{dateLabel}</p>

        <h1
          id="hero-title"
          className="mt-2 text-balance font-serif text-4xl italic leading-tight text-primary md:text-5xl"
        >
          {s.welcome_title}
        </h1>

        <p className="mt-5 font-serif text-2xl italic text-accent md:text-3xl">
          {s.couple_names}
        </p>

        <OliveFlourish className="mt-6" />

        <p className="mx-auto mt-5 max-w-sm text-pretty text-base italic leading-relaxed text-foreground/80 md:text-lg">
          {s.welcome_subtitle}
        </p>

        <div className="mt-9 flex flex-col items-stretch gap-3">
          <a
            href="#login"
            className="rounded-md bg-primary py-3 text-center text-base font-medium italic text-primary-foreground transition hover:opacity-95"
          >
            Fui convidado, quero entrar
          </a>
          <a
            href="#rsvp"
            className="rounded-md border border-accent bg-transparent py-3 text-center text-base font-medium italic text-accent transition hover:bg-accent/5"
          >
            Quero fazer o RSVP
          </a>
        </div>

        <ScallopWave className="mt-10" />

        <p className="mt-6 inline-flex items-center gap-2 font-handwritten text-lg text-foreground/70">
          <LockGlyph />
          Este site é apenas para convidados aprovados.
        </p>
      </section>

      {/* RSVP */}
      <section id="rsvp" aria-labelledby="rsvp-title" className="paper-card p-7 md:p-10">
        <header className="text-center">
          <h2
            id="rsvp-title"
            className="text-balance font-serif text-3xl italic text-accent md:text-4xl"
          >
            Quero confirmar a minha presença
          </h2>
          <OliveFlourish className="mt-4" />
        </header>
        <div className="mt-7">
          <RsvpForm />
        </div>
      </section>

      {/* GUEST LOGIN */}
      <section
        id="login"
        aria-labelledby="login-title"
        className="paper-card p-7 md:p-10"
      >
        <HeartDivider />
        <header className="mt-6 text-center">
          <h2
            id="login-title"
            className="font-serif text-2xl italic text-primary md:text-3xl"
          >
            Convidado aprovado?
          </h2>
          <p className="mt-2 italic text-foreground/70">
            Introduz o teu e-mail para entrar
          </p>
        </header>
        <div className="mt-6">
          <GuestLoginForm />
        </div>
        <p className="mt-5 text-center text-sm italic text-foreground/60">
          {"Ainda não tens convite? "}
          <a href="#rsvp" className="text-accent underline-offset-4 hover:underline">
            faz o RSVP
          </a>
          .
        </p>
      </section>

      <footer className="flex flex-col items-center gap-2 pb-4 text-center">
        <HeartGlyph className="h-3 w-3 text-accent/60" />
        <p className="font-handwritten text-lg text-foreground/60">
          {`feito com carinho para ${s.couple_names.toLowerCase()}`}
        </p>
        <Link
          href="/admin/login"
          className="mt-2 text-xs italic text-foreground/40 underline-offset-4 hover:underline"
        >
          área dos noivos
        </Link>
      </footer>
    </main>
  )
}

function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  )
}
