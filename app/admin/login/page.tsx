import { redirect } from "next/navigation"
import { isAdminAuthenticated, verifyCredentials, createAdminSession } from "@/lib/admin-auth"
import { Lock } from "lucide-react"

export const dynamic = "force-dynamic"

async function loginAction(formData: FormData) {
  "use server"
  const user = String(formData.get("user") ?? "")
  const pass = String(formData.get("pass") ?? "")
  if (!verifyCredentials(user, pass)) {
    redirect("/admin/login?error=1")
  }
  await createAdminSession()
  redirect("/admin")
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (await isAdminAuthenticated()) redirect("/admin")
  const { error } = await searchParams

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-10">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-primary">
          <Lock className="h-5 w-5" aria-hidden />
          <h1 className="font-serif text-2xl">Acesso Admin</h1>
        </div>
        <form action={loginAction} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Utilizador
            </span>
            <input
              name="user"
              required
              autoComplete="username"
              className="rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Palavra-passe
            </span>
            <input
              name="pass"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              Credenciais inválidas.
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
