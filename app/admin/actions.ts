"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isAdminAuthenticated, destroyAdminSession } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { sanitizeSettingsPatch } from "@/lib/validation"
import { getRegistration, buildWhatsAppUrl } from "@/lib/wedding"

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }
}

export async function logoutAction() {
  await destroyAdminSession()
  redirect("/admin/login")
}

export async function approveAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  if (!id) return

  const reg = await getRegistration(id)
  if (!reg) return

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("wedding_registrations")
    .update({ status: "APROVADO" })
    .eq("id", id)
  if (error) {
    console.log("[v0] approve failed:", error.message)
    return
  }

  revalidatePath("/admin")

  // Build whatsapp link and redirect there so admin can send the message manually.
  const settingsResp = await supabase
    .from("wedding_settings")
    .select("whatsapp_group_link")
    .eq("id", 1)
    .single()
  const groupLink = settingsResp.data?.whatsapp_group_link ?? ""
  const message = `Olá ${reg.name}, o teu pedido foi aprovado! Entra no grupo de convidados: ${groupLink}`
  const url = buildWhatsAppUrl(reg.phone, message)
  redirect(url)
}

export async function rejectAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const id = String(formData.get("id") ?? "")
  if (!id) return

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("wedding_registrations")
    .update({ status: "REJEITADO" })
    .eq("id", id)
  if (error) {
    console.log("[v0] reject failed:", error.message)
    return
  }
  revalidatePath("/admin")
}

export async function updateSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin()
  const json = String(formData.get("settings") ?? "")
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    redirect("/admin?error=invalid-json")
  }

  const patch = sanitizeSettingsPatch(parsed)
  if (Object.keys(patch).length === 0) {
    redirect("/admin?error=empty-patch")
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("wedding_settings").update(patch).eq("id", 1)
  if (error) {
    console.log("[v0] update settings failed:", error.message)
    redirect("/admin?error=db")
  }

  revalidatePath("/admin")
  revalidatePath("/")
  redirect("/admin?saved=1")
}
