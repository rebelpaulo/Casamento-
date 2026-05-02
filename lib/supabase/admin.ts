import { createClient } from "@supabase/supabase-js"

/**
 * Service-role client. Bypasses RLS — use ONLY in server code that has already
 * authenticated the request (e.g. inside the admin area or after a secret-protected
 * API check). Never import this from a Client Component.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
