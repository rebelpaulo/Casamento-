import { redirect } from "next/navigation"
import { isAdminAuthenticated, verifyCredentials, createAdminSession } from "@/lib/admin-auth"
import { OliveFlourish } from "@/components/decorations"

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
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="paper-card w-full max-w-sm p-8">
        <header className="text-center">
          <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          </div>
          <h1 className="mt-3 font-serif text-2xl italic text-primary">Área dos noivos</h1>
          <OliveFlourish className="mt-3" />
        </header>

        <form action={loginAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs italic uppercase tracking-wider text-foreground/60">
              Utilizador
            </span>
            <input
              name="user"
              required
              autoComplete="username"
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 italic text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs italic uppercase tracking-wider text-foreground/60">
              Palavra-passe
            </span>
            <input
              name="pass"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 italic text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
          {error ? (
            <p role="alert" className="text-center text-sm italic text-accent">
              Credenciais inválidas.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-base italic text-primary-foreground transition hover:opacity-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
