export type RegistrationInput = {
  name: string
  email: string
  phone: string
  adults: number
  children: number
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const PHONE_RE = /^[+\d\s().-]{6,30}$/

export function validateRegistration(raw: unknown):
  | { ok: true; data: RegistrationInput }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Payload inválido." }
  const r = raw as Record<string, unknown>

  const name = typeof r.name === "string" ? r.name.trim() : ""
  const email = typeof r.email === "string" ? r.email.trim().toLowerCase() : ""
  const phone = typeof r.phone === "string" ? r.phone.trim() : ""
  const adults = Number(r.adults)
  const children = Number(r.children)

  if (name.length < 2 || name.length > 120) return { ok: false, error: "Nome inválido." }
  if (!EMAIL_RE.test(email) || email.length > 200) return { ok: false, error: "Email inválido." }
  if (!PHONE_RE.test(phone)) return { ok: false, error: "Telefone inválido." }
  if (![1, 2].includes(adults)) return { ok: false, error: "Número de adultos inválido (1-2)." }
  if (![0, 1, 2, 3].includes(children)) return { ok: false, error: "Número de crianças inválido (0-3)." }

  return { ok: true, data: { name, email, phone, adults, children } }
}

// Whitelist for settings PUT — only these keys are accepted from the admin UI.
export const SETTINGS_ALLOWED_KEYS = [
  "couple_names",
  "welcome_title",
  "welcome_subtitle",
  "event_date",
  "venue_name",
  "venue_address",
  "map_url",
  "dress_code",
  "timeline",
  "hotels",
  "whatsapp_group_link",
] as const

export type SettingsKey = (typeof SETTINGS_ALLOWED_KEYS)[number]

export function sanitizeSettingsPatch(raw: unknown): Partial<Record<SettingsKey, unknown>> {
  if (!raw || typeof raw !== "object") return {}
  const r = raw as Record<string, unknown>
  const out: Partial<Record<SettingsKey, unknown>> = {}

  for (const key of SETTINGS_ALLOWED_KEYS) {
    if (!(key in r)) continue
    const value = r[key]

    if (key === "timeline") {
      if (!Array.isArray(value)) continue
      out.timeline = value
        .filter((v): v is { time: unknown; label: unknown } => !!v && typeof v === "object")
        .map((v) => ({
          time: String((v as { time: unknown }).time ?? "").slice(0, 20),
          label: String((v as { label: unknown }).label ?? "").slice(0, 200),
        }))
        .filter((v) => v.time && v.label)
        .slice(0, 20)
      continue
    }

    if (key === "hotels") {
      if (!Array.isArray(value)) continue
      out.hotels = value
        .filter((v): v is { name: unknown; distance: unknown } => !!v && typeof v === "object")
        .map((v) => ({
          name: String((v as { name: unknown }).name ?? "").slice(0, 200),
          distance: String((v as { distance: unknown }).distance ?? "").slice(0, 50),
        }))
        .filter((v) => v.name)
        .slice(0, 20)
      continue
    }

    if (typeof value === "string") {
      out[key] = value.slice(0, 1000)
    }
  }

  return out
}
