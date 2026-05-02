import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type TimelineItem = { time: string; label: string }
export type Hotel = { name: string; distance: string }

export type WeddingSettings = {
  id: number
  couple_names: string
  welcome_title: string
  welcome_subtitle: string
  event_date: string
  venue_name: string
  venue_address: string
  map_url: string
  dress_code: string
  timeline: TimelineItem[]
  hotels: Hotel[]
  whatsapp_group_link: string
  updated_at: string
}

export type Registration = {
  id: string
  name: string
  email: string
  phone: string
  adults: number
  children: number
  status: "PENDENTE" | "APROVADO" | "REJEITADO"
  notes: string | null
  created_at: string
  updated_at: string
}

const FALLBACK_SETTINGS: WeddingSettings = {
  id: 1,
  couple_names: "Paulo Silva + Mória Neto",
  welcome_title: "Convite para a festa que nos aconteceu",
  welcome_subtitle: "Junta-te a nós num dia de celebração, amor e memórias.",
  event_date: "2025-09-13",
  venue_name: "Quinta das Oliveiras",
  venue_address: "Estrada do Sol, 123, 2500-123 Óbidos",
  map_url: "https://maps.google.com",
  dress_code: "Leve, elegante e com alma mediterrânica.",
  timeline: [
    { time: "16:30", label: "Cerimónia de renovação de votos" },
    { time: "18:00", label: "Cocktail e fotos" },
    { time: "19:00", label: "Jantar e discursos" },
    { time: "22:00", label: "Festa e dança até de madrugada" },
  ],
  hotels: [
    { name: "The Literary Man Óbidos Hotel", distance: "1,2 km" },
    { name: "Casa das Senhoras Rainhas", distance: "1,5 km" },
  ],
  whatsapp_group_link: "https://chat.whatsapp.com/SEU_LINK_AQUI",
  updated_at: new Date().toISOString(),
}

/** Public read — uses anon key + RLS public select policy. */
export async function getSettings(): Promise<WeddingSettings> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("wedding_settings")
      .select("*")
      .eq("id", 1)
      .single()

    if (error || !data) return FALLBACK_SETTINGS
    return data as WeddingSettings
  } catch {
    return FALLBACK_SETTINGS
  }
}

/** Admin read — service role bypasses RLS. */
export async function listRegistrations(): Promise<Registration[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("wedding_registrations")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as Registration[]
}

export async function getRegistration(id: string): Promise<Registration | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("wedding_registrations")
    .select("*")
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as Registration | null
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "")
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** Server-only lookup: is this email an APROVADO registration? */
export async function getApprovedRegistrationByEmail(
  email: string,
): Promise<Registration | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("wedding_registrations")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .eq("status", "APROVADO")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return null
  return (data ?? null) as Registration | null
}
